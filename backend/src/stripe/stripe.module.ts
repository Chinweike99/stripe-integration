import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";
import { TransactionsModule } from "src/transactions/transactions.module";
import { StripeService } from "./services/stripe.service";
import { StripeController } from "./controllers/stripe.controller";
import { SubscriptionsModule } from "src/subscriptions/subscriptions.module";
import { ProductSetupService } from "./services/product-setup.service";


@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule),
    forwardRef(()=> SubscriptionsModule),
  ],
  providers: [StripeService, ProductSetupService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
