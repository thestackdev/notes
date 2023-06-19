"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AppwriteConfig, client, databases } from "@/lib/appwrite";
import { cn } from "@/lib/utils";
import { useAppwrite } from "@/providers/appwrite-provider";
import {
  ID,
  Models,
  Permission,
  Query,
  RealtimeResponseEvent,
  Role,
} from "appwrite";
import { useEffect, useState } from "react";

export default function Page({
  params: { collection },
}: React.PropsWithChildren<{
  params: {
    collection: string;
  };
}>) {
  const { user } = useAppwrite();
  const [label, setLabel] = useState("");
  const [data, setData] = useState<Models.Document[]>([]);
  const channel = `databases.${AppwriteConfig.databaseId}.collections.${AppwriteConfig.todosId}.documents`;

  async function getTodos() {
    const data = await databases.listDocuments(
      AppwriteConfig.databaseId,
      AppwriteConfig.todosId,
      [Query.equal("collections", collection)]
    );
    setData(data.documents);
  }

  async function updateTodo(id: string, done: boolean) {
    await databases.updateDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.todosId,
      id,
      { done: done }
    );
  }

  async function createTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user || !label) return;

    await databases.createDocument(
      AppwriteConfig.databaseId,
      AppwriteConfig.todosId,
      ID.unique(),
      { label: label, collections: collection },
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );
    setLabel("");
  }

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      channel,
      (event: RealtimeResponseEvent<any>) => {
        switch (event.events[5]) {
          case `${channel}.*.create`:
            setData((prev) => [...prev, event.payload]);
            break;
          case `${channel}.*.delete`:
            setData((prev) =>
              prev.filter((document) => document.$id !== event.payload.$id)
            );
            break;
          case `${channel}.*.update`:
            setData((prev) =>
              prev.map((document) =>
                document.$id === event.payload.$id
                  ? { ...document, ...event.payload }
                  : document
              )
            );
            break;
        }
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <main className="flex flex-col w-full p-2 max-w-xl mx-auto">
      <form className="w-full" onSubmit={createTodo}>
        <Input
          placeholder="Create a checklist"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </form>
      <div className="w-full mt-6 flex flex-col gap-">
        {data.map((document) => (
          <div className="flex items-center space-x-2 hover:bg-accent/90 p-2 rounded-lg">
            <Checkbox
              checked={document.done}
              id={document.$id}
              onCheckedChange={(done: boolean) =>
                updateTodo(document.$id, done)
              }
            />
            <label
              htmlFor={document.$id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                document.done ? "line-through" : ""
              )}
            >
              {document.label}
            </label>
          </div>
        ))}
      </div>
    </main>
  );
}
