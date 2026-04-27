import {
  Body, Controller, Get, Param, Patch, Post,
  Query, Request, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,
  ApiParam, ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { OrderStatus } from './schemas/order.schema';

interface JwtUser {
  sub: string;
  email: string;
}

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ── Customer endpoints ────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Create a new order (auth required)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  create(@Request() req: { user: JwtUser }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.sub, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my orders (paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Paginated list of current user orders' })
  getMyOrders(
    @Request() req: { user: JwtUser },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findMyOrders(req.user.sub, page, limit);
  }

  @Get('my/:id')
  @ApiOperation({ summary: 'Get single order by ID (must be owner)' })
  @ApiParam({ name: 'id', description: 'Order MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 403, description: 'Not your order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getMyOrder(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
  ) {
    return this.ordersService.findOneForUser(id, req.user.sub);
  }

  // ── Admin endpoints ───────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: '[Admin] Get all orders with optional status filter' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll(page, limit, status);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '[Admin] Update order status' })
  @ApiParam({ name: 'id', description: 'Order MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: '[Admin] Get order stats for a specific user' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ObjectId' })
  getUserStats(@Param('userId') userId: string) {
    return this.ordersService.getUserOrderStats(userId);
  }
}
