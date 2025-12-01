import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

export function KpiCard({ label, value, icon: Icon }: KpiCardProps) {
  return (
    <Card className='p-4 flex items-center gap-4'>
      {Icon && <div className='text-3xl'>{<Icon />}</div>}
      <div>
        <CardTitle className='text-sm text-muted-foreground'>{label}</CardTitle>
        <CardContent className='text-xl font-bold p-0'>{value}</CardContent>
      </div>
    </Card>
  );
}
