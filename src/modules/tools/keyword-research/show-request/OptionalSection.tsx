import { Section } from './Section';

export function OptionalSection({
  title,
  data,
  children,
}: {
  title: string;
  data?: unknown;
  children: React.ReactNode;
}) {
  if (!data) return null;
  return <Section title={title}>{children}</Section>;
}
