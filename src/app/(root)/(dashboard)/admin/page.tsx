import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { UserCheck } from "lucide-react";

const AdminPage = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
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
