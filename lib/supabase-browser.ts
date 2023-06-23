import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabaseBrowser = () =>
  createClientComponentClient({
    options: {
      db: { schema: "notes" },
    },
  });
