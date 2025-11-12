import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  message: string;
  description: string;
  type: "error" | "success";
}

export function showToast({ message, description, type }: Props) {
  toast.custom(() => (
    <div
      className={cn(
        "my-toast my-toast--success w-[365px]",
        type === "error" && "my-toast my-toast--error"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon">
        {type === "error" ? <XIcon /> : <CheckIcon />}
      </div>
      <div className="toast-body">
        <div className="toast-title">{message}</div>
        {description && <div className="toast-desc">{description}</div>}
      </div>
    </div>
  ));
}
