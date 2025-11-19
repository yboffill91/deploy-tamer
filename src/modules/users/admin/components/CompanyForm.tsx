import { CustomControllerInput } from "@/components/CustomControllerInput";
import { MaskControllerInput } from "@/components/CustomControllerMaskInput";
import { CustomLoading } from "@/components/CustomLoading";
import { showToast } from "@/components/CustomToaster";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Textarea,
} from "@/components/ui";
import { UsersEntity } from "@/core/entities";
import { CompanyEntity } from "@/core/entities/CompanyEntity";
import { CompanyApiRepository } from "@/infrastructure/repositories/CompanyRepository";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const CompanyFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),

  website: z
    .string()
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid website format")
    .optional()
    .or(z.literal("")),

  email: z.string().email("Invalid email").optional().or(z.literal("")),

  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  representative: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  ownerId: z.string().min(1, "Owner is required"),
});

type CompanyFormType = z.infer<typeof CompanyFormSchema>;

interface CompanyFormProps {
  company: CompanyEntity | null;
  users: UsersEntity[];
  editForm?: boolean;
  onComplete(): void;
}

export const CompanyForm = ({
  company,
  users,
  editForm = false,
  onComplete,
}: CompanyFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormType>({
    resolver: zodResolver(CompanyFormSchema),
    mode: "onBlur",
    defaultValues:
      company instanceof CompanyEntity
        ? {
            name: company.name,
            website: company.website,
            email: company.email,
            phone: company.phone,
            address: company.address,
            representative: company.representative,
            notes: company.notes,
            ownerId: company.ownerId,
          }
        : {
            name: "",
            website: "",
            email: "",
            phone: "",
            address: "",
            representative: "",
            notes: "",
            ownerId: "",
          },
  });

  const onSubmit = async (data: CompanyFormType) => {
    const COMPANY_REPO = new CompanyApiRepository();
    try {
      if (editForm) {
        await COMPANY_REPO.update(String(company!.id!), data);
        showToast({
          message: "Success",
          description: "Company updated successfully",
          type: "success",
        });
      } else {
        await COMPANY_REPO.create(data);
        showToast({
          message: "Success",
          description: "Company created successfully",
          type: "success",
        });
      }
      onComplete();
    } catch (error) {
      showToast({
        message: "Error",
        description:
          "Error creating company" +
          (error instanceof Error ? error.message : "Unexpected Error"),
        type: "error",
      });
    } finally {
      console.log(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* FULL WIDTH */}
        <div className="col-span-full">
          <CustomControllerInput
            name="name"
            label="Name"
            placeholder="Company Name"
            control={control}
            error={errors.name}
          />
        </div>

        {/* 2 COLUMNAS */}
        <CustomControllerInput
          name="website"
          label="Website"
          placeholder="example.com"
          control={control}
          error={errors.website}
        />

        <CustomControllerInput
          name="email"
          label="Email"
          placeholder="company@example.com"
          control={control}
          error={errors.email}
        />

        <MaskControllerInput
          name="phone"
          label="Phone"
          placeholder="(000) 000-0000"
          control={control}
          mask="phone"
          error={errors.phone}
        />

        <CustomControllerInput
          name="representative"
          label="Representative"
          placeholder="Company Representative"
          control={control}
          error={errors.representative}
        />

        {/* TEXTAREA FULL WIDTH */}
        <div className="col-span-full flex flex-col gap-1">
          <Label htmlFor="address">Address</Label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Address"
                className="min-h-[70px]"
              />
            )}
          />
          {errors.address && (
            <p className="text-destructive text-xs">{errors.address.message}</p>
          )}
        </div>

        <div className="col-span-full flex flex-col gap-1">
          <Label htmlFor="notes">Notes</Label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Additional notes..."
                className="min-h-[70px]"
              />
            )}
          />
          {errors.notes && (
            <p className="text-destructive text-xs">{errors.notes.message}</p>
          )}
        </div>

        {/* OWNER → FULL WIDTH */}
        <div className="col-span-full flex flex-col gap-1">
          <Label htmlFor="ownerId">Owner</Label>
          <Controller
            name="ownerId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((u) => (
                    <SelectItem key={u.id} value={String(u.id!)}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.ownerId && (
            <p className="text-destructive text-xs">{errors.ownerId.message}</p>
          )}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <CustomLoading message="Submitting..." /> : "Save"}
      </Button>
    </form>
  );
};
