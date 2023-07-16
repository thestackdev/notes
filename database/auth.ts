import sql from "@/database";
import { User } from "@/database/types";

export async function login(email: string, password: string) {
  try {
    const response = await sql<
      User[]
    >`SELECT * FROM "auth".users WHERE email = ${email} AND password = crypt(${password}, gen_salt('bf'))`;

    if (response.length > 0) return response[0];
  } catch (error) {
    console.log(error);
  }
  return null;
}

export async function register(
  email: string,
  password: string,
  username: string,
  display_name: string
) {
  try {
    const response = await sql<User[]>`INSERT INTO "auth".users
        (email, password, display_name, username)
      VALUES
        (${email}, crypt(${password}, gen_salt('bf')), ${display_name}, ${username})
      RETURNING id, email, display_name, username, created_at, updated_at
      `;

    if (response.length > 0) return response[0];
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
  }
  return null;
}
