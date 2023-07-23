import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      display_name: string;
      email: string;
      created_at: string;
      updated_at: string;
    };
  }
}
