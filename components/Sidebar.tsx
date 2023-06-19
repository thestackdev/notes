"use client";

import { useAppwrite } from "@/providers/appwrite-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AppwriteConfig, client, databases } from "@/lib/appwrite";
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
import { ID, Models, Permission, Role } from "appwrite";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash } from "lucide-react";

export default function Sidebar({
  documents,
}: React.PropsWithChildren<{
  documents: Models.Document[];
}>) {
  const { user, logout } = useAppwrite();
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creatingCollection, setCreatingCollection] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCollection, setDeletingCollection] = useState(false);
  const [deletingCollectionId, setDeletingCollectionId] = useState("");

  async function createCollection(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!user || !label) return;
      setCreatingCollection(true);
      await databases.createDocument(
        AppwriteConfig.databaseId,
        AppwriteConfig.collectionId,
        ID.unique(),
        { label: label },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingCollection(false);
      setCreateModalOpen(false);
      setLabel("");
    }
  }

  async function deleteCollection() {
    try {
      if (!user) return;
      setDeletingCollection(true);
      await databases.deleteDocument(
        AppwriteConfig.databaseId,
        AppwriteConfig.collectionId,
        deletingCollectionId
      );
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingCollection(false);
      setDeleteModalOpen(false);
    }
  }

  return (
    <div className="flex flex-col border-r h-full w-full max-w-[300px] justify-between p-4">
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogTrigger>
          <Button className="w-full">Create Colleciton</Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={createCollection}>
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="my-4"
                placeholder="Collection Name"
                required
              />
            </DialogDescription>
            <DialogFooter className="flex flex-row gap-2">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="default" loading={creatingCollection}>
                Create
              </Button>
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
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                deleteCollection();
              }}
              loading={deletingCollection}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full h-full gap-2 my-4">
        {documents.map((document) => (
          <Link
            className="w-full flex justify-between items-center gap-2 hover:bg-accent capitalize rounded-md p-2"
            href={`/dashboard/${document.$id}`}
            key={document.$id}
          >
            {document.label}
            <Button variant="ghost">
              <Trash
                onClick={() => {
                  setDeleteModalOpen(true);
                  setDeletingCollectionId(document.$id);
                }}
                className="w-4 h-4"
              />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
