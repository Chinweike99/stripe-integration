// import { Controller, Post, Body, Headers,  Req } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { Request } from 'express';
// import { StripeService } from '../services/stripe.service';
// import { TransactionService } from '../../transactions/services/transaction.service';
// import { TransactionStatus } from 'src/transactions/entities/transactions.entity';
// import type { RawBodyRequest } from '@nestjs/common';
// import { SubscriptionService } from 'src/subscriptions/services/subscription.service';
// import { SubscriptionStatus } from 'src/subscriptions/entities/subscription.entity';

// @ApiTags('Stripe Webhooks')
// @Controller('stripe/webhook')
// export class StripeController {
//   constructor(
//     private readonly stripeService: StripeService,
//     private readonly transactionService: TransactionService,
//     private readonly subscriptionService: SubscriptionService,
//   ) {}

//   @Post()
//   @ApiOperation({ summary: 'Handle Stripe webhooks' })
//   @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
//   async handleWebhook(
//     @Headers('stripe-signature') signature: string,
//     @Req() request: RawBodyRequest<Request>,
//   ) {
//     const payload = request.rawBody;

//     if (!payload) {
//     throw new Error('Missing raw body for Stripe webhook');
//     }


//     try {
//       const event = this.stripeService.stripe.webhooks.constructEvent(
//         payload,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET as string,
//       );

//       switch (event.type) {
//         case 'payment_intent.succeeded':
//           const paymentIntent = event.data.object;
//           await this.transactionService.handleStripeWebhook(
//             paymentIntent.id,
//             TransactionStatus.COMPLETED,
//           );
//           break;

//         case 'payment_intent.payment_failed':
//           const failedPaymentIntent = event.data.object;
//           await this.transactionService.handleStripeWebhook(
//             failedPaymentIntent.id,
//             TransactionStatus.FAILED,
//           );
//           break;
        
//            case 'customer.subscription.created':
//         case 'customer.subscription.updated':
//         case 'customer.subscription.deleted':
//           const subscription = event.data.object;
//           await this.subscriptionService.handleStripeWebhook(
//             subscription.id,
//             subscription.status as SubscriptionStatus,
//             subscription,
//           );
//           break;

//         default:
//           console.log(`Unhandled event type: ${event.type}`);
//       }

//       return { received: true };
//     } catch (err) {
//       console.log(`Webhook error: ${err.message}`);
//       throw err;
//     }
//   }
// }








import * as common from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { StripeService } from '../services/stripe.service';
import { TransactionService } from '../../transactions/services/transaction.service';
import { SubscriptionService } from '../../subscriptions/services/subscription.service';
// import { TransactionStatus } from '../../transactions/entities/transaction.entity';
import { SubscriptionStatus } from '../../subscriptions/entities/subscription.entity';
import { TransactionStatus } from 'src/transactions/entities/transactions.entity';

@ApiTags('Stripe Webhooks')
@common.Controller('stripe/webhook')
export class StripeController {
  private readonly logger = new common.Logger(StripeController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly transactionService: TransactionService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @common.Post()
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(
    @common.Headers('stripe-signature') signature: string,
    @common.Req() request: common.RawBodyRequest<Request>,
  ) {
    const payload = request.rawBody as Buffer | string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let event;

    try {
      event = this.stripeService.stripe.webhooks.constructEvent(
        payload ,
        signature,
        endpointSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw err;
    }

    this.logger.log(`Received event: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          await this.handleCheckoutSessionCompleted(session);
          break;

        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          await this.transactionService.handleStripeWebhook(
            paymentIntent.id,
            TransactionStatus.COMPLETED,
          );
          break;

        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          await this.transactionService.handleStripeWebhook(
            failedPaymentIntent.id,
            TransactionStatus.FAILED,
          );
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          await this.subscriptionService.handleStripeWebhook(
            subscription.id,
            subscription.status as SubscriptionStatus,
            subscription,
          );
          break;

        case 'invoice.payment_succeeded':
          const invoice = event.data.object;
          await this.handleInvoicePaymentSucceeded(invoice);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`);
      throw error;
    }
  }

  private async handleCheckoutSessionCompleted(session: any) {
    this.logger.log(`Checkout session completed: ${session.id}`);
    
    // Handle subscription checkout
    if (session.mode === 'subscription' && session.subscription) {
      const subscription = await this.stripeService.retrieveSubscription(session.subscription);
      
      // Create subscription in our database
      if (session.metadata?.userId) {
        await this.subscriptionService.createSubscriptionFromWebhook(
          session.metadata.userId,
          subscription,
        );
      }
    }
    
    // Handle one-time payment checkout
    if (session.mode === 'payment' && session.payment_intent) {
      const paymentIntent = await this.stripeService.retrievePaymentIntent(session.payment_intent);
      
      // Create transaction in our database
      if (session.metadata?.userId) {
        await this.transactionService.createTransactionFromWebhook(
          session.metadata.userId,
          paymentIntent,
          session.metadata,
        );
      }
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: any) {
    this.logger.log(`Invoice payment succeeded: ${invoice.id}`);
    
    // Update subscription status if needed
    if (invoice.subscription) {
      const subscription = await this.stripeService.retrieveSubscription(invoice.subscription);
      await this.subscriptionService.handleStripeWebhook(
        subscription.id,
        subscription.status as SubscriptionStatus,
        subscription,
      );
    }
  }
}