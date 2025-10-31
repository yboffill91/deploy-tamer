'use client';

import { useParams } from 'next/navigation';
import { EditPositionForm } from '@/modules/users/admin/components';

export default function EditPositionPage() {
  const { id } = useParams<{ id: string }>();

  return <EditPositionForm id={id} />;
}
