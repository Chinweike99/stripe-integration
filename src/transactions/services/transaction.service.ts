import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { TransactionRepository } from "../repositories/transaction.respository";
import { UserRepository } from "src/users/repositories/user.repository";
import { StripeService } from "src/stripe/services/stripe.service";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { TransactionStatus, TransactionType } from "../entities/transactions.entity";




@Injectable()
export class TransactionService {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly userRepository: UserRepository,
        private readonly stripeService: StripeService,
    ){}

    async createTransaction(userId: string, createTransactionDto: CreateTransactionDto){
        const user = await this.userRepository.findById(userId);
        if(!user){
            throw new NotFoundException("User not found")
        }

        if(!user.stripeCustomerId){
            throw new BadRequestException("User does not have a stripe customer ID")
        }
        let stripePaymentIntentId: string | undefined;

        if(createTransactionDto.type === TransactionType.PAYMENT){
            const paymentIntent = await this.stripeService.createPaymentIntent(
                createTransactionDto.amount,
                createTransactionDto.currency,
                user.stripeCustomerId,
                createTransactionDto.metadata
            );
            stripePaymentIntentId = paymentIntent.id;
        }

        const transaction = await this.transactionRepository.create({
            _id: userId,
            ...createTransactionDto,
            amount: String(createTransactionDto.amount),
            stripePaymentIntentId,
            stripeCustomerId: user.stripeCustomerId,
            status: stripePaymentIntentId ? TransactionStatus.PENDING : TransactionStatus.COMPLETED
        })
        return transaction;
    }

    async getUserTransactions(userId: string){
        return this.transactionRepository.findByUserId(userId)
    }

    async getTransactionById(transactionId: string, userId?: string) {
    const filter: any = { _id: transactionId };
    if (userId) {
      filter.userId = userId;
    }

    const transaction = await this.transactionRepository.findOne(filter);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async updateTransactionStatus(transactionId: string, status: TransactionStatus) {
    const transaction = await this.transactionRepository.updateStatus(transactionId, status);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async handleStripeWebhook(paymentIntentId: string, status: TransactionStatus) {
    const transaction = await this.transactionRepository.findByStripePaymentIntent(paymentIntentId);
    if (transaction) {
      return this.transactionRepository.updateStatus(transaction._id.toString(), status);
    }
    return null;
  }
}