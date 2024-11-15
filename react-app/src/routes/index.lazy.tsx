import {createLazyFileRoute, Navigate} from "@tanstack/react-router";
import Dashboard from "@/components/Dashboard";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const session = sessionStorage.getItem("accessToken");

  if (!session) {
    return <Navigate to="/signup" />;
  }

  return <Dashboard />;
}
