import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const CommonHeader = ({ icon: Icon, title, desc }: Props) => {
  return (
    <div className="mb-6">
      <h1 className="text-xl tracking-tight flex items-center gap-2 ">
        <Icon className="size-5" />
        {title}
      </h1>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
};
