import { Controller, Post, Get, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully', type: TransactionResponseDto })
  async createTransaction(
    @GetUser() user: any,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(user.id, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully', type: [TransactionResponseDto] })
  async getUserTransactions(@GetUser() user: any) {
    return this.transactionService.getUserTransactions(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully', type: TransactionResponseDto })
  async getTransaction(
    @GetUser() user: any,
    @Param('id', ParseUUIDPipe) transactionId: string,
  ) {
    return this.transactionService.getTransactionById(transactionId, user.id);
  }
}