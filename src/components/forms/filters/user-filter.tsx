"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type FilterUserSchema, filterUserSchema } from "@/lib/schema/user";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, UserCog, Ban, Filter } from "lucide-react";

export interface UserFilterFormProps {
    onSubmit: (values: FilterUserSchema) => void;
    defaultValues: FilterUserSchema;
    show: {
        search: boolean;
        role: boolean;
        isBanned: boolean;
    }
}

export function UserFilterForm({ onSubmit, defaultValues, show }: UserFilterFormProps) {
    const { search, role, isBanned } = show;
    
    const form = useForm<FilterUserSchema>({
        resolver: zodResolver(filterUserSchema),
        defaultValues,
        mode: "onChange",
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 pb-8">
                
                {/* Search Input */}
                {search && (
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Search className="w-4 h-4" />
                                    Search User
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                                        <Input 
                                            placeholder="Name, email, or username..." 
                                            {...field} 
                                            className="pl-9 focus-visible:ring-primary bg-muted/20"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Role Selector */}
                {role && (
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <UserCog className="w-4 h-4" />
                                    User Role
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-muted/20 focus:ring-primary">
                                            <SelectValue placeholder="All Roles" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Role Type</SelectLabel>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="teacher">Teacher</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Filter users by their account privileges.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Ban Status Selector */}
                {isBanned && (
                    <FormField
                        control={form.control}
                        name="isBanned"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Ban className="w-4 h-4" />
                                    Ban Status
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-muted/20 focus:ring-primary">
                                            <SelectValue placeholder="All Ban Statuses" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="banned">Banned</SelectItem>
                                            <SelectItem value="not_banned">Active (Not Banned)</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Filter users by their current platform access.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Sticky-like bottom action */}
                <div className="pt-4 mt-4 border-t border-border/50">
                    <Button type="submit" size="lg" className="w-full cursor-pointer shadow-sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Filters
                    </Button>
                </div>
            </form>
        </Form>
    );
}