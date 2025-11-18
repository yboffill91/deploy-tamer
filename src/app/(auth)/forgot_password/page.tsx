"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomLoading } from "@/components/CustomLoading";
import { CustomInput } from "@/components/CustomInput";
import { MailCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { FirebaseAuthRepository } from "@/infrastructure/repositories";
import { Email } from "@/core";
import { showToast } from "@/components/CustomToaster";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  // const { executeResetPassword, loading, error } = useResetPassword();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const AuthRepository = new FirebaseAuthRepository();

  const resetPassword = async (email: string) => {
    setLoading(true);
    const emailValue = new Email(email);
    try {
      await AuthRepository.resetPassword(emailValue.getValue());
    } catch (error) {
      setError(
        error instanceof Error ? error.message : `Error resetting password`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      showToast({
        message: "Error",
        type: "error",
        description: error,
      });
    }
  }, [error]);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await resetPassword(data.email);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Email sent</CardTitle>
            <CardDescription>
              We have sent a recovery link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/sign_in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              name="email"
              label="Email"
              placeholder="john@mail.com"
              register={form.register}
              error={form.formState.errors.email}
              type="email"
            />

            <Button disabled={loading} type="submit" className="w-full">
              {loading ? (
                <CustomLoading message="Sending..." />
              ) : (
                <>
                  <MailCheck className="mr-2 h-4 w-4" />
                  Send recovery email
                </>
              )}
            </Button>

            <Button asChild variant="ghost" className="w-full" type="button">
              <Link href="/sign_in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
