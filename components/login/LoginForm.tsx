"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginFormSchema } from "@/lib/schemas/login-form-schema";
import JUAILogo from "../../public/images/juai-logo.png";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email_address: "",
      password: "",
    },
  });

  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email_address,
        password: values.password,
      }),
    });

    const data = await res.json();

    setLoading(false);
    if (!res.ok) {
      form.setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });
      return;
    }

    // store token in local storage
    login(data.token);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="JU&AI Bakeshop Inventory System LOGO"
          src={JUAILogo}
          className="mx-auto h-44 w-auto"
          priority
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      {...field}
                      className={
                        form.formState.errors.email_address
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </FormControl>
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
                    <Input
                      placeholder="Password"
                      {...field}
                      type="password"
                      className={
                        form.formState.errors.password ? "border-red-500" : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
