export function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className='text-muted-foreground text-xs'>{label}</p>
      <p className='font-medium'>{value ?? '—'}</p>
    </div>
  );
}
