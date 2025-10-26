import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { StripeService } from '../services/stripe.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { ConfigService } from '@nestjs/config';

@ApiTags('Checkout')
@ApiBearerAuth()
@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  @Post('subscription')
  @ApiOperation({ summary: 'Create subscription checkout session' })
  @ApiResponse({ status: 201, description: 'Checkout session created successfully' })
  async createSubscriptionCheckout(
    @GetUser() user: any,
    @Body() body: { priceId: string },
  ) {
    const userData = await this.userRepository.findById(user.id);
    if (!userData || !userData.stripeCustomerId) {
      throw new Error('User not found or no Stripe customer ID');
    }

    const successUrl = `${this.configService.get('FRONTEND_URL')}/dashboard/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${this.configService.get('FRONTEND_URL')}/dashboard/subscriptions`;

    const session = await this.stripeService.createCheckoutSession(
      userData.stripeCustomerId,
      body.priceId,
      successUrl,
      cancelUrl,
      {
        userId: user.id,
        type: 'subscription',
      },
    );

    return { sessionId: session.id, url: session.url };
  }

  @Post('payment')
  @ApiOperation({ summary: 'Create one-time payment checkout session' })
  @ApiResponse({ status: 201, description: 'Payment checkout session created successfully' })
  async createPaymentCheckout(
    @GetUser() user: any,
    @Body() body: { amount: number; currency: string; description: string },
  ) {
    const userData = await this.userRepository.findById(user.id);
    if (!userData || !userData.stripeCustomerId) {
      throw new Error('User not found or no Stripe customer ID');
    }

    const successUrl = `${this.configService.get('FRONTEND_URL')}/dashboard/transactions/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${this.configService.get('FRONTEND_URL')}/dashboard/transactions`;

    const session = await this.stripeService.createPaymentCheckoutSession(
      userData.stripeCustomerId,
      body.amount,
      body.currency,
      successUrl,
      cancelUrl,
      {
        userId: user.id,
        description: body.description,
        type: 'payment',
      },
    );

    return { sessionId: session.id, url: session.url };
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Retrieve checkout session' })
  @ApiResponse({ status: 200, description: 'Checkout session retrieved successfully' })
  async getCheckoutSession(@Param('sessionId') sessionId: string) {
    const session = await this.stripeService.retrieveCheckoutSession(sessionId);
    return session;
  }

  @Post('portal')
  @ApiOperation({ summary: 'Create customer portal session' })
  @ApiResponse({ status: 201, description: 'Portal session created successfully' })
  async createPortalSession(@GetUser() user: any) {
    const userData = await this.userRepository.findById(user.id);
    if (!userData || !userData.stripeCustomerId) {
      throw new Error('User not found or no Stripe customer ID');
    }

    const returnUrl = `${this.configService.get('FRONTEND_URL')}/dashboard/subscriptions`;

    const session = await this.stripeService.createPortalSession(
      userData.stripeCustomerId,
      returnUrl,
    );

    return { url: session.url };
  }
}