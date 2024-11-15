import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {format} from "date-fns";
import {CalendarIcon, Loader2} from "lucide-react";
import {cn} from "@/lib/utils";
import {v4 as uuid} from "uuid";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTodo} from "@/lib/fetch";

const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  description: z.string().optional(),
  isCompleted: z.boolean().default(false),
  createdAt: z.date().default(new Date()),
  dueDate: z.date().optional(),
});

export type TodoSchema = z.infer<typeof todoSchema>;

const CreateTodoForm = () => {
  const queryClient = useQueryClient();
  const {status, mutate} = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      console.log("Invalidate queries!");
      queryClient.invalidateQueries({queryKey: ["todos"]});
    },
  });
  const form = useForm<TodoSchema>({
    defaultValues: {
      id: "",
      description: "",
      title: "",
      isCompleted: false,
      createdAt: new Date(),
    },
    resolver: zodResolver(todoSchema),
  });

  function handleSubmit(values: TodoSchema) {
    mutate({todo: {...values, id: uuid()}});
  }

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-10"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>Put a title to this task</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Desciption" {...field} />
                </FormControl>
                <FormDescription>
                  A short description for this task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {status == "pending" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sumbit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTodoForm;
