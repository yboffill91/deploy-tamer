// /app/admin/users-management/[id]/page.tsx
'use client';

import { UserEditForm } from '@/modules/users/admin/components/UserEditFor';
import { useParams } from 'next/navigation';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;

  return (
    <div className='p-6 max-w-lg mx-auto'>
      <h1 className='text-xl font-semibold mb-4'>Edit User</h1>
      <UserEditForm userId={userId} />
    </div>
  );
}
