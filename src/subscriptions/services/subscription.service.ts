import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { StripeService } from "src/stripe/services/stripe.service";
import { UserRepository } from "src/users/repositories/user.repository";
import { CreateSubscriptionDto } from "../dto/create-subscription.dto";
import { SubscriptionStatus } from "../entities/subscription.entity";

@Injectable()
export class SubscriptionService {
    constructor(
        private readonly subscriptionRepository: SubscriptionRepository,
        private readonly userRepository: UserRepository,
        private readonly stripeService: StripeService,
    ){}

    async createSubscription(userId: string, createSubscriptionDto: CreateSubscriptionDto){
        const user = await this.userRepository.findById(userId);
        if(!user){
            throw new NotFoundException("User not found")
        }

        if (!user.stripeCustomerId) {
        throw new BadRequestException('User does not have a Stripe customer ID');
        };

        // Check if user already has an active subscription
        const activeSubscription = await this.subscriptionRepository.findActiveSubscription(userId)
        if (activeSubscription) {
        throw new BadRequestException('User already has an active subscription');
        }

        // create subcription in stripe
        const stripeSubscription = await this.stripeService.createSubscription(
            user.stripeCustomerId,
            createSubscriptionDto.priceId
        );

        // Save subscription to database
        const subscription = await this.subscriptionRepository.create({
            userId,
            stripeSubscriptionId: stripeSubscription.id,
            stripeCustomerId: user.stripeCustomerId,
            stripePriceId: createSubscriptionDto.priceId,
            status: stripeSubscription.status as SubscriptionStatus,
            // currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            // currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        })
        return subscription;
    }

    async cancelSubscription(userId: string, subscriptionId: string){
        const subscription = await this.subscriptionRepository.findOne({
            _id: subscriptionId,
            userId
        });
        if (!subscription) {
        throw new NotFoundException('Subscription not found');
        }

        // Cancel subscription
        const cancelSubscription = await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId)

        // Update subscritpion
         const updatedSubscription = await this.subscriptionRepository.update(
      subscriptionId,
      {
        status: cancelSubscription.status as SubscriptionStatus,
        cancelAtPeriodEnd: cancelSubscription.cancel_at_period_end,
        canceledAt: new Date((cancelSubscription.canceled_at as any) * 1000) ,
      },
    );
    return updatedSubscription;
    }

    async getUserSubscriptions(userId: string) {
        return this.subscriptionRepository.findByUserId(userId);
    }

     async getActiveSubscription(userId: string) {
        return this.subscriptionRepository.findActiveSubscription(userId);
    }

    async handleStripeWebhook(subscriptionId: string, status: SubscriptionStatus, data: any){
        const subscription = await this.subscriptionRepository.findByStripeSubscriptionId(subscriptionId);
        if(subscription){
            const updateData: any = {
                status
            };

            if(data.current_period_start){
                updateData.currentPeriodStart = new Date(data.current_period_start * 1000)
            }

            if (data.current_period_end) {
                updateData.currentPeriodEnd = new Date(data.current_period_end * 1000);
            }

            if (data.cancel_at_period_end !== undefined) {
                updateData.cancelAtPeriodEnd = data.cancel_at_period_end;
            }

            return this.subscriptionRepository.update(subscription._id.toString(), updateData)
        }
        return null;
    };

    async getSubscriptionProducts(){
        const [products, prices] = await Promise.all([
            this.stripeService.listProducts(),
            this.stripeService.listPrices()
        ]);

        const productsWithPrices = products.data.map(product => ({
            id: product.id,
             name: product.name,
      description: product.description,
      prices: prices.data
        .filter(price => price.product === product.id)
        .map(price => ({
          id: price.id,
          unitAmount: price.unit_amount ? price.unit_amount / 100 : 0,
          currency: price.currency,
          interval: price.recurring?.interval,
        })),
        }))
        return productsWithPrices
    }

}