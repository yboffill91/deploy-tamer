import { Badge } from '@/components/ui/badge';

export function BadgeList({ items }: { items?: string[] }) {
  if (!items?.length) return null;

  return (
    <div className='flex flex-wrap gap-2'>
      {items.map((item) => (
        <Badge key={item} variant='secondary'>
          {item}
        </Badge>
      ))}
    </div>
  );
}
