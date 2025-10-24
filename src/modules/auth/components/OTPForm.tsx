"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CustomLoading } from "@/components/CustomLoading";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { otpSchema, otpType } from "../models";
import { LocalStorageOTPRepository } from "@/infraestructure/repositories/OTPRepository";
import { useAuth } from "../providers/AuthProvider";

export const OTPForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<otpType>({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tryes, setTryes] = useState(0);

  const { user } = useAuth();

  const otpRepository = new LocalStorageOTPRepository();

  const goToLoginHandler = () => {
    localStorage.removeItem(`${user?.email.getValue()}`);
    router.push("/sign_in");
  };

  const onSubmit = async (data: otpType) => {
    setLoading(true);

    if (!user) {
      toast.error("User not found");
      return;
    }
    try {
      const isValid = await otpRepository.verifyOTP(
        user.email.getValue(),
        data.otp
      );
      if (!isValid) {
        setTryes((prev) => prev + 1);
        throw new Error("Invalid or expired code");
      }
      toast.success("Code validated successfully");
      router.push("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                aria-invalid={!!errors.otp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="text-xs text-destructive">{errors.otp.message}</p>
          )}
          <p className="text-xs text-muted-foreground text-center">
            Enter the code sent to your email
          </p>
        </div>

        <Button
          className={cn(
            "w-full",
            loading && "bg-muted text-muted-foreground/50 pointer-events-none"
          )}
          size="lg"
          type="submit"
          tabIndex={2}
          disabled={tryes >= 3}
        >
          {loading ? (
            <CustomLoading message="Verificando" />
          ) : (
            <>
              <ShieldCheck />
              Verify
            </>
          )}
        </Button>
      </form>
      {tryes >= 3 && (
        <div className="flex flex-col items-center gap-2">
          <Button variant={"ghost"} onClick={goToLoginHandler}>
            Go back to Sign In
          </Button>

          <p className="text-xs text-destructive">
            You have exceeded the maximum number of attempts
          </p>
        </div>
      )}

      <Button
        type="button"
        variant={"ghost"}
        onClick={() => {
          toast.success("Code resent successfully");
        }}
        tabIndex={3}
      >
        Not received the code? Resend
      </Button>
    </CardContent>
  );
};
