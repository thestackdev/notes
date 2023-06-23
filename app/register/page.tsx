import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";

export default function Page() {
  // const [loading, setLoading] = useState(false);
  // const { user, register, sessionLoading } = useAppwrite();
  // const [form, setForm] = useState({
  //   email: "",
  //   password: "",
  //   name: "",
  // });

  // const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   await register(form.email, form.password, form.name);
  //   setLoading(false);
  // };

  const handleSignUp = async (formData: FormData) => {
    "use server";
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    console.log(email, password);

    if (!email || !password) return;

    const supabase = createServerActionClient({ cookies });
    const { data, error } = await supabase.auth.signUp({ email, password });

    console.log(data, error);

    revalidatePath("/");
  };

  // useEffect(() => {
  //   if (!sessionLoading && user) router.push("/dashboard");
  // }, [user, sessionLoading]);

  // if (user) return null;

  return (
    <main className="w-full max-w-screen-sm mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold">Register</h1>
      <Card className="mt-4 p-4">
        <form action={handleSignUp}>
          <div className="mb-4">
            <Label>Full Name</Label>
            <Input className="mt-2" type="text" placeholder="John Doe" />
          </div>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              className="mt-2"
              type="email"
              name="email"
              placeholder="user@example.com"
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              className="mt-2"
              name="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <Button className="mt-4 w-full">Register</Button>
        </form>
        <div className="text-center mt-4">
          <span>
            Already have an account?{" "}
            <Link href="/" className="text-blue-500">
              Login
            </Link>
          </span>
        </div>
      </Card>
    </main>
  );
}
