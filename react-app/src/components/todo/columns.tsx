import {ColumnDef} from "@tanstack/react-table";
import {TodoSchema} from "../CreateTodoForm";

export const columnDef: ColumnDef<TodoSchema>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
];
