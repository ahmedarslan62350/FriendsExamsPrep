import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { User } from '../users/user.model';
import { RegisterInput, LoginInput } from './auth.validation';

const signToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
  });

  const token = signToken(user._id.toString(), user.email);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      streak: user.streak,
      leaderboardScore: user.leaderboardScore,
      createdAt: user.createdAt,
    },
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken(user._id.toString(), user.email);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      streak: user.streak,
      leaderboardScore: user.leaderboardScore,
    },
  };
};
