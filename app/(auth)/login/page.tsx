"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useEffect } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PasswordInput } from "@/components/PasswordInput";
import { getIsAuthenticated } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, handleLogin, isPending] = useActionState(login, undefined);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated } = await getIsAuthenticated();
      if (isAuthenticated) {
        router.replace('/recipes');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message);
      router.replace("/recipes");
    } else if (!state?.success && (state?.errors || state?.message)) {
      toast.error(state?.message);
    }
  }, [state, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl mx-auto flex flex-col gap-3 py-14 justify-center items-center"
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
              <PasswordInput
                name="password"
                placeholder="Password"
                required
                error={state?.errors?.password}
              />
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
      <div className="text-balance text-center text-xs text-base-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </motion.div>
  );
}
