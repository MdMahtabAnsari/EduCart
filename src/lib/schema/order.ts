import { z } from 'zod/v4'
import { id } from '@/lib/schema/common';
import { pageLimitSchema } from '@/lib/schema/page';

export const orderSchema = z.object({
    courseIds: z.array(id)
});

export const filterTeacherOrdersSchema = z.object({
    pageLimit: pageLimitSchema,
    shareAmount: z.enum(['ASC', 'DESC']).optional(),
    itemAmount: z.enum(['ASC', 'DESC']).optional(),
    orderDate: z.enum(['ASC', 'DESC']).optional(),
    search: z.string().optional(),
});


export const filterUserOrdersSchema = z.object({
    pageLimit: pageLimitSchema,
    orderDate: z.enum(['ASC', 'DESC']).optional(),
    amount: z.enum(['ASC', 'DESC']).optional(),
    search: z.string().optional(),
});
