"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Data } from "@/types/database";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";

interface CollectionProps {
  params: { collection: string };
}

export default function Page({ params: { collection } }: CollectionProps) {
  const [content, setContent] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  const {
    isLoading: dataLoading,
    error: dataError,
    data: data,
    refetch: refetchData,
  } = useQuery<Data[]>(`get-notes-${collection}`, () =>
    fetch(`/api/data?id=${collection}`).then((res) => res.json())
  );

  const deleteData = useMutation(
    async (id: String) => {
      await fetch(`/api/data?id=${id}`, {
        method: "DELETE",
      });
    },
    {
      mutationKey: `delete-collection/${currentItemId}`,
      onSuccess: () => {
        setDeleteModalOpen(false);
        refetchData();
      },
    }
  );

  const createData = useMutation(
    async () => {
      await fetch("/api/data", {
        method: "POST",
        body: JSON.stringify({ content, collection_id: collection }),
      });
    },
    {
      mutationKey: "create-data",
      onSuccess: () => {
        setContent("");
        refetchData();
      },
    }
  );

  const updateData = useMutation(
    async (params: { id: string; is_done: boolean }) => {
      const res = await fetch(`/api/data`, {
        method: "PUT",
        body: JSON.stringify({ id: params.id, is_done: params.is_done }),
      });
      return await res.json();
    },
    {
      mutationKey: "update-data",
      onSuccess: () => {
        refetchData();
      },
    }
  );

  if (dataLoading) return null;
  if (dataError) return null;

  return (
    <main className="flex flex-col w-full p-2 max-w-xl mx-auto">
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <DialogTrigger asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogTrigger>
            <Button
              loading={deleteData.isLoading}
              onClick={() => deleteData.mutate(currentItemId!)}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          createData.mutate();
        }}
      >
        <Input
          placeholder="Create a checklist"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
      <div className="w-full mt-6 flex flex-col gap-">
        {data?.map((e) => (
          <div
            className="flex group items-center justify-between space-x-2 hover:bg-accent/90 p-2 rounded-lg"
            key={e.id}
          >
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={e.is_done}
                onCheckedChange={(is_done: boolean) =>
                  updateData.mutate({ id: e.id, is_done })
                }
              />
              <label
                htmlFor={e.id}
                className={cn(
                  "text-sm font-medium cursor-text leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  e.is_done ? "line-through" : ""
                )}
              >
                {e.content}
              </label>
            </div>
            <Button
              variant="ghost"
              className="group-hover:visible invisible"
              onClick={() => {
                setDeleteModalOpen(true);
                setCurrentItemId(e.id);
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
