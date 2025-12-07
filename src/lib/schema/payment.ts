import {z} from 'zod/v4';

export const verifyRazorpayPaymentSchema = z.object({
    paymentId: z.string(),
    orderId: z.string(),
    signature: z.string(),
});

export type VerifyRazorpayPaymentSchema = z.infer<typeof verifyRazorpayPaymentSchema>;