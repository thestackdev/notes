"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CollectionProps {
  params: { collection: string };
}

export default function Page({ params: { collection } }: CollectionProps) {
  const [content, setContent] = useState("");
  const [data, setData] = useState<any[]>([]);
  const supabase = supabaseBrowser();

  async function updateTodo(id: string, done: boolean) {
    await supabase.from("data").update({ done }).eq("id", id);
  }

  async function createTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content) return;

    await supabase.from("data").insert({ content, collection });

    setContent("");
  }

  async function getData() {
    const { data, error } = await supabase
      .from("data")
      .select("*")
      .eq("collection", collection);

    if (!data) return;

    setData(data);
  }

  useEffect(() => {
    const channel = supabase
      .channel("notes-data")
      .on(
        "postgres_changes",
        { event: "*", schema: "notes", table: "data" },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setData((e) => [...e, payload.new]);
              break;
            case "DELETE":
              setData((e) => e.filter((x) => x.id !== payload.old.id));
              break;
            case "UPDATE":
              setData((e) =>
                e.map((x) => (x.id === payload.new.id ? payload.new : x))
              );
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <main className="flex flex-col w-full p-2 max-w-xl mx-auto">
      <form className="w-full" onSubmit={createTodo}>
        <Input
          placeholder="Create a checklist"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
      <div className="w-full mt-6 flex flex-col gap-">
        {data.map((e) => (
          <div
            className="flex items-center space-x-2 hover:bg-accent/90 p-2 rounded-lg"
            key={e.$id}
          >
            <Checkbox
              checked={e.done}
              onCheckedChange={(done: boolean) => updateTodo(e.id, done)}
            />
            <label
              htmlFor={e.id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                e.done ? "line-through" : ""
              )}
            >
              {e.content}
            </label>
          </div>
        ))}
      </div>
    </main>
  );
}
