import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const schema = "notes";

export const supabaseServer = () =>
  createServerComponentClient(
    { cookies },
    {
      options: {
        db: { schema },
      },
    }
  );

export const supabaseAction = () =>
  createServerActionClient(
    { cookies },
    {
      options: {
        db: { schema },
      },
    }
  );
