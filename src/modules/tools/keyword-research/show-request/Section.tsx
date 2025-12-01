export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='my-6'>
      <h2 className='text-xl font-semibold mb-4'>{title}</h2>
      {children}
    </div>
  );
}
