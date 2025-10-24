'use client';

import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCustomerStore } from '@/stores/use-customer-store';

import VerifyEmailForm from './verify-email-form';

const profileFormSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user } = useUser();
  const { customer, updateCustomer } = useCustomerStore();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { username: '', email: '' },
  });

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    if (customer) {
      form.reset({
        username: customer.username || '',
        email: customer.email || '',
      });
    }
  }, [customer, form]);

  // 🔹 Handler de submit
  async function onSubmit(values: ProfileFormValues) {
    try {
      if (!user) return;

      const currentEmail = user.primaryEmailAddress?.emailAddress;

      // ✅ Si cambió email → activar verificación
      if (values.email !== currentEmail) {
        const existingEmail = user.emailAddresses.find((e) => e.emailAddress === values.email);

        if (existingEmail) {
          toast.error('That email is already in use');
          return;
        }

        await user.createEmailAddress({ email: values.email });
        setPendingEmail(values.email); // Mostrar VerifyEmailForm
        toast('We sent you a verification code');
        return;
      }

      // ✅ Actualizar username directo
      if (values.username !== user.username) {
        await user.update({ username: values.username });
        updateCustomer({ username: values.username });
        toast.success('Username updated successfully');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile');
    }
  }

  // 🔹 Handler cuando el usuario cancela verificación
  function handleCancelVerification() {
    setPendingEmail(null);

    // Restaurar email actual desde Clerk
    if (user?.primaryEmailAddress?.emailAddress) {
      form.setValue('email', user.primaryEmailAddress.emailAddress, {
        shouldDirty: false,
      });
    }
  }

  // 🔹 Mostrar flujo de verificación
  if (pendingEmail) {
    return <VerifyEmailForm pendingEmail={pendingEmail} onCancel={handleCancelVerification} />;
  }

  // 🔹 Form principal
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

          <Button type="submit" disabled={!form.formState.isDirty} className="w-full sm:w-auto">
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
