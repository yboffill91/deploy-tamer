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
} from "@/components/ui";
import { UsersEntity } from "@/core/entities";
import { CompanyEntity } from "@/core/entities/CompanyEntity";
import { CompanyApiRepository } from "@/infrastructure/repositories/CompanyRepository";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const CompanyFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  website: z.string().url("Invalid URL").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  representative: z.string().optional(),
  notes: z.string().optional(),
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <CustomControllerInput
          name="name"
          label="Name"
          placeholder="Company Name"
          control={control}
          error={errors.name}
        />
        <CustomControllerInput
          name="website"
          label="Website"
          placeholder="Company Website"
          control={control}
          error={errors.website}
        />
        <CustomControllerInput
          name="email"
          label="Company Email"
          placeholder="company@example.com"
          control={control}
          error={errors.email}
        />
        <MaskControllerInput
          name="phone"
          label="Company Phone"
          placeholder="Company Phone"
          control={control}
          mask="phone"
          error={errors.phone}
        />
        <CustomControllerInput
          name="address"
          label="Company Address"
          placeholder=""
          control={control}
          error={errors.address}
          type="textarea"
        />
        <CustomControllerInput
          name="representative"
          label="Company Representative"
          placeholder=""
          control={control}
          error={errors.representative}
          type="text"
        />
        <CustomControllerInput
          name="notes"
          label="Company Notes"
          placeholder=""
          control={control}
          error={errors.notes}
          type="textarea"
        />
        <Controller
          name="ownerId"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <Label htmlFor="ownerId">Owner</Label>
              <Select value={field.value} onValueChange={field.onChange}>
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
            </div>
          )}
        />
        <Button type="submit" className="w-full mt-8" disabled={isSubmitting}>
          {isSubmitting ? <CustomLoading message="Submitting ..." /> : "Save"}
        </Button>
      </form>
    </>
  );
};
