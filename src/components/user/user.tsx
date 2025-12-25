"use client";
import { UserRouterOutput } from "@/server/api/routers/admin/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban,UserRoundCheck,Clock } from 'lucide-react';
import {BanDialog} from "@/components/dialog/ban/ban-dialog";

interface UserCardProps {
    user: UserRouterOutput["getUsersWithInfiniteScroll"]["users"][number];
    unBan?: (userId: string) => void;
    revokeSessions?: (userId: string) => void;
    onSucess?: () => void;
}

export function UserCard({ user, unBan, revokeSessions,onSucess }: UserCardProps) {
    const { name, image, role, email,banned} = user;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className="w-12 h-12 border">
                    <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                    <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold tracking-tight">
                            {name}
                        </CardTitle>

                        {role && (
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                {role}
                            </Badge>
                        )}
                        {banned && (<Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                            Banned
                        </Badge>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">{email}</p>
                </div>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
                {!banned ? (
                    <BanDialog userId={user.id} onSuccess={onSucess} trigger={
                        <Button variant="destructive" size="lg" className="cursor-pointer">
                            <Ban /> Ban User
                        </Button>
                    } />
                ) : (
                    <Button variant="secondary" size="lg" className="cursor-pointer" onClick={() => unBan?.(user.id)}>
                        <UserRoundCheck /> Unban User
                    </Button>
                )}
                <Button variant="secondary" size="lg" className="cursor-pointer" disabled={user.sessions.length === 0} onClick={() => revokeSessions?.(user.id)}>
                    <Clock /> Revoke Sessions
                </Button>
            </CardFooter>
        </Card>
    );
}
