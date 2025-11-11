import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { Settings2 } from 'lucide-react';

const AdminPage = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Settings2 />
        </EmptyMedia>
        <EmptyTitle>Administration module under development.</EmptyTitle>
        <EmptyDescription>
          Tamer Team is in development mode. We&apos;ll be finished soon.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
};

export default AdminPage;
