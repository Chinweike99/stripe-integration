import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";


@Injectable()
export class StripeService implements OnModuleInit{
    public stripe: Stripe

    constructor(private readonly configService: ConfigService){}

    onModuleInit() {
        this.stripe = new Stripe(this.configService.get('stripe.secretKey') as string, {
            apiVersion: '2025-09-30.clover'
        })
    }

    async createCustomer(email: string, name: string): Promise<string>{
        const customer = await this.stripe.customers.create({
            email, name
        });
        return customer.id
    }

    async createPaymentIntent(
        amount: number,
        currency: string,
        customerId: string,
        metadata: any = {},
    ){
        return await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            customer: customerId,
            automatic_payment_methods: {
                enabled: true
            },
            metadata,
        })
    }

    async retrievePaymentIntent(paymentIntentId: string){
        return await this.stripe.paymentIntents.retrieve(paymentIntentId)
    }

    async createCheckoutSession(
        customerId: string, priceId: string, successUrl: string, cancelUrl: string
    ){
        return await this.stripe.checkout.sessions.create({
            customer: customerId, 
            line_items:[
                {price: priceId, quantity: 1} 
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl
        })
    }

    async createSubscription(customerId: string, priceId: string){
        return await this.stripe.subscriptions.create({
            customer: customerId,
            items: [{price: priceId}],
            payment_behavior: 'default_incomplete',
            payment_settings: {save_default_payment_method: 'on_subscription'},
            expand: ['latest_invoice.payment_intent']
        })
    }

    async cancelSubscription(subscriptionId: string){
        return await this.stripe.subscriptions.cancel(subscriptionId)
    }

      async retrieveSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

    async updateSubscription(subscriptionId: string, items: Array<{price: string}>){
        return await this.stripe.subscriptions.update(subscriptionId, {items})
    }

    async listSubscriptions(customerId: string){
        return await this.stripe.subscriptions.list({
            customer: customerId, status: 'all'
        })
     }

     async createProduct(name: string, description?: string){
        return await this.stripe.products.create({
            name, description
        })
     }

     async createPrice(
    productId: string,
    unitAmount: number,
    currency: string,
    interval: 'month' | 'year' | 'week' | 'day' = 'month',
  ) {
    return await this.stripe.prices.create({
      product: productId,
      unit_amount: unitAmount,
      currency,
      recurring: {
        interval,
      },
    });
  }

    async listProducts(active = true) {
    return await this.stripe.products.list({
      active,
    });
  }

  async listPrices(active = true) {
    return await this.stripe.prices.list({
      active,
    });
  }

}