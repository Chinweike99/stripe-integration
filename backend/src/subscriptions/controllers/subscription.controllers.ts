import { Controller, Post, Get, Body, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { SubscriptionService } from '../services/subscription.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionResponseDto } from '../dto/subscription-response.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully', type: SubscriptionResponseDto })
  async createSubscription(
    @GetUser() user: any,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.createSubscription(user.id, createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user subscriptions' })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully', type: [SubscriptionResponseDto] })
  async getUserSubscriptions(@GetUser() user: any) {
    return this.subscriptionService.getUserSubscriptions(user.id);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active subscription' })
  @ApiResponse({ status: 200, description: 'Active subscription retrieved successfully', type: SubscriptionResponseDto })
  async getActiveSubscription(@GetUser() user: any) {
    return this.subscriptionService.getActiveSubscription(user.id);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get available subscription products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getSubscriptionProducts() {
    return this.subscriptionService.getSubscriptionProducts();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription canceled successfully', type: SubscriptionResponseDto })
  async cancelSubscription(
    @GetUser() user: any,
    @Param('id', ParseUUIDPipe) subscriptionId: string,
  ) {
    return this.subscriptionService.cancelSubscription(user.id, subscriptionId);
  }
}