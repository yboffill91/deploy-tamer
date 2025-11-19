"use client";

const newUserSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    repeatPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    phone: z.string().min(9, "Complete phone number"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });
type newUserForm = z.infer<typeof newUserSchema>;

import { CustomControllerInput } from "@/components/CustomControllerInput";
import { CustomLoading } from "@/components/CustomLoading";
import { Button, Card, CardContent, CardHeader, Label } from "@/components/ui";
import { MaskInput } from "@/components/ui/mask-input";
import { UsersApiRepository } from "@/infrastructure/repositories";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth";
import { CommonHeader } from "@/modules/users/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const NewUserPage = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const uid = searchParams.get("uid");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<newUserForm>({
    resolver: zodResolver(newUserSchema),
    mode: "onBlur",
  });
  const { login } = useAuth();

  const onSubmit = async (data: newUserForm) => {
    console.log(data);
    try {
      const USERS_REPO = new UsersApiRepository();
      const newUser = await USERS_REPO.create({
        email: email!,
        uuid: uid!,
      });
      if (!newUser) {
        throw new Error("User not created");
      }
      await login(newUser.email!, data.password!);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(email, uid);
  /* const email = searchParams.get("email");
  const uid = searchParams.get("uid"); */
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="space-y-2 container max-w-md">
        <CardHeader>
          <CommonHeader
            title="New User"
            desc="Please fill out this form."
            icon={UserPlus}
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomControllerInput
              name="name"
              control={control}
              error={errors.name}
              label="Name"
              placeholder="John Doe"
              addon={User}
            />
            <CustomControllerInput
              type="email"
              name="email"
              control={control}
              error={errors.email}
              label="Email"
              placeholder="john.doe@example.com"
              addon={Mail}
              value={email!}
              disabled
            />
            <CustomControllerInput
              name="password"
              control={control}
              error={errors.password}
              label="Password"
              placeholder="********"
              type="password"
            />
            <CustomControllerInput
              name="repeatPassword"
              control={control}
              error={errors.repeatPassword}
              label="Repeat Password"
              placeholder="********"
              type="password"
            />
            {/*  <CustomControllerInput
              name="phone"
              control={control}
              error={errors.phone}
              label="Phone"
              placeholder="John Doe"
            /> */}
            <div className="mb-12 flex flex-col gap-1">
              <Label
                htmlFor="phone"
                className={cn(
                  "font-semibold text-foreground",
                  errors.phone && "text-destructive"
                )}
              >
                Phone:
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <MaskInput
                    {...field}
                    placeholder="(123) 456-7890"
                    mask={"phone"}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
              {errors.phone && (
                <div className="text-xs text-destructive">
                  {errors.phone.message}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <CustomLoading message="Submiting" /> : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewUserPage;
