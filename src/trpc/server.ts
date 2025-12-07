import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import type { NextRequest } from "next/server";
import { cache } from "react";
import { headers } from "next/headers";
import { createCaller, type AppRouter } from "@/server/api/root";
import { createContext as createTRPCContext } from "@/server/api/trpc";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
    const req: NextRequest = { headers: await headers() } as NextRequest;
    return createTRPCContext(req)
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
    caller,
    getQueryClient,
);
