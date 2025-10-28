import {z} from 'zod/v4'

export const username = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.');

export const password = z.string().min(8).max(100).regex(/[A-Z]/, 'Password must contain at least one uppercase letter.').regex(/[a-z]/, 'Password must contain at least one lowercase letter.').regex(/[0-9]/, 'Password must contain at least one number.').regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.');

export const id = z.uuid();