import { getAllConversationsService } from '../services/conversation.service';
import { searchUsersService } from '../services/user.service';
import asyncHandler from '../utils/AsyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import type { Request, Response } from 'express';

export const getConversation = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, 'Username parameter is required');
  }

  const user: any[] | undefined = await searchUsersService(username);

  if (!user || user.length === 0) {
    throw new ApiError(404, 'User not found');
  }

  const userId = user[0].id;
  if (!userId) {
    throw new ApiError(500, 'User ID not found');
  }

  const conversations = await getAllConversationsService(userId);

  res
    .status(200)
    .json(
      new ApiResponse(conversations, 'Conversations retrieved successfully')
    );
});
