import {useNavigate} from "@tanstack/react-router";
import CreateTodoForm from "../components/CreateTodoForm";
import {Button, buttonVariants} from "../components/ui/button";
import {ArrowDownUp, Filter, LogOut} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Todos from "./Todos";
import {signOut} from "@/lib/auth";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="w-full mx-auto p-4 md:p-8 max-w-[600px] flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-medium">TaskMate</h1>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              signOut();
              navigate({to: "/singin"});
            }}
          >
            <LogOut className="text-zinc-400" />
          </Button>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow border-zinc-300 shadow-zinc-100">
          <CreateTodoForm />
        </div>

        <div className="flex w-full">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "shrink-0 ml-auto",
              })}
            >
              <Filter className="text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]" align="end">
              <DropdownMenuLabel>Order</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>By creation date</DropdownMenuItem>
              <DropdownMenuItem>By due date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant={"ghost"} size={"icon"}>
            <ArrowDownUp className="text-zinc-400" />
          </Button>
        </div>

        <Todos />
      </div>
    </div>
  );
};

export default Dashboard;
