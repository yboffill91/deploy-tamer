import {
  MailWarning,
  CircleX,
  MousePointerClick,
  ShieldAlert,
  MailCheck,
  Timer,
  MailX,
  MailOpen,
  ListOrdered,
  CalendarClock,
  SendHorizontal,
  LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    icon: MailWarning,
    color: 'orange',
  },
  [EmailEvents.CANCELED]: { label: 'Canceled', icon: CircleX, color: 'slate' },
  [EmailEvents.CLICKED]: {
    label: 'Clicked',
    icon: MousePointerClick,
    color: 'blue',
  },
  [EmailEvents.COMPLAINED]: { label: 'Spam', icon: ShieldAlert, color: 'red' },
  [EmailEvents.DELIVERED]: {
    label: 'Delivered',
    icon: MailCheck,
    color: 'green',
  },
  [EmailEvents.DELIVERY_DELAYED]: {
    label: 'Delayed',
    icon: Timer,
    color: 'amber',
  },
  [EmailEvents.FAILED]: { label: 'Failed', icon: MailX, color: 'destructive' },
  [EmailEvents.OPENED]: { label: 'Opened', icon: MailOpen, color: 'indigo' },
  [EmailEvents.QUEUED]: { label: 'Queued', icon: ListOrdered, color: 'cyan' },
  [EmailEvents.SHCEDULED]: {
    label: 'Scheduled',
    icon: CalendarClock,
    color: 'violet',
  },
  [EmailEvents.SENT]: { label: 'Sent', icon: SendHorizontal, color: 'emerald' },
};

interface EmailStatusBadgeProps {
  status: EmailEvents;
  className?: string;
}

export const StatusBadge = ({
  status,
  className,
}: EmailStatusBadgeProps) => {
  const config = STATUS_MAP[status];

  if (!config) return null;

  const Icon = config.icon;


  const colorVariants: Record<string, string> = {
    orange: 'bg-orange-500/10 text-orange-600 ',
    slate: 'bg-slate-500/10 text-slate-600 ',
    blue: 'bg-blue-500/10 text-blue-600 ',
    red: 'bg-red-500/10 text-red-600 ',
    green: 'bg-green-500/10 text-green-600 ',
    amber: 'bg-amber-500/10 text-amber-600 ',
    destructive: 'bg-red-500/10 text-red-600 ',
    indigo: 'bg-indigo-500/10 text-indigo-600 ',
    cyan: 'bg-cyan-500/10 text-cyan-600 ',
    violet: 'bg-violet-500/10 text-violet-600 ',
    emerald: 'bg-emerald-500/10 text-emerald-600 ',
  };

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
    <Badge
      variant='secondary'
      className={cn(
        'text-md gap-4 min-w-36 w-full flex items-center justify-between',
        colorVariants[config.color],
        className
      )}
    >
      {config.label}
      <Icon size={14} strokeWidth={2.5} className={iconColor[config.color]} />
    </Badge>
  );
};
