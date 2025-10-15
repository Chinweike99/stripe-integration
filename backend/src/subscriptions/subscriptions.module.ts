import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './entities/subscription.entity';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { SubscriptionService } from './services/subscription.service';
import { UsersModule } from '../users/users.module';
import { StripeModule } from '../stripe/stripe.module';
import { SubscriptionController } from './controllers/subscription.controllers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
    forwardRef(() => UsersModule), 
    forwardRef(() => StripeModule),
  ],
  providers: [SubscriptionRepository, SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionsModule {}