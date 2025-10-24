// components/ProfileForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, Mail } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateCustomer } from "@/hooks/update/use-update-customer";
import { toast } from "sonner";
import { useCustomerStore } from "@/stores/use-customer-store"; // ✅ Usar store directamente

// Schema simplificado - solo username y email
const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(30, "Username must not be longer than 30 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  // ✅ Usar el store directamente en lugar del hook useCustomer
  const { customer, updateCustomer } = useCustomerStore();

  const { updateCustomerAsync, isLoading: updateLoading, isError, error } = useUpdateCustomer();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
    },
    mode: "onChange",
  });

  // Cargar datos del store cuando estén disponibles
  useEffect(() => {
    if (customer) {
      form.reset({
        username: customer.username || "",
        email: customer.email || "",
      });
    }
  }, [customer, form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      console.log("Enviando datos:", data);

      // ✅ Usar updateCustomerAsync
      const updatedCustomer = await updateCustomerAsync({
        username: data.username,
        email: data.email,
      });

      if (updatedCustomer) {
        console.log("Customer actualizado:", updatedCustomer);

        // ✅ Actualizar el store con los nuevos datos
        updateCustomer({
          username: data.username,
          email: data.email,
        });

        toast.success("Perfil actualizado correctamente");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`Error al actualizar el perfil: ${error}`);
    }
  }

  if (!customer) {
    return (
      <div className="mx-auto p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-muted-foreground">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto h-[52vh] w-full space-y-8 overflow-y-auto p-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Edit Profile</h1>
        <p className="text-muted-foreground">Update your username and email address.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>This is your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormDescription>Your email address for notifications.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={updateLoading || !form.formState.isDirty} className="w-full sm:w-auto">
            {updateLoading ? "Updating..." : "Update profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
