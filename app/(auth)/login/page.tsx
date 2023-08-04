"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LoginForm, LoginFormSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginForm),
  });

  async function onSubmit(values: z.infer<typeof LoginForm>) {
    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Login Failed");
      }

      router.refresh();
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "No user found with that email and password",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full max-w-screen-sm mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <Card className="mt-4 p-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email Address" {...field} />
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
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={loading} type="submit" className="mt-4 w-full">
              Login
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <span>
            Dont have an account?{" "}
            <Link href="/register" className="text-blue-500">
              Register
            </Link>
          </span>
        </div>
      </Card>
    </main>
  );
}
