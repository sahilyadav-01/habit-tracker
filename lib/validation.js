import { z } from 'zod';

export const habitCreateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const habitCompleteSchema = z.object({}); // No body needed

export const validateHabitCreate = (data) => habitCreateSchema.safeParse(data);
export const validateHabitComplete = (data) => habitCompleteSchema.safeParse(data);

// Future auth schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
