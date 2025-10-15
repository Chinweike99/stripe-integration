import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from '../../common/interfaces/repository.interface';
import { Transaction, TransactionDocument, TransactionStatus } from '../entities/transactions.entity';
// import { Transaction, TransactionDocument, TransactionStatus, TransactionType } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository implements IRepository<Transaction> {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async create(entity: Partial<Transaction>): Promise<Transaction> {
    const transaction = new this.transactionModel(entity);
    return transaction.save();
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactionModel.findById(id).populate('userId', 'name email').exec();
  }

  async findOne(filter: any): Promise<Transaction | null> {
    return this.transactionModel.findOne(filter).populate('userId', 'name email').exec();
  }

  async findAll(filter?: any): Promise<Transaction[]> {
    return this.transactionModel.find(filter || {}).populate('userId', 'name email').exec();
  }

  async update(id: string, entity: Partial<Transaction>): Promise<Transaction | null> {
    return this.transactionModel
      .findByIdAndUpdate(id, entity, { new: true })
      .populate('userId', 'name email')
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Custom methods
  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionModel
      .find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(transactionId: string, status: TransactionStatus): Promise<Transaction | null> {
    return this.transactionModel
      .findByIdAndUpdate(transactionId, { status }, { new: true })
      .exec();
  }

  async findByStripePaymentIntent(paymentIntentId: string): Promise<Transaction | null> {
    return this.transactionModel
      .findOne({ stripePaymentIntentId: paymentIntentId })
      .populate('userId', 'name email')
      .exec();
  }
}