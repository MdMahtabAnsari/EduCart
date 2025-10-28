"use client"
import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query'
import { useState, useEffect, ReactNode } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const QueryProvider = ({ children }: { children: ReactNode }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [queryClient] = useState(() => new QueryClient());
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}