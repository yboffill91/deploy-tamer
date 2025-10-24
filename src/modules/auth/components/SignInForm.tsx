"use client";

import { Button, CardContent } from "@/components/ui";
import { useForm } from "react-hook-form";
import { userLoginSchema, userLoginType } from "../models";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "@/components/CustomInput";
import { ButtonsSelectProviders } from "./ButtonsSelectProviders";
import { CustomLoading } from "@/components/CustomLoading";
import { LogIn, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/modules/auth";

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userLoginType>({
    resolver: zodResolver(userLoginSchema),
    mode: "onBlur",
  });
  const router = useRouter();
  const { login, error, loading, user } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data: userLoginType) => {
    await login(data.email, data.password);

    console.log("Pasé por aqui");
    router.push("/verify_account");
  };

  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <CustomInput
            register={register}
            error={errors.email}
            label="Email"
            name="email"
            placeholder="john@mail.com"
            type="email"
            tabindex={1}
            addon={Mail}
          />
          <div className="relative">
            <div className="w-full  flex items-center justify-end">
              <Link
                href={"/forgot_password"}
                className={cn(
                  "text-right text-sm text-primary w-full absolute bottom-0 right-0.5 transition-all duration-200 ease-in-out",
                  errors.password && "top-0"
                )}
                tabIndex={3}
              >
                Forgot your password?
              </Link>
            </div>
            <div>
              <CustomInput
                register={register}
                error={errors.password}
                label="Password"
                name="password"
                placeholder="*********"
                type="password"
                tabindex={2}
              />
            </div>
          </div>
        </div>
        <Button
          className={cn(
            "w-full",
            loading && "bg-muted text-muted-foreground/50 pointer-events-none"
          )}
          size="lg"
          type="submit"
          tabIndex={4}
        >
          {loading ? (
            <CustomLoading message="Loading" />
          ) : (
            <>
              <LogIn />
              Sign In
            </>
          )}
        </Button>
      </form>
      <ButtonsSelectProviders loadingMessage="Loading" />
    </CardContent>
  );
};
