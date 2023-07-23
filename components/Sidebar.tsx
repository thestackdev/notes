"use client";

import { Button } from "@/components/ui/button";
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
import useUtils from "@/hooks/useUtils";
import { cn } from "@/lib/utils";
import { Collection } from "@/types/database";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useToast } from "./ui/use-toast";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const currentCollection = params?.collection;

  const [title, setTitle] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const { isOpen, toggle } = useUtils();

  const { isLoading: collectionsLoading, error: collectionsError } = useQuery<
    Collection[]
  >(
    "get-collections",
    () => fetch("/api/collections").then((res) => res.json()),
    {
      onSuccess: (data) => {
        setCollections(data);
      },
    }
  );

  const createCollection = useMutation(
    async (title: String) => {
      const res = await fetch("/api/collections", {
        method: "POST",
        body: JSON.stringify({ label: title }),
      });
      return await res.json();
    },
    {
      mutationKey: "create-collection",
      onSuccess: (data) => {
        setCreateModalOpen(false);
        setTitle("");
        setCollections([data, ...collections]);
        router.push(data.id);
      },
    }
  );

  const deleteCollection = useMutation(
    async (id: String) => {
      await fetch(`/api/collections?id=${id}`, {
        method: "DELETE",
      });
    },
    {
      mutationKey: `delete-collection/${currentItemId}`,
      onSuccess: () => {
        setDeleteModalOpen(false);
        setCollections(collections.filter((c) => c.id !== currentItemId));
        router.push("/");
      },
    }
  );

  if (collectionsLoading) {
    return null;
  }

  if (collectionsError) {
    toast({ title: "Error", description: collectionsError.toString() });
    return;
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r h-full bg-background w-full max-w-[300px] justify-between p-4 transition-transform duration-300 transform",
        !isOpen && "-translate-x-full lg:translate-x-0",
        className
      )}
    >
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogTrigger>
          <Button className="w-full">Create Colleciton</Button>
        </DialogTrigger>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createCollection.mutate(title);
            }}
          >
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <Input
                className="my-4"
                placeholder="Collection Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="title"
              />
            </DialogDescription>
            <DialogFooter className="flex flex-row gap-2">
              <Button
                loading={createCollection.isLoading}
                variant="default"
                type="submit"
              >
                Create
              </Button>
              <DialogTrigger>
                <Button variant="secondary">Cancel</Button>
              </DialogTrigger>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <DialogTrigger asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogTrigger>
            <Button
              loading={deleteCollection.isLoading}
              onClick={() => deleteCollection.mutate(currentItemId!)}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full h-full gap-2 my-4">
        {collections?.map((collection) => (
          <Button
            variant="ghost"
            className={cn(
              "w-full flex group justify-between items-center gap-2 hover:bg-accent capitalize rounded-md p-2",
              currentCollection === collection.id && "bg-accent text-white"
            )}
            onClick={() => {
              router.push(collection.id);
              toggle();
            }}
            key={collection.id}
          >
            {collection.label}
            <Button
              variant="ghost"
              className="group-hover:visible invisible"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModalOpen(true);
                setCurrentItemId(collection.id);
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </Button>
        ))}
      </div>
    </div>
  );
}
