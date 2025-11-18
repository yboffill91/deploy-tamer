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
import { useEffect, useState } from "react";
import { otpSchema, otpType } from "../models";
import { useAuth } from "../providers/AuthProvider";
import { SessionVerificationRepository } from "@/infraestructure/repositories";
import { showToast } from "@/components/CustomToaster";
import { useGetTokens } from "@/hooks/useGetToken";

export const OTPForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<otpType>({
    resolver: zodResolver(otpSchema),

    mode: "onChange",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [tryes, setTryes] = useState(0);

  const { user } = useAuth();

  const OtpRepository = new SessionVerificationRepository();
  const { token, tokenError } = useGetTokens();

  useEffect(() => {
    if (tokenError) {
      showToast({
        message: "Error",
        description: tokenError,
        type: "error",
      });
    }
  }, [tokenError]);

  const onSubmit = async (data: otpType) => {
    setLoading(true);

    if (!user) {
      showToast({
        message: "Error",
        description: "User not found",
        type: "error",
      });
      return;
    }

    try {
      console.log(token);
      await OtpRepository.verifyCode(data.otp, token!);
      showToast({
        message: "Success",
        description: "Code validated successfully",
        type: "success",
      });
      router.push("/admin");
    } catch (error) {
      showToast({
        message: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        type: "error",
      });
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
          className={cn("w-full")}
          size="lg"
          type="submit"
          tabIndex={2}
          disabled={loading}
        >
          {loading ? (
            <CustomLoading message="Verifying" />
          ) : (
            <>
              <ShieldCheck />
              Verify
            </>
          )}
        </Button>
      </form>
      {/* TODO:Implement Resend code */}
      {/*  <Button
        type="button"
        variant={"ghost"}
        onClick={() => {
          toast.success("Code resent successfully");
        }}
        tabIndex={3}
      >
        Not received the code? Resend
      </Button> */}
    </CardContent>
  );
};
