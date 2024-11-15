import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {getCurrentSession, signUp} from "@/lib/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  createLazyFileRoute,
  Link,
  Navigate,
  useNavigate,
} from "@tanstack/react-router";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

export const Route = createLazyFileRoute("/signup")({
  component: SingUp,
});

export const CredentialsSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    repeatedPassword: z.string().min(8),
  })
  .refine(({password, repeatedPassword}) => password === repeatedPassword, {
    message: "Passwords must match",
    path: ["repeatedPassword"],
  });

export type Credentials = z.infer<typeof CredentialsSchema>;

function SingUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();
  const form = useForm<Credentials>({
    defaultValues: {
      email: "",
      password: "",
      repeatedPassword: "",
    },
    resolver: zodResolver(CredentialsSchema),
  });

  async function handleSubmit({email, password}: Credentials) {
    await signUp({
      email,
      password,
    });

    navigation({to: "/"});
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
                    <div className="flex flex-col items-end">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          id="showPassword"
                          checked={showPassword}
                          onCheckedChange={(checked) => {
                            let val: boolean;

                            if (checked == "indeterminate" || checked == true) {
                              val = true;
                            } else {
                              val = false;
                            }
                            setShowPassword(val);
                          }}
                        />
                        <Label htmlFor="showPassword">Show password</Label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeatedPassword"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Re-enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Sign up
            </Button>
          </form>
        </Form>
        <p className="w-full pt-3 text-sm text-center">
          Already have an account?{" "}
          <Link to="/singin" className="underline hover:cursor-pointer">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
