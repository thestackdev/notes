import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://apis.codefusionz.com/v1")
  .setProject("648dded355867af7a7f8");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };

export const AppwriteConfig = {
  databaseId: "648df1cc08dc913adf0e",
  collectionId: "648df1f9bdd03a9f861d",
  todosId: "648df916d1b592249808",
};
