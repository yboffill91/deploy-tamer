import {
  FieldValues,
  Path,
  FieldError,
  Control,
  Controller,
} from "react-hook-form";
import { MaskPatternKey, MaskInput } from "./ui/mask-input";
import { Label } from "./ui";

interface Props<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  control: Control<TFieldValues>;
  mask: MaskPatternKey;
  error?: FieldError;
  type?: string;
  value?: string;
  disabled?: boolean;
}

export const MaskControllerInput = <TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  mask,
  error,
  disabled,
  value,
}: Props<TFieldValues>) => {
  return (
    <div className="flex flex-col gap-1 min-h-18">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <MaskInput
            {...field}
            mask={mask}
            placeholder={placeholder}
            onValueChange={field.onChange}
            value={value ?? field.value}
            disabled={disabled}
          />
        )}
      />
      {error && <p className="text-destructive text-sm">{error.message}</p>}
    </div>
  );
};
