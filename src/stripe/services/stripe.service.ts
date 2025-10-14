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
}