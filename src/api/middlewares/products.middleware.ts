import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';

// Zod schema for product validation
const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  images: z.array(z.string()).optional(),
  category: z.string(),
   
});

// Zod schema for query params validation
const queryParamsSchema = z.object({
    category: z.string().optional(),
    price: z.string().optional(), // Can be extended to enforce number conversion
});


export const validateProductReqBody = (req: Request, res: Response, next: NextFunction) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success){
    throw new ApiError(result.error.message,400)
  }

  next();
};

export const validateProductMongoId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    throw new ApiError("invalid product id params",400)
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("'Invalid MongoDB ID'",400)
  }

  next();
};

export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const result = queryParamsSchema.safeParse(req.query);
  
    if (!result.success) {
      throw new ApiError(result.error.message,400)
    }
  
    next();
  };
  
