"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm} from "react-hook-form";
import { toast } from "sonner";
import { banUserSchema, type BanUserSchema } from "@/lib/schema/user";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth/auth-client";


export interface BanFormProps {
    userId: string;
    onSuccess?: () => void;
}


export function BanForm({ userId, onSuccess }: BanFormProps) {
    const form = useForm<BanUserSchema>({
        resolver: zodResolver(banUserSchema),
        defaultValues: {
            userId: userId,
            reason: "",
            banExpires: undefined,
        },
    });
    const onSubmit = (data: BanUserSchema) => {
        console.log("Submitting ban form with data:", data);
        toast.promise(
            authClient.admin.banUser({
                userId: data.userId,
                banReason: data.reason?.trim() === "" ? undefined : data.reason,
                banExpiresIn: data.banExpires ? Math.floor(data.banExpires.getTime()/1000) : undefined,
            }).then(() => {
                onSuccess?.();
            }
            ),
            {
                loading: 'Banning user...',
                success: 'User banned successfully',
                error: (error) => `Error banning user: ${error.message}`,
            }
        );
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-medium">Reason for Ban</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter reason for ban (optional)"
                                    {...field}
                                    className="focus:ring-primary focus:border-primary/70 transition-all"
                                    rows={4}
                                />
                            </FormControl>
                            <FormDescription>
                                Provide a reason for banning the user (optional).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="banExpires"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-medium">Ban Expiration Date</FormLabel>
                            <FormControl>
                                <DatePicker
                                    placeholder="Select ban expiration date (optional)"
                                    {...field}
                                    className="w-full focus:ring-primary focus:border-primary/70 transition-all"
                                    disablePastDates
                                />
                            </FormControl>
                            <FormDescription>
                                Set an expiration date for the ban (optional). Leave empty for a permanent ban.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                    className="w-full cursor-pointer"
                >
                    Ban User
                </Button>
            </form>
        </Form>
    );
}

export function BanCard({ userId, onSuccess }: BanFormProps) {
    return (
        <Card className="w-full max-w-lg mx-auto h-fit">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Ban User</CardTitle>
                <CardDescription>
                    Fill out the form below to ban the user.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <BanForm userId={userId} onSuccess={onSuccess} />
            </CardContent>
        </Card>
    );
}



