import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TransactionDocument = Transaction & Document;

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  WITHDRAWAL = 'withdrawal',
  DEPOSIT = 'deposit',
}

@Schema({ timestamps: true})
export class Transaction {
    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: 'User'})
    userId: string;

    @Prop({required: true})
    amount: string;

    @Prop({ required: true, default: 'USD' })
    currency: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, enum: TransactionType })
    type: TransactionType;

    @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING})
    status: TransactionStatus;

    @Prop()
    stripePaymentIntentId?: string;

    @Prop()
    stripeCustomerId?: string;

    @Prop({ type: MongooseSchema.Types.Mixed })
    metadata?: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)
