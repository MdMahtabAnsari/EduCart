'use client';
import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { SlidersHorizontal } from 'lucide-react';
import { UserCard } from "@/components/user/user";
import { useInView } from "react-intersection-observer";
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { UserFilter } from '@/components/filters/user-filter';
import { FilterUserSchema } from '@/lib/schema/user';


export function UserList() {
    const [filters, setFilters] = useState<FilterUserSchema>({
        search: "",
        role: "all",
        isBanned: "all",
    });
    const limit = 12;
    const { ref, inView } = useInView();


    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = api.admin.user.getUsersWithInfiniteScroll.useInfiniteQuery(
        {
            ...filters,
            search: filters.search?.trim() === "" ? undefined : filters.search,
            limit,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: undefined,
        }
    );
    const onUnban = (userId: string) => {
        toast.promise(
            authClient.admin.unbanUser({
                userId
            }).then(() => {
                refetch();
            }
            ),
            {
                loading: 'Unbanning user...',
                success: 'User unbanned successfully',
                error: (error) => `Error unbanning user: ${error.message}`,
            }
        );
    }

    const onRevokeSessions = (userId: string) => {
        toast.promise(
            authClient.admin.revokeUserSessions({
                userId
            }).then(() => {
                refetch();
            }),
            {
                loading: 'Revoking user sessions...',
                success: 'User sessions revoked successfully',
                error: (error) => `Error revoking user sessions: ${error.message}`,
            }
        );
    };

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);
    const users = data?.pages.flatMap((p) => p.users) ?? [];

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <UserFilter
                trigger={<Button className="cursor-pointer w-fit" size="lg"><SlidersHorizontal /> Filter</Button>}
                onSubmit={(values) => {
                    setFilters(values);
                }}
                defaultValues={filters}
                show={{ search: true, role: true, isBanned: true }}
            />

            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
                <div className="flex flex-col gap-4">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} unBan={onUnban} revokeSessions={onRevokeSessions} onSucess={refetch} />
                    ))}
                </div>
                <div ref={ref} className="flex justify-center my-4"
                >
                    {isFetchingNextPage ? (
                        <Spinner />
                    ) : !hasNextPage ? (
                        <div className="text-muted-foreground">No more users to load</div>
                    ) : undefined}
                </div>
            </div>
        </div>
    );
}