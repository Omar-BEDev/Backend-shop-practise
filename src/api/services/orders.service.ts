import { Types } from 'mongoose';
import { IOrder,  IProductInfo, ITem } from '../../interfaces';
import { Order } from '../models/order.model';
import Product from '../models/products.model';
import { ApiError } from '../utils/ApiError';
import { ObjectId, OrderedBulkOperation} from 'mongodb';
import { catchAsync } from '../utils/catchAsync';

const fetchAndValidateProducts = async (productIds: string[]): Promise<IProductInfo[]> => {
  const products = (await Product.find({ _id: { $in: productIds } })
    .select("price")
    .lean());

  if (products.length !== productIds.length) {
    throw new ApiError("orders total is invalid", 400);
  }
  return products;
};

const syncItemsWithPrices = (items: ITem[], products: IProductInfo[]): ITem[] => {
  const itemsMap = new Map<string, ITem>(
    items.map((item) => [item.productId, item])
  );
  
  let results: ITem[] = [];
  for (let product of products) {
    const result = itemsMap.get(product._id.toString());
    if (result) {
      result.price = product.price;
      results.push(result);
    }
  }
  return results;
};

const calculateTotalPrice = (items: ITem[]): number => {
  return items.reduce(
    (acc: number, item: ITem) => acc + item.price * item.quantity,
    0
  );
};


const getValidDbId = (dbId: string): ObjectId => {
  if (!Types.ObjectId.isValid(dbId)) {
    throw new ApiError("invalid user id", 400);
  }
  return new ObjectId(dbId);
};

//-----------------------------------------//
export const makeOrderData = async (body: {
  userId: string;
  items: ITem[];
  discountValue: number;
}): Promise<IOrder> => {
  const { userId, items, discountValue } = body;
  const dbProducts = await fetchAndValidateProducts(items.map((v) => v.productId));
  const results = syncItemsWithPrices(items, dbProducts);
  const totalPrice = calculateTotalPrice(results);
  const transformationUserId = getValidDbId(userId);
  
  const orderData: IOrder = {
    userId: transformationUserId,
    items: results,
    totalPrice,
    discountValue: discountValue || 0,
    status: 'pending',
    createdAt: new Date(),
  };
  return orderData;
};

// ------------------------------------------------//
export const createOrder = async (orderData: IOrder) => {
  const newOrder = new Order(orderData);
  await newOrder.save();
  return { message: 'Order successfully added' };
};

export const cancelOrder = async (orderId: string, id : string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError('Order not found', 404);
  }
  if (!Types.ObjectId.isValid(id)) throw new ApiError("invalid user id",400)
    const userId = new ObjectId(id)
  if (order.userId !== userId){
    throw new ApiError("permissions denied",403)
  }
  order.status = 'cancelled';
  await order.save();
  return { message: 'Order successfully cancelled' };
};

export const pendingOrder = async (orderId: string, productId: string, quantity: number,id : string) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new ApiError('Order not found', 404);
  }
  if (Types.ObjectId.isValid(id)) throw new ApiError("invalid user id",400)
  const userId = new ObjectId(id)
  if (order.userId !== userId) throw new ApiError("permissions denied",403)
  if (order.status !== 'pending') {
    throw new ApiError('Order is not in pending state', 400);
  }

  const item = order.items.find((item) => item.productId === productId);
  const validProductId = getValidDbId(productId)
  const product = await Product.findById(validProductId)
  .select("price")
  .lean()
  if (!item) {
    throw new ApiError('Product not found in order', 404);
  }
  if (!product) throw new ApiError("Product is not available",404)
  item.price = product.price
  item.quantity = quantity;

  order.totalPrice = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await order.save();
  return order;
};

export const getOrders = async (userId : string) => {
  if (!Types.ObjectId.isValid(userId)) throw new ApiError("invalid user id",400)
  
  const orders = await Order.find({userId : userId});
  return orders;
};
export const getAllOrders = async () => {
  const orders = await Order.find()
  .sort{createdAt : -1},
  .limit(50),
  .lean()
  
  const numOfOrders = await Order.countDocuments()
  const numOfOrdersCompleted = await Order.countDocuments({status: "completed"})
  return {
    orders : orders,
    numOforders : numOfOrders,
    numOfOrdersCompleted : numOfOrdersCompleted
  }
}
