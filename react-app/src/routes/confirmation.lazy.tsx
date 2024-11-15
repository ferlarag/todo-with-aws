import {createLazyFileRoute, useNavigate} from "@tanstack/react-router";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {confirmSignUp} from "@/lib/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export const Route = createLazyFileRoute("/confirmation")({
  component: RouteComponent,
});

const AccountValidationSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

type AccountVerification = z.infer<typeof AccountValidationSchema>;

function RouteComponent() {
  const navigation = useNavigate();
  const form = useForm<AccountVerification>({
    resolver: zodResolver(AccountValidationSchema),
    defaultValues: {
      code: "",
      email: "",
    },
  });

  async function handleSubmit({code, email}: AccountVerification) {
    try {
      await confirmSignUp({code, username: email});
      console.log("Verified successfully");
      navigation({to: "/singin"});
    } catch (error) {
      console.log("Coulnt verify the account", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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
          name="code"
          render={({field}) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Confirmation code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Verify account</Button>
      </form>
    </Form>
  );
}
