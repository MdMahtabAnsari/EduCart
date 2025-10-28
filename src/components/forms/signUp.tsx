"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm ,useWatch} from "react-hook-form"
import { toast } from "sonner"
import { signUpSchema, type SignUpSchema } from "@/lib/schema/auth"

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
import { Textarea } from "@/components/ui/textarea";
import { handleSocialSignIn } from "@/components/forms/signIn";
import { CldUploadWidget,CloudinaryUploadWidgetResults,CloudinaryUploadWidgetError,CldImage } from 'next-cloudinary';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function SignUpForm() {

    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
    });

    const image = useWatch({ control: form.control, name: 'image' });

    const onSubmit = (data: SignUpSchema) => {
        toast.promise(
            authClient.signUp.email(data),
            {
                loading: "Signing up...",
                success: "Signed up successfully!",
                error: (err) => `Error signing up: ${err.message}`,
            }
        );
    }



    return (
        <Card className="w-full max-w-lg mx-auto h-fit my-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Create your account to get started!</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {image ? (
                                <ImageZoom className="w-full h-full">
                                    <CldImage
                                        src={image}
                                        alt="Profile Image"
                                        width={150}
                                        height={150}
                                        className="w-36 h-36 mx-auto mb-4 rounded-full object-cover cursor-pointer"
                                    />
                                </ImageZoom>

                            ):(
                                <Avatar className="w-36 h-36 mx-auto mb-4">
                                    <AvatarImage src="" alt="Profile Image" />
                                    <AvatarFallback>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </AvatarFallback>
                                </Avatar>
                            )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your full name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your unique username.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                        Choose a strong password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us about yourself" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your bio.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <CldUploadWidget
                                            signatureEndpoint="/api/sign-cloudinary-params"
                                            uploadPreset='educart'
                                            onSuccess={(result:CloudinaryUploadWidgetResults) => {
                                                if(typeof result.info !== 'string' && result.info?.secure_url){
                                                    field.onChange(result.info.secure_url);
                                                    toast.success("Image uploaded successfully!");
                                                }
                                            }}

                                            onError={(error:CloudinaryUploadWidgetError)=>{
                                                toast.error(`Image upload failed: ${error}`);
                                            }}
                                            options={{
                                                maxFiles: 1,
                                                maxFileSize: 2 * 1024 * 1024, // 2MB
                                                sources: ['local', 'camera'],
                                                cropping: true,
                                                folder: 'educart/profile-images',
                                                resourceType: 'image',
                                                clientAllowedFormats: ['png', 'jpeg', 'jpg'],
                                                multiple: false,

                                            }}
                                        >
                                            {({ open }) => {
                                                return (
                                                    <Button type="button" variant="outline" onClick={() => open?.()} className="w-full cursor-pointer">
                                                        {field.value ? "Change Image" : "Upload Image"}
                                                    </Button>
                                                )
                                            }}
                                        </CldUploadWidget>
                                    </FormControl>
                                    <FormDescription>
                                        This is your profile image.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                            {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full mb-2 cursor-pointer" onClick={() => handleSocialSignIn("google")}>
                    <FaGoogle className="mr-2" /> Sign up with Google
                </Button>
                <Button variant="outline" className="w-full mb-2 cursor-pointer" onClick={() => handleSocialSignIn("github")}>
                    <FaGithub className="mr-2" /> Sign up with GitHub
                </Button>
                <Button variant="outline" className="w-full cursor-pointer" onClick={() => handleSocialSignIn("discord")}>
                    <FaDiscord className="mr-2" /> Sign up with Discord
                </Button>
            </CardFooter>
        </Card>
    );
}
