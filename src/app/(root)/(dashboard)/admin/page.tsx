'use client';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { getAuth } from 'firebase/auth';
import { UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

const AdminPage = () => {
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    const getToken = async () => {
      const fbToken = await user?.getIdToken();
      setToken(fbToken ?? 'No token');
    };
    getToken();
  }, [token]);
  console.log(token);
  console.log(token);
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <UserCheck />
        </EmptyMedia>
        <EmptyTitle>User Management Features on development</EmptyTitle>
        <EmptyDescription>Working on the project .</EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
};

export default AdminPage;
