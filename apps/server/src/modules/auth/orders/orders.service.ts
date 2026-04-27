import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  // ── Customer: create order ────────────────────────────────────────────────

  async create(userId: string, dto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      ...dto,
    });
    return order.save();
  }

  // ── Customer: my orders (paginated) ──────────────────────────────────────

  async findMyOrders(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ orders: Order[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const filter = { userId: new Types.ObjectId(userId) };

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return { orders, total, pages: Math.ceil(total / limit) };
  }

  // ── Customer: get single order (owner check) ──────────────────────────────

  async findOneForUser(id: string, userId: string): Promise<Order> {
    const order = await this.orderModel.findById(id).lean().exec();
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    if (order.userId.toString() !== userId) throw new ForbiddenException();
    return order;
  }

  // ── Admin: get all orders ─────────────────────────────────────────────────

  async findAll(
    page = 1,
    limit = 20,
    status?: OrderStatus,
  ): Promise<{ orders: Order[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const filter = status ? { status } : {};

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'email')
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return { orders, total, pages: Math.ceil(total / limit) };
  }

  // ── Admin: update status ──────────────────────────────────────────────────

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .exec();
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  // ── Admin: stats per user ─────────────────────────────────────────────────

  async getUserOrderStats(userId: string) {
    const stats = await this.orderModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$userId',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' },
          lastOrderDate: { $max: '$createdAt' },
        },
      },
    ]);
    return stats[0] ?? { totalOrders: 0, totalSpent: 0, avgOrderValue: 0 };
  }
}
