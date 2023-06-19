"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { AppwriteException, ID, Models } from "appwrite";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type AppwriteProviderContextProps = {
  user: Models.User<Models.Preferences> | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  sessionLoading: boolean;
};

const defaultState: AppwriteProviderContextProps = {
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  sessionLoading: true,
};

const Context = createContext<AppwriteProviderContextProps>(defaultState);

export default function AppwriteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [sessionLoading, setSessionLoading] = useState(true);
  const router = useRouter();

  async function getUser() {
    try {
      const res = await account.get();
      setUser(res);
    } catch (error) {
      const e = error as AppwriteException;
      toast({ title: "Please login to continue", description: e.message });
      router.replace("/");
    } finally {
      setSessionLoading(false);
    }
  }

  async function logout() {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error: any) {
      const e = error as AppwriteException;
      toast({ title: "Logout Failed", description: e.message });
    }
  }

  async function login(email: string, password: string) {
    try {
      await account.createEmailSession(email, password);
      getUser();
    } catch (error: any) {
      const e = error as AppwriteException;
      toast({ title: "Login Failed", description: e.message });
    }
  }

  async function register(email: string, password: string, name: string) {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
      getUser();
    } catch (error: any) {
      const e = error as AppwriteException;
      toast({ title: "Registration Failed", description: e.message });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  if (sessionLoading)
    return (
      <div className="min-h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={64} />
      </div>
    );

  return (
    <Context.Provider value={{ user, login, logout, register, sessionLoading }}>
      {children}
    </Context.Provider>
  );
}

export const useAppwrite = () => {
  let context = useContext(Context);

  if (context === undefined) {
    throw new Error("useAppwrite must be used inside AppwriteProvider");
  }

  return context;
};
