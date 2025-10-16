import { Injectable, OnModuleInit } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Injectable()
export class ProductSetupService implements OnModuleInit {
  constructor(private readonly stripeService: StripeService) {}

  async onModuleInit() {
    await this.ensureSampleProducts();
  }

  async ensureSampleProducts() {
    try {
      const existingProducts = await this.stripeService.listProducts();
      
      // Check if we already have sample products
      const hasBasic = existingProducts.data.some(p => p.name === 'Basic Plan');
      const hasPremium = existingProducts.data.some(p => p.name === 'Premium Plan');
      const hasEnterprise = existingProducts.data.some(p => p.name === 'Enterprise Plan');

      if (!hasBasic) {
        await this.createBasicPlan();
      }
      if (!hasPremium) {
        await this.createPremiumPlan();
      }
      if (!hasEnterprise) {
        await this.createEnterprisePlan();
      }

      console.log('Sample products initialized');
    } catch (error) {
      console.error('Failed to initialize sample products:', error);
    }
  }

  private async createBasicPlan() {
    const product = await this.stripeService.createProduct(
      'Basic Plan',
      'Perfect for getting started with our service'
    );

    await this.stripeService.createPrice(
      product.id,
      999, // $9.99
      'usd',
      'month'
    );
  }

  private async createPremiumPlan() {
    const product = await this.stripeService.createProduct(
      'Premium Plan',
      'Advanced features for growing businesses'
    );

    await this.stripeService.createPrice(
      product.id,
      2999, // $29.99
      'usd',
      'month'
    );
  }

  private async createEnterprisePlan() {
    const product = await this.stripeService.createProduct(
      'Enterprise Plan',
      'Full suite of features for large organizations'
    );

    await this.stripeService.createPrice(
      product.id,
      7999, // $79.99
      'usd',
      'month'
    );
  }
}