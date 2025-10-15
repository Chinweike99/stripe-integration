import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";
import { TransactionsModule } from "src/transactions/transactions.module";
import { StripeService } from "./services/stripe.service";
import { StripeController } from "./controllers/stripe.controller";

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule), // ✅
  ],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
