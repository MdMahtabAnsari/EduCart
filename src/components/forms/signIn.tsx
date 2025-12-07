"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { signInSchema, type SignInSchema } from "@/lib/schema/auth"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa";
import { authClient } from "@/lib/auth/auth-client";
import {
    Card,
    CardContent,
    CardFooter,
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
} from "@/components/ui/form"
import Link from "next/link";


export const handleSocialSignIn = (provider: string) => {
    toast.promise(
        authClient.signIn.social({ provider,callbackURL:'/user/dashboard' }),
        {
            loading: `Signing in with ${provider}...`,
            success: `Signed in with ${provider} successfully!`,
            error: (err) => `Error signing in with ${provider}: ${err.message}`,
        }
    );
}
export function SignInForm() {

    const form = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            email: '',
            password: '',

        },
        mode: "onChange",
    });

    const onSubmit = (data: SignInSchema) => {
        toast.promise(
            authClient.signIn.email({ ...data, callbackURL:'/user/dashboard'}),
            {
                loading: "Signing in...",
                success: "Signed in successfully!",
                error: (err) => `Error signing in: ${err.message}`,
            }
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your account email address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Make sure your password is strong.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full cursor-pointer">Sign In</Button>
                    </form>
                </Form>
            </CardContent>
           <CardFooter className="flex flex-col gap-2">
                <Link href="/auth/signup" >
                    <Button variant="link" size="sm" className="cursor-pointer">Don&apos;t have an account? Sign Up</Button>
                </Link>
                <div className="w-full flex justify-center items-center">
                <Button variant="ghost" size="icon-lg" className="cursor-pointer" onClick={() => handleSocialSignIn("google")}>
                    <FaGoogle />
                </Button>
                <Button variant="ghost" size="icon-lg" className="cursor-pointer" onClick={() => handleSocialSignIn("github")}>
                    <FaGithub />
                </Button>
                <Button variant="ghost" size="icon-lg" className="cursor-pointer" onClick={() => handleSocialSignIn("discord")}>
                    <FaDiscord />
                </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
