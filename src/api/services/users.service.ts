import User from '../models/users.model';
import { IUser } from '../../interfaces';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError';

export const makeUserData = async (userData: IUser): Promise<IUser> => {
    userData.password = await bcrypt.hash(userData.password, 10);
  
  return userData;
};

export const createUser = async (userData: IUser) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

export const createJwtToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(
    { id: userId, role }, 
    secret as string, 
    {expiresIn: '1h', }
  );
  return token;
};

export const loginUser = async (email:string,password:string) => {
    const user = await User.findOne({email})
    if(!user){
        throw new ApiError("the user not found",404)
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        throw new ApiError("the password is not correct",404)
    }
    return user
}

export const bannedUserService = async (userId : string) => {
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError("the user not found",404)
    }
    user.isBanned = true
    await user.save()
    return user
}

export const changeRoleService = async (userId:string, role:string) => {
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError("the user not found",404)
    }
    user.role = role
    await user.save()
    return user
}