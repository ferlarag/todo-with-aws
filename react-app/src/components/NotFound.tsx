import {Link} from "@tanstack/react-router";
import {buttonVariants} from "./ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 font-mono bg-white">
      <h1 className="text-4xl font-medium">Whoops!</h1>
      <p className="text-xl">This page was moved or doesn't exist</p>

      <div className="flex gap-2">
        <Link to="/" className={buttonVariants()}>
          Go to dashboard
        </Link>
        <Link to="/singin" className={buttonVariants({variant: "outline"})}>
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
