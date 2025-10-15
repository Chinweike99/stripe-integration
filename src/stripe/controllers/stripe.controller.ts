import { Controller, Post, Body, Headers,  Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { StripeService } from '../services/stripe.service';
import { TransactionService } from '../../transactions/services/transaction.service';
import { TransactionStatus } from 'src/transactions/entities/transactions.entity';
import type { RawBodyRequest } from '@nestjs/common';

@ApiTags('Stripe Webhooks')
@Controller('stripe/webhook')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const payload = request.rawBody;

    if (!payload) {
    throw new Error('Missing raw body for Stripe webhook');
    }


    try {
      const event = this.stripeService.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );

      switch (event.type) {
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

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (err) {
      console.log(`Webhook error: ${err.message}`);
      throw err;
    }
  }
}