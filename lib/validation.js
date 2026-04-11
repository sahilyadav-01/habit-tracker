import { z } from 'zod';

export const habitCreateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const habitCompleteSchema = z.object({}); // No body needed

export const validateHabitCreate = (data) => habitCreateSchema.safeParse(data);
export const validateHabitComplete = (data) => habitCompleteSchema.safeParse(data);

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const sendOtpSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});
