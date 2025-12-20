import {
  LucideIcon,
  Dot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmailEvents } from '@/core/entities';

type StatusConfig = {
  label: string;
  icon: LucideIcon;
  color: string;
};

const STATUS_MAP: Record<EmailEvents, StatusConfig> = {
  [EmailEvents.BOUNCED]: {
    label: 'Bounced',
    icon: Dot,
    color: 'orange',
  },
  [EmailEvents.CANCELED]: { label: 'Canceled', icon: Dot, color: 'slate' },
  [EmailEvents.CLICKED]: {
    label: 'Clicked',
    icon: Dot,
    color: 'blue',
  },
  [EmailEvents.COMPLAINED]: { label: 'Spam', icon: Dot, color: 'red' },
  [EmailEvents.DELIVERED]: {
    label: 'Delivered',
    icon: Dot,
    color: 'green',
  },
  [EmailEvents.DELIVERY_DELAYED]: {
    label: 'Delayed',
    icon: Dot,
    color: 'amber',
  },
  [EmailEvents.FAILED]: { label: 'Failed', icon: Dot, color: 'destructive' },
  [EmailEvents.OPENED]: { label: 'Opened', icon: Dot, color: 'indigo' },
  [EmailEvents.QUEUED]: { label: 'Queued', icon: Dot, color: 'cyan' },

  [EmailEvents.SHCEDULED]: {
    label: 'Scheduled',
    icon: Dot,
    color: 'violet',
  },
  [EmailEvents.SENT]: { label: 'Sent', icon: Dot, color: 'emerald' },
};

interface EmailStatusBadgeProps {
  status: EmailEvents;
  className?: string;
}

export const StatusBadge = ({ status, className }: EmailStatusBadgeProps) => {
  const config = STATUS_MAP[status];

  if (!config) return null;

  const Icon = config.icon;

  const iconColor: Record<string, string> = {
    orange: ' text-orange-600 ',
    slate: ' text-slate-600 ',
    blue: ' text-blue-600 ',
    red: ' text-red-600 ',
    green: ' text-green-600 ',
    amber: ' text-amber-600 ',
    destructive: ' text-red-600 ',
    indigo: ' text-indigo-600 ',
    cyan: ' text-cyan-600 ',
    violet: ' text-violet-600 ',
    emerald: ' text-emerald-600 ',
  };

  return (
    <span className={cn('text-md gap-1  items-center flex ', className)}>
      <Icon className={cn('size-8', iconColor[config.color])} />
      {config.label}
    </span>
  );
};
