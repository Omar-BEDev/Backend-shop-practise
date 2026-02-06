import { Response } from 'express';
import {
  makeUserData,
  createUser,
  createJwtToken,
  loginUser,
  bannedUserService,
  changeRoleService,
} from '../services/users.service';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../../interfaces';
import strict from 'node:assert/strict';
import { ApiError } from '../utils/ApiError';

export const login = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);
  const token = createJwtToken(user._id.toString(), user.role);
  res.status(200).json({ 
    message: 'the login is succesfully',
    user: user.name,
    token,
  });
});

export const signup = catchAsync(async (req: AuthRequest, res: Response) => {
  req.body.role = "user"
  const userData = await makeUserData(req.body);
  const newUser = await createUser(userData);
  const token = createJwtToken(newUser._id.toString(), newUser.role);
  res.status(200).json({
    message: 'the create account is succesfully',
    user: newUser.name,
    token,
  });
});

export const bannedUser = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError("we didn't found user payload",400)
  const { id } = req.user;
  await bannedUserService(id.toString());
  res.status(200).json({ message: 'the user is banned' });
});

export const changeRole = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError("we didn't found user payload",400)
  const { id } = req.user;
  const { role } = req.body;
  if (role !== "Super admin") throw new ApiError("permissions denied", 403)
  await changeRoleService(id.toString(), role);
  res.status(200).json({ message: 'the role is changed' });
});
