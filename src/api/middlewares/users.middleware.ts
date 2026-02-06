import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../../interfaces';

// Zod schema for user validation
const userSchema = z.object({
  name: z.string(),
  nickname: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  address: z.object({
    country: z.string().trim().min(4).max(13),
    city: z.string(),
  }),
});

export const validateUserReqBody = (req: Request, res: Response, next: NextFunction) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) throw new ApiError(result.error.message, 400)

  next();
};

export const validateUserMongoId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (typeof id !== "string") throw new  ApiError("invalid user id params",400)

  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError('Invalid MongoDB ID',400)

  next();
};
export const isSuperAdmin = (req : AuthRequest,res : Response,next: NextFunction) => {
  if (!req.user) throw new ApiError("we didn't found user pyload",404) 
  const {role} = req.user
  if (role !== "super_admin") throw new ApiError("permissions denied",403)
  next()

}

export const isHaveAccess = (req : AuthRequest,res : Response,next: NextFunction) => {
  if (!req.user) throw new ApiError("we didn't found user pyload",404) 
    const {role} = req.user
    if (role !== "super_admin" && role !== "admin") throw new ApiError("permissions denied",403)
    next()
}