import { collections, users } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { JWTPayload } from "jose";
import * as z from "zod";

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};

const selectUserSchema = createSelectSchema(users);
const selectCollectionSchema = createSelectSchema(collections);

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

export type Session = JWTPayload & {
  id: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = z.infer<typeof selectUserSchema>;
export type Collection = z.infer<typeof selectCollectionSchema>;
export type LoginFormSchema = z.infer<typeof LoginForm>;
export type RegisterFormSchema = z.infer<typeof RegisterSchema>;
