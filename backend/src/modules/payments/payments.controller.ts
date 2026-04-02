import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface CreateOrderDto {
  plan: 'starter' | 'pro' | 'enterprise';
  amount: number;
}

interface VerifyPaymentDto {
  orderId: string;
  paymentId: string;
  signature: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('key')
  getKey() {
    return { keyId: this.paymentsService.getKeyId() };
  }

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: any,
  ) {
    const receipt = `order_${user.id}_${Date.now()}`;
    const order = await this.paymentsService.createOrder(
      createOrderDto.amount,
      'INR',
      receipt,
    );
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    const isValid = await this.paymentsService.verifyPayment(
      verifyPaymentDto.orderId,
      verifyPaymentDto.paymentId,
      verifyPaymentDto.signature,
    );

    if (isValid) {
      // Here you would typically update the user's subscription in the database
      return { success: true, message: 'Payment verified successfully' };
    } else {
      return { success: false, message: 'Payment verification failed' };
    }
  }
}
