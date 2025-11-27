import { Bell, LucideIcon } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from './ui';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  variant?: 'default' | 'banner';
  disabled?: boolean;
  action?: ReactNode;
}

export const CustomCard = ({
  title,
  icon: Icon,
  children,
  variant = 'default',
  disabled = false,
  action,
}: Props) => {
  return (
    <Card
      className={cn(
        'w-full',
        variant === 'banner' && 'bg-background text-background-foreground',
        disabled && 'bg-muted text-muted-foreground pointer-events-none'
      )}
    >
      <CardHeader>
        <CardTitle className='flex items-center justify-between gap-2 '>
          <div className='flex items-center gap-2'>
            <Icon className='size-5' />
            <h2 className='text-[clamp(0.8rem,5vw,1.2rem)] font-semibold'>
              {title}
            </h2>
          </div>
          {action && <span>{action}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
