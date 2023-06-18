import { Client } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://apis.codefusionz.com/v1")
  .setProject("648dded355867af7a7f8");

export default client;
