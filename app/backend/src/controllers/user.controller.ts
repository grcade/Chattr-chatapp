import {
  searchUsersService,
  upsertUserService,
} from '../services/user.service';
import type { Request, Response } from 'express';
import asyncHandler from '../utils/AsyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export const searchUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query) {
      throw new ApiError(
        400,
        'Query parameter "q" is required',
        'QUERY_PARAM_MISSING'
      );
    }
    const users = await searchUsersService(query);
    res.status(200).json(new ApiResponse(users, 'Users found'));
  }
);

export const upsertUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username) {
      throw new ApiError(400, 'Username is required', 'USERNAME_REQUIRED');
    }
    const user = await upsertUserService(username);
    res.status(200).json(new ApiResponse(user, 'User upserted'));
  }
);
