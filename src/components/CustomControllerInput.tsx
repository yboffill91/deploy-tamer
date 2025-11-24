"use client";

import { useState } from "react";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  AlertCircle,
  Asterisk,
  Eye,
  EyeOff,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";

interface Props<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  placeholder: string;
  control: Control<TFieldValues>;
  error?: FieldError;
  type?: string;
  tabindex?: number;
  addon?: LucideIcon;
  value?: string;
  disabled?: boolean;
}

export const CustomControllerInput = <TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  error,
  type = "text",
  tabindex,
  addon,
  value,
  disabled,
}: Props<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div
      className={cn(
        " flex items-start gap-1 flex-col w-full ",
        label ? "min-h-18" : "min-h-14"
      )}
    >
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "font-semibold text-foreground",
            error && "text-destructive"
          )}
        >
          {label}:
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <>
            {isPasswordField ? (
              <InputGroup
                className={cn(
                  "bg-primary/10",
                  error &&
                    "bg-destructive/5 border-destructive/20 placeholder:text-destructive/40 text-destructive"
                )}
              >
                <InputGroupInput
                  id={name}
                  type={inputType}
                  placeholder={placeholder}
                  tabIndex={tabindex}
                  aria-invalid={!!error}
                  value={value ?? field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  disabled={disabled}
                />
                <InputGroupAddon>
                  <Asterisk className={cn(error && "text-destructive/50")} />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Show Password" : "Hide Password"
                    }
                    className={cn(error && "text-destructive/50")}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            ) : addon ? (
              <InputGroup
                className={cn(
                  "bg-primary/10",
                  error &&
                    "bg-destructive/5 border-destructive/20 placeholder:text-destructive/40 text-destructive"
                )}
              >
                <InputGroupInput
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  tabIndex={tabindex}
                  aria-invalid={!!error}
                  value={value ?? field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  disabled={disabled}
                />

                <InputGroupAddon>
                  {addon &&
                    (() => {
                      const AddonIcon = addon;
                      return (
                        <AddonIcon
                          className={cn(error && "text-destructive/50")}
                        />
                      );
                    })()}
                </InputGroupAddon>
              </InputGroup>
            ) : (
              <Input
                id={name}
                type={type}
                placeholder={placeholder}
                tabIndex={tabindex}
                aria-invalid={!!error}
                value={value ?? field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                disabled={disabled}
                className={cn(
                  "bg-primary/10 rounded",
                  error &&
                    "bg-destructive/5 border-destructive/20 placeholder:text-destructive/40 text-destructive"
                )}
              />
            )}
          </>
        )}
      />

      <div className="w-full ">
        {error && (
          <div className="flex text-[0.6rem] item-center gap-1 text-destructive line-clamp-2 font-semibold">
            <Asterisk className="w-2 h-3" />
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};
