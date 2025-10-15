import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus } from '../entities/subscription.entity';

export class SubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  stripeSubscriptionId: string;

  @ApiProperty()
  stripeCustomerId: string;

  @ApiProperty()
  stripePriceId: string;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty()
  currentPeriodStart: Date;

  @ApiProperty()
  currentPeriodEnd: Date;

  @ApiProperty()
  cancelAtPeriodEnd: boolean;

  @ApiProperty()
  canceledAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}