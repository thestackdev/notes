"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    display_name: "",
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = await signIn("credentials", {
      email: form.email,
      password: form.password,
      username: form.username,
      display_name: form.display_name,
      isNewUser: true,
      redirect: false,
    });

    setLoading(false);
    if (response?.error) {
      toast({
        title: "Registration Failed",
        description: "Unable to register at the moment.",
      });
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
            <Input
              className="mt-2"
              type="text"
              placeholder="John Doe"
              value={form.display_name}
              onChange={(e) =>
                setForm({ ...form, display_name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <Label>Username</Label>
            <Input
              className="mt-2"
              type="text"
              placeholder="john"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
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
