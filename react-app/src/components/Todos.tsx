import {useQuery} from "@tanstack/react-query";
import Todo from "./Todo";
import {Loader2} from "lucide-react";
import {getTodos} from "@/lib/fetch";

const Todos = () => {
  const {data, isLoading, isError, isPending} = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
    staleTime: 0,
    select: (data) =>
      data.sort((a, b) => {
        const dateA = a.dueDate ?? new Date("2100-05-10");
        const dateb = b.dueDate ?? new Date("2100-05-10");
        return dateA.getTime() - dateb.getTime();
      }),
  });

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading || isPending) {
    return (
      <div className="h-[100px] w-full flex justify-center items-center text-zinc-400">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {data.length > 0 && (
        <div className="bg-white border rounded-lg shadow border-zinc-300 shadow-zinc-100">
          {data.map((todo, index) => (
            <Todo
              todo={todo}
              className={`${index != 0 ? "border-t" : null}`}
              key={todo.id}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Todos;
