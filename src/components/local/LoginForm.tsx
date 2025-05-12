"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { loginSchema, LoginCredentials } from "@/lib/schema";
import Logo from "./Logo";

export default function LoginForm() {
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  });

  const onSubmit = async (values: LoginCredentials) => {
    try {
      await login(values).unwrap();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successful", {
        position: "top-right",
        duration: 2000,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else if (isError && error) {
      const errorMessage =
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "error" in error.data
          ? (error.data as { message?: string }).message
          : "An error occurred. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
    }
  }, [isSuccess, isError, error, router]);

  return (
    <div className='flex h-screen p-4 gap-10 bg-[#f2f5fc]'>
      {/* Left section (Illustration) */}
      <div className='hidden md:flex flex-col bg-primary rounded-2xl h-full w-1/2 text-white relative'>
        <div className='flex justify-center h-full items-center'>
          <Image
            src='/Onboarding.png'
            alt='XPortal illustration'
            width={500}
            height={300}
            priority
          />
        </div>
        <p className='absolute bottom-4 text-center text-base mt-10 w-[70%] transform translate-x-1/2 right-1/2'>
          Your ultimate portal for managing student activities, exams, results,
          and attendance.
        </p>
      </div>

      {/* Right section (Form) */}
      <div className='h-full  w-full md:w-1/2 max-w-md mx-auto p-4'>
        <Logo />
        <h2 className='text-2xl md:text-3xl font-bold text-[#4A4A4A] text-center mt-6 mb-4 font-lato'>
          Welcome Back!
        </h2>
        <p className='text-center mb-4 text-[#4A4A4A]'>
          Enter your login details below
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Email Field */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Email address</FormLabel>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        placeholder='example@gmail.com'
                        {...field}
                        className='pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                      />
                    </FormControl>
                    <Mail className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700' />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Password</FormLabel>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder='********'
                        {...field}
                        className='pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                      />
                    </FormControl>
                    <Lock className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700' />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me and Forgot Password */}
            <div className='flex items-center justify-between'>
              <FormField
                control={form.control}
                name='remember_me'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-2'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className='border-primary data-[state=checked]:bg-primary'
                      />
                    </FormControl>
                    <FormLabel className='text-sm text-gray-700'>
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Link href='#' className='text-sm text-primary hover:underline'>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full flex items-center justify-center gap-2 bg-[#5D7DD4] hover:bg-primary'
            >
              {isLoading ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  <span>Please wait</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                </>
              )}
            </Button>
          </form>
        </Form>
        {/* Sign Up Link */}
        {/* <div className='text-center text-sm text-gray-600 mt-4'>
          Don&apos;t have an account?{" "}
          <Link
            href='/auth/register'
            className='font-bold underline text-primary'
          >
            Sign Up
          </Link>
        </div> */}
      </div>
    </div>
  );
}
