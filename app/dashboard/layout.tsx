"use client";

import Sidebar from "@/components/Sidebar";
import { AppwriteConfig, client, databases } from "@/lib/appwrite";
import { Models, RealtimeResponseEvent } from "appwrite";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const channel = `databases.${AppwriteConfig.databaseId}.collections.${AppwriteConfig.collectionId}.documents`;

  const [documents, setDocuments] = useState<Models.Document[]>([]);

  async function fetchCategories() {
    try {
      const data = await databases.listDocuments(
        AppwriteConfig.databaseId,
        AppwriteConfig.collectionId
      );
      setDocuments(data.documents);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      channel,
      (event: RealtimeResponseEvent<any>) => {
        switch (event.events[5]) {
          case `${channel}.*.create`:
            setDocuments((prev) => [...prev, event.payload]);
            break;
          case `${channel}.*.delete`:
            setDocuments((prev) =>
              prev.filter((document) => document.$id !== event.payload.$id)
            );
            break;
          case `${channel}.*.update`:
            setDocuments((prev) =>
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
    <main className="w-full h-full flex">
      <Sidebar documents={documents} />
      {children}
    </main>
  );
}
