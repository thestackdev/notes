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
import { Collection } from "@/database/types";
import { cn } from "@/lib/utils";
import { LoaderIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";
import { useToast } from "./ui/use-toast";

export default function Sidebar() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const currentCollection = params?.collection;

  // const [collections, setCollections] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalLoading, setCreateModalLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [currentItemId, setCurrentItemId] = useState(null);

  // async function createCollection(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   if (!title) return;

  //   setCreateModalLoading(true);
  //   const { data, error } = await supabase
  //     .from("collections")
  //     .insert({ title });

  //   setCreateModalLoading(false);

  //   if (error) {
  //     toast({ title: "Error", description: error.message });
  //     return;
  //   }

  //   setCreateModalOpen(false);
  //   setTitle("");
  // }

  // async function deleteCollection() {
  //   setDeleteLoading(true);
  //   const { error } = await supabase
  //     .from("collections")
  //     .delete()
  //     .eq("id", currentItemId);

  //   setDeleteLoading(false);

  //   if (error) {
  //     toast({ title: "Error", description: error.message });
  //     return;
  //   }

  //   setDeleteModalOpen(false);
  //   router.replace("/");
  // }

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("notes-collections")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "notes", table: "collections" },
  //       (payload) => {
  //         console.log(payload);

  //         switch (payload.eventType) {
  //           case "INSERT":
  //             setCollections((e) => [...e, payload.new]);
  //             break;
  //           case "DELETE":
  //             setCollections((e) => e.filter((x) => x.id !== payload.old.id));
  //             break;
  //           case "UPDATE":
  //             setCollections((e) =>
  //               e.map((x) => (x.id === payload.new.id ? payload.new : x))
  //             );
  //           default:
  //             break;
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     channel.unsubscribe();
  //   };
  // }, []);

  const {
    isLoading,
    error,
    data: collections,
  } = useQuery<Collection[]>("get-collections", () =>
    fetch("/api/collections").then((res) => res.json())
  );

  if (isLoading) {
    return <LoaderIcon className="animate-spin w-6 h-6" />;
  }

  if (error) {
    toast({ title: "Error", description: error.toString() });
    return;
  }

  return (
    <div className="flex flex-col border-r h-full w-full max-w-[300px] justify-between p-4">
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogTrigger>
          <Button className="w-full">Create Colleciton</Button>
        </DialogTrigger>
        <DialogContent>
          <form>
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
                loading={createModalLoading}
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
              loading={deleteLoading}
              // onClick={deleteCollection}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full h-full gap-2 my-4">
        {collections?.map((collection) => (
          <Link
            className={cn(
              "w-full flex group justify-between items-center gap-2 hover:bg-accent capitalize rounded-md p-2",
              currentCollection === collection.id && "bg-accent text-white"
            )}
            href={`/${collection.id}`}
            key={collection.id}
          >
            {collection.label}
            <Button
              variant="ghost"
              className="group-hover:visible invisible"
              onClick={(e) => {
                setDeleteModalOpen(true);
                // setCurrentItemId(collection.id);
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
