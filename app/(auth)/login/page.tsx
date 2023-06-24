"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/providers/supabase-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const supabase = useSupabase();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({ title: "Login Failed", description: error.message });
      return;
    }

    router.replace("/");
  };

  return (
    <main className="w-full max-w-screen-sm mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <Card className="mt-4 p-4 w-full">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              className="mt-2"
              type="email"
              placeholder="user@example.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              className="mt-2"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button loading={loading} className="mt-4 w-full">
            Login
          </Button>
        </form>
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
