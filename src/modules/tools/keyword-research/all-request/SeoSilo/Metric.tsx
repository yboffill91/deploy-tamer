export const Metric = ({ label, value }: { label: string; value: number }) => (
  <span>
    <span className='font-medium'>{value}</span> {label}
  </span>
);

export const IntentBadge = ({
  intent,
}: {
  intent: 'TRANSACTIONAL' | 'INFORMATIONAL';
}) => {
  const styles =
    intent === 'TRANSACTIONAL'
      ? 'bg-green-500/10 text-green-600'
      : 'bg-blue-500/10 text-blue-600';

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      {intent}
    </span>
  );
};
