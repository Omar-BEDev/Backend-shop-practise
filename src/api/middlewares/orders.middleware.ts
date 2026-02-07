import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
// Zod schema for order validation
const orderSchema = z.object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
    items: z.array(
      z.object({
        productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
        name: z.string(),
        quantity: z.number().positive(),
      })
    ),
    totalPrice: z.number().positive(),
    discountValue: z.number().optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).optional(),
  });
  

// Zod schema for query params validation
const queryParamsSchema = z.object({
    limit: z.string().optional(), 
    pending: z.string().optional(), 
});


export const validateOrderReqBody = (req: Request, res: Response, next: NextFunction) => {
  const result = orderSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(result.error.message,400)
  }

  next();
};

export const validateOrderMongoId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    throw new ApiError("invalid product id params",400)
    }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("'Invalid MongoDB ID'",400)
  }

  next();
};

export const validateOrderQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const result = queryParamsSchema.safeParse(req.query);
  
    if (!result.success) {
      throw new ApiError(result.error.message,400)
    }
  
    next();
  };
  
