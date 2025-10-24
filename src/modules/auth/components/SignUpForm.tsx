"use client";

import { Button, CardContent } from "@/components/ui";
import { useForm } from "react-hook-form";
import { userRegisterSchema, userRegisterType } from "../models";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "@/components/CustomInput";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { CustomLoading } from "@/components/CustomLoading";
import { ButtonsSelectProviders } from "./ButtonsSelectProviders";
import { useAuth } from "@/modules/auth";
import { useEffect } from "react";

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userRegisterType>({
    resolver: zodResolver(userRegisterSchema),
    mode: "onBlur",
  });

  const router = useRouter();
  // const { executeRegister, loading, error } = useRegisterUser();
  const { register: registerUser, error, loading } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data: userRegisterType) => {
    await registerUser(data.email, data.password);
    router.push("/profile");
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
            addon={User}
          />
          <div className="space-y-2">
            <CustomInput
              register={register}
              error={errors.password}
              label="Password"
              name="password"
              placeholder="*********"
              type="password"
            />
          </div>
          <div className="space-y-2">
            <CustomInput
              register={register}
              error={errors.rePassword}
              label="Re Password"
              name="rePassword"
              placeholder="*********"
              type="password"
            />
          </div>
        </div>
        <Button
          className={cn(
            "w-full",
            loading && "bg-muted text-muted-foreground/50 pointer-events-none"
          )}
          size="lg"
          type="submit"
        >
          {loading ? (
            <CustomLoading message="Loading" />
          ) : (
            <>
              <UserPlus />
              Sign Up
            </>
          )}
        </Button>
      </form>
      <ButtonsSelectProviders loadingMessage="Loading" />
    </CardContent>
  );
};
