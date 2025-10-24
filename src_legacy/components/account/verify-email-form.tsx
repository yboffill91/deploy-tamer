'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type VerifyEmailFormProps = {
  pendingEmail: string;
  onCancel: () => void;
};

export default function VerifyEmailForm({ pendingEmail, onCancel }: VerifyEmailFormProps) {
  const { user } = useUser();
  const [code, setCode] = useState('');

  async function handleVerify() {
    try {
      if (!user) return;

      const emailAddress = user.emailAddresses.find((e) => e.emailAddress === pendingEmail);
      if (!emailAddress) throw new Error('Pending email not found');

      // ✅ Validar con código
      await emailAddress.attemptVerification({ code });

      // Hacerlo primary si todo salió bien
      await user.update({ primaryEmailAddressId: emailAddress.id });

      toast.success('Email verified and updated successfully');
      onCancel(); // volvemos al form principal
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Verification failed');
    }
  }

  async function handleCancel() {
    try {
      if (!user) return;

      const emailAddress = user.emailAddresses.find((e) => e.emailAddress === pendingEmail);
      if (emailAddress) {
        await emailAddress.destroy(); // 🚨 eliminar email pendiente
      }

      toast('Verification cancelled');
      onCancel();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to cancel verification');
    }
  }

  return (
    <div className="mx-auto space-y-4 p-6">
      <h1 className="text-xl font-bold">Verify new email</h1>
      <p className="text-muted-foreground">
        We sent a code to <b>{pendingEmail}</b>. Enter it below to confirm your email change.
      </p>

      <Input placeholder="Enter verification code" value={code} onChange={(e) => setCode(e.target.value)} />

      <div className="flex gap-2">
        <Button onClick={handleVerify} disabled={!code}>
          Verify
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
