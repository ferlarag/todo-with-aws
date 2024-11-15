import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {getCurrentSession, signIn} from "@/lib/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  createLazyFileRoute,
  Link,
  Navigate,
  useNavigate,
} from "@tanstack/react-router";
import {useForm} from "react-hook-form";
import {z} from "zod";

export const Route = createLazyFileRoute("/singin")({
  component: SignIn,
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInType = z.infer<typeof SignInSchema>;

function SignIn() {
  const navigate = useNavigate();
  const form = useForm<SignInType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SignInSchema),
  });

  async function handleSubmit({email, password}: SignInType) {
    try {
      const result = await signIn({password, username: email});
      if (!result) throw new Error("No result");

      navigate({to: "/"});
    } catch (error) {
      console.log("Couldnt sign in: ", error);
    }
  }

  const session = getCurrentSession();
  if (session) return <Navigate to="/" />;

  return (
    <div className="flex flex-col justify-center h-dvh">
      <div className="max-w-[400px] w-full mx-auto p-4 bg-white border rounded-lg shadow border-zinc-300 shadow-zinc-100">
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
        </Form>
        <p className="w-full pt-3 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="underline hover:cursor-pointer">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
