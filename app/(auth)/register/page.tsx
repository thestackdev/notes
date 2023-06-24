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
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const supabase = useSupabase();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name },
      },
    });

    setLoading(false);

    if (error) {
      toast({ title: "Registration Failed", description: error.message });
      return;
    }

    router.replace("/");
  };

  return (
    <main className="w-full max-w-screen-sm mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold">Register</h1>
      <Card className="mt-4 p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label>Full Name</Label>
            <Input className="mt-2" type="text" placeholder="John Doe" />
          </div>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              className="mt-2"
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              className="mt-2"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Button loading={loading} className="mt-4 w-full">
            Register
          </Button>
        </form>
        <div className="text-center mt-4">
          <span>
            Already have an account?{" "}
            <Link href="/" className="text-blue-500">
              Login
            </Link>
          </span>
        </div>
      </Card>
    </main>
  );
}
