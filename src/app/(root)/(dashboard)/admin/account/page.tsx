'use client';
import { useAuth } from '@/modules/auth';
import { ContentSection } from '@/modules/users/admin';

const AdminAccountSettingsPage = () => {
  const { user } = useAuth();
  return (
    <>
      <ContentSection
        title={'Manage Account'}
        desc={user?.email.getValue() ?? 'User Settings'}
      >
        <h3>Manage User Account</h3>
      </ContentSection>
    </>
  );
};

export default AdminAccountSettingsPage;
