"use client";

import { ChefHat, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getIsAuthenticated, logout } from "@/app/actions/auth";
import { Button } from "../ui/button";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { SessionPayload } from "@/schema/common";

const Header = () => {
  const [state, logoutHandler] = useActionState(logout, undefined);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message);
      redirect("/login");
    } else if (!state?.success && state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    const getAuthStatus = async () => {
      const { isAuthenticated, session } = await getIsAuthenticated();
      setIsAuth(isAuthenticated);
      if (isAuthenticated && session) {
        setCurrentUser((session as SessionPayload)?.name);
      } else {
        setCurrentUser("");
      }
    };
    getAuthStatus();
  }, []);

  return (
    <header className="py-2 px-10">
      <nav className="max-w-7xl mx-auto shadow-4xl flex justify-between items-center py-2 px-6 rounded-2xl">
        <Link href={"/"} className="flex gap-2 items-center">
          <ChefHat size="38" />
          <h1 className="text-2xl font-extrabold">FeastAI</h1>
        </Link>
        <div className="flex gap-5 items-center">
          {isAuth && currentUser && (
            <div className="flex gap-2 items-center bg-overlay rounded-full px-3 py-1">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {currentUser.split(" ")[0][0] +
                    currentUser.split(" ")[
                      currentUser.split(" ").length - 1
                    ][0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-md uppercase font-extrabold">
                {currentUser}
              </h3>
            </div>
          )}
          {isAuth && (
            <form action={logoutHandler}>
              <Button
                className="flex gap-2 items-center bg-overlay rounded-full px-3 py-3 cursor-pointer"
                type="submit"
              >
                <LogOut size={22} />
              </Button>
            </form>
          )}
          {!isAuth && (
            <Link href={'/login'}>
              <Button
                className="flex gap-2 items-center bg-overlay px-3 py-3 cursor-pointer rounded-full"
                type="submit"
                variant="outline"
                size={'lg'}
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
