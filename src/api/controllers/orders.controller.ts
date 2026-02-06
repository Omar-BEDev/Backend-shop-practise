import { Request, Response, NextFunction } from 'express';
import {
  makeOrderData,
  createOrder,
  cancelOrder,
  pendingOrder,
  getOrders,
  getAllOrders
} from '../services/orders.service';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../../interfaces';

export const addOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const orderData = makeOrderData(req.body);
  const message = await createOrder(await orderData);
  res.status(201).json(message);
});

export const getUserOrders = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new ApiError("we didn't found user payload",400)
  const {id} = req.user
  if (typeof id !== "string") throw new ApiError("invalid user Id",400)
  const orders = await getOrders(id);
  res.status(200).json(orders);
});

export const cancel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new ApiError("we didn't found user payload",404)
  const  {id}  = req.user;
  const orderId = req.params.id
   if (typeof id !== "string" ) throw new ApiError("invalid order id",400)
    if (typeof orderId !== "string") throw new ApiError("invalid order id",400)
  const message = await cancelOrder(orderId,id);
  res.status(200).json(message);
});

export const updateOrder = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) throw new ApiError("we didn't found user payload",400)
  const {id} = req.user
  const {productId } = req.params;
  const orderId = req.params.id
  if (typeof productId !== "string" ) throw new ApiError("invalid product id",404)
  if (typeof id !== "string") throw new ApiError("invalid order id",400)
  const { quantity } = req.body;
  if (!quantity) {
    throw new ApiError('Quantity is not required', 400);
  }
  if(typeof orderId !== "string") throw new ApiError("invalid order id",400)
  const order = await pendingOrder(orderId, productId, quantity,id);
  res.status(200).json(order);
});

export const getAdminAllOrders = catchAsync(async (req,res,next))
