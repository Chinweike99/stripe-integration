import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from '../entities/transactions.entity';

export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus;

  @ApiProperty()
  stripePaymentIntentId?: string;

  @ApiProperty()
  metadata?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}