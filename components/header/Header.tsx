"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getIsAuthenticated, logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const Header = () => {
  const [ state, logoutHandler ] = useActionState(logout, undefined);
  const [ isAuth, setIsAuth ] = useState<boolean>(false);
  const [ currentUser, setCurrentUser ] = useState<string>("");
  const [ avatarSrc, setAvatarSrc ] = useState<string>("");

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
        setCurrentUser(session?.name);
        setAvatarSrc(session?.avatar);
      } else {
        setCurrentUser("");
        setAvatarSrc("");
      }
    };
    getAuthStatus();
  }, []);

  return (
    <header className="py-2 lg:px-10">
      <nav className="max-w-7xl mx-auto shadow-4xl flex justify-between items-center py-2 px-6 rounded-2xl">
        <Link href={"/"} className="flex gap-2 items-center">
          <img src={'/Logo.svg'} className="w-10 h-10"/>
          <h1 className="text-2xl font-extrabold">FeastAI</h1>
        </Link>
        <div className="flex gap-5 items-center">
          {isAuth && currentUser && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex gap-2 items-center bg-overlay rounded-full px-1 py-1">
                  <Avatar>
                    <AvatarImage
                      src={avatarSrc}
                      alt="Avatar"
                    />
                    <AvatarFallback className="text-base-secondary">
                      {currentUser.split(" ")[0][0] +
                        currentUser.split(" ")[
                          currentUser.split(" ").length - 1
                        ][0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="hidden md:flex text-md uppercase font-extrabold pr-1">
                    {currentUser}
                  </h3>
                </TooltipTrigger>
                <TooltipContent className="md:hidden">
                  {currentUser}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                className="flex gap-2 items-center bg-overlay px-4 py-1 cursor-pointer rounded-full"
                type="submit"
                variant="ghost"
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
