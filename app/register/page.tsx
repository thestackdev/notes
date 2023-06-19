"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppwrite } from "@/providers/appwrite-provider";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const { user, register, sessionLoading } = useAppwrite();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await register(form.email, form.password, form.name);
    setLoading(false);
  };

  useEffect(() => {
    if (!sessionLoading && user) router.push("/dashboard");
  }, [user, sessionLoading]);

  if (user) return null;

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
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              className="mt-2"
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              className="mt-2"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Button disabled={loading} className="mt-4 w-full">
            {loading && <Loader className="mr-2 animate-spin" size={16} />}
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
