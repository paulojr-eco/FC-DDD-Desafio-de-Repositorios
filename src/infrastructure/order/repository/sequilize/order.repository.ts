import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    try {
      const order = await OrderModel.findByPk(entity.id, {
        include: ['items'],
      });
      if (order === null) {
        throw new Error('Order not found');
      }
      order.customer_id = entity.customerId;
      order.total = entity.total();

      await OrderItemModel.destroy({ where: { order_id: entity.id } });

      for (const item of entity.items) {
        await OrderItemModel.create({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        });
      }

      await order.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error on updating order: ${error.message}`);
      } else {
        throw new Error(`Error on updating order: ${error}`);
      }
    }
  }

  async find(id: string): Promise<Order> {
    try {
      let orderModel;

      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: [{ model: OrderItemModel }],
      });
      if (!orderModel) {
        throw new Error('Order not found');
      }

      const orderItens = orderModel.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          )
      );
      const order = new Order(id, orderModel.customer_id, orderItens);
      return order;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error on finding one order: ${error.message}`);
      } else {
        throw new Error(`Error on finding one order ${error}`);
      }
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      const orderModels = await OrderModel.findAll({
        include: [{ model: OrderItemModel }],
      });

      const orders = orderModels.map((orderModel) => {
        const orderItens = orderModel.items.map(
          (item) =>
            new OrderItem(
              item.id,
              item.name,
              item.price,
              item.product_id,
              item.quantity
            )
        );
        return new Order(orderModel.id, orderModel.customer_id, orderItens);
      });

      return orders;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error on finding all orders: ${error.message}`);
      } else {
        throw new Error(`Error on finding all orders: ${error}`);
      }
    }
  }
}
