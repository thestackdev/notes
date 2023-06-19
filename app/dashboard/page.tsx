"use client";

import { useAppwrite } from "@/providers/appwrite-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, sessionLoading: ready } = useAppwrite();
  const router = useRouter();

  useEffect(() => {
    if (!ready && !user) {
      router.push("/");
    }
  }, [user, ready]);

  return <main className=""></main>;
}
