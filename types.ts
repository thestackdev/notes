import { collections, items, users } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";

const selectUserSchema = createSelectSchema(users);
const selectCollectionSchema = createSelectSchema(collections);
const selectItemSchema = createSelectSchema(items);

export const LoginForm = z.object({
  email: z.string().email().default(""),
  password: z.string().min(8).default(""),
});

export const RegisterSchema = z.object({
  email: z.string().email().default(""),
  password: z.string().min(8).default(""),
  username: z.string().min(2).max(50).default(""),
  fullName: z.string().min(2).max(50).default(""),
});

export type User = z.infer<typeof selectUserSchema>;
export type Collection = z.infer<typeof selectCollectionSchema>;
export type Item = z.infer<typeof selectItemSchema>;
export type LoginFormSchema = z.infer<typeof LoginForm>;
export type RegisterFormSchema = z.infer<typeof RegisterSchema>;
