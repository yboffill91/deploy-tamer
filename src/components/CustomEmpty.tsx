import { AlertTriangle, LucideIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "./ui";

interface Props {
  title: string;
  description: string;
  onClick?: () => void;
  icon: LucideIcon;
}

export function CustomEmpty({
  title,
  description,
  onClick,
  icon: Icon = AlertTriangle,
}: Props) {
  return (
    <Empty className='min-h-[96vh'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onClick && (
        <EmptyContent>
          <Button onClick={onClick}>Create</Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
