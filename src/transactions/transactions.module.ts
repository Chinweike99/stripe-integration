import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Transaction, TransactionSchema } from "./entities/transactions.entity";
import { TransactionRepository } from "./repositories/transaction.respository";
import { TransactionService } from "./services/transaction.service";
import { TransactionController } from "./controllers/transaction.controller";
import { UsersModule } from "../users/users.module";
import { StripeModule } from "src/stripe/stripe.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    forwardRef(() => UsersModule), // ✅ wrap this too
    forwardRef(() => StripeModule),
  ],
  providers: [TransactionRepository, TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionsModule {}
