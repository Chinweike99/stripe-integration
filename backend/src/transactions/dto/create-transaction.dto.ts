import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/transactions.entity';

export class CreateTransactionDto {
  @ApiProperty({ example: 100.50 })
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'Product purchase' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.PAYMENT })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: { productId: '123', orderId: '456' }, required: false })
  metadata?: any;
}