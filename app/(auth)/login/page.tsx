"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useEffect } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [state, handleLogin, isPending] = useActionState(login, undefined);
  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message);
      redirect("/recipes");
    } else if (!state?.success && (state?.errors || state?.message)) {
      toast.error(state?.message);
    }
  }, [state]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl mx-auto flex py-14 justify-center items-center"
      style={{ height: "87vh" }}
    >
      <Card className="w-full rounded-4xl shadow-2xl border-b-6 border-r-6 border-base-secondary">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="flex items-start rounded-tl-[5rem] rounded-tr-[4rem] rounded-bl-[5rem] rounded-br-[9rem] bg-base p-2 w-16 h-16">
            <img src={'/Logo.svg'} className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input type="email" name="email" placeholder="Email" required />
              {state?.errors?.email && (
                <p className="text-red-500 text-xs px-2">
                  {state.errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              {state?.errors?.password && (
                <div className="text-red-500 text-xs px-2">
                  <p>Password must:</p>
                  <ul>
                    {state.errors.password.map((error: string) => (
                      <li key={error}>- {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                size="lg"
                className="bg-base cursor-pointer rounded-full border-4 border-base-secondary p-4"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account?
            </span>
            <Link href={"/signup"}>
              <Button
                variant="link"
                className="p-0 h-auto font-semibold cursor-pointer"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
