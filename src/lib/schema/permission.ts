import {z} from "zod/v4";

export const permissionSchema = z.object({
    canCreate: z.boolean(),
    canRead: z.boolean(),
    canUpdate: z.boolean(),
    canDelete: z.boolean(),
});