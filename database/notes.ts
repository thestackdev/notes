import sql from "@/database";
import { Collection } from "@/database/types";

export async function getCollections(user_id: string) {
  try {
    const response = await sql<Collection[]>`SELECT * FROM "notes".collections`;
    if (response.length > 0) return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}
