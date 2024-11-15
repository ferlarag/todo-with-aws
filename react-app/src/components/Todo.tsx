import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {useState} from "react";
import {TodoSchema} from "./CreateTodoForm";
import {cn} from "@/lib/utils";
import {Switch} from "./ui/switch";
import {buttonVariants} from "./ui/button";
import {MoreVertical, PenLine, Trash2} from "lucide-react";
import {format} from "date-fns";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTodo, updateTodo} from "@/lib/fetch";

interface Props {
  todo: TodoSchema;
  className?: string;
}

const Todo = ({todo, className}: Props) => {
  const [isCompleted, setCompleted] = useState<boolean>(todo.isCompleted);
  const [editMode, setEditMode] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["todos"]}),
  });

  const {mutate: deleteMutation} = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["todos"]}),
  });

  function handleChange(value: boolean) {
    setCompleted(value);
    mutate({newTodo: {...todo, isCompleted: value}});
  }

  if (editMode) {
    return <div>hey</div>;
  }

  return (
    <div className={cn(className, "flex flex-col items-start  p-4")}>
      <div className="flex items-start w-full gap-4">
        <Switch
          checked={isCompleted}
          onCheckedChange={handleChange}
          className="ml-auto"
        />
        <div className="w-full">
          <h3 className="font-medium text-start">{todo.title}</h3>
          <p className="text-sm text-start text-zinc-400">{todo.description}</p>

          {todo.dueDate && (
            <div className="px-2 py-1 mt-2 text-xs rounded-md border-[1.5px] font-medium w-fit ">
              <span
                className={
                  todo.dueDate <= new Date() ? "text-red-500" : "text-zinc-600"
                }
              >
                Due: {format(todo.dueDate, "MM/dd/yyyy")}
              </span>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "shrink-0",
            })}
          >
            <MoreVertical className="size-3 text-zinc-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[150px]" align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setEditMode((prev) => (prev ? true : !prev))}
            >
              <PenLine /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => deleteMutation({id: todo.id})}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Todo;
