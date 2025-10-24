import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomerDrawer } from "./customer-drawer";

// Lucide icons
import { MoreVertical, Check, X, Clock, AlertTriangle, Loader2, Truck, Package, Pause, Eye } from "lucide-react";

import { Customer } from "@/lib/api/types";

// Badge component
function Badge({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "destructive";
}) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-current",
    destructive: "bg-destructive text-destructive-foreground",
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
}

// Button component
function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "icon" | "sm";
  onClick?: () => void;
  [key: string]: any;
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
    sm: "h-9 rounded-md px-3",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Dropdown Menu components
function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-menu-container")) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className="dropdown-menu-container relative inline-block">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
          : child,
      )}
    </div>
  );
}

function DropdownMenuTrigger({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen?.(!isOpen);
      }}
    >
      {children}
    </div>
  );
}

function DropdownMenuContent({
  children,
  isOpen,
  className = "",
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
}) {
  if (!isOpen) return null;
  return (
    <div
      className={`absolute top-2 right-0 z-[1000] min-w-32 rounded-md border p-1 shadow-xl ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({
  children,
  onClick,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive";
  className?: string;
}) {
  const variants = {
    default: "hover:bg-gray-700",
    destructive: "text-red-400 hover:bg-red-600",
  };

  return (
    <div
      className={`relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none ${variants[variant]} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
    >
      {children}
    </div>
  );
}

function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-gray-600" />;
}

// Details button
function DetailsButton({ customer }: { customer: Customer }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        const drawerEvent = new CustomEvent("openCustomerDrawer", { detail: { customer } });
        window.dispatchEvent(drawerEvent);
      }}
      className="text-primary hover:bg-primary-muted cursor-pointer"
    >
      <Eye size={16} />
      <span className="ml-1">Details</span>
    </Button>
  );
}

// Plan badge
function PlanBadge({ plan }: { plan: Customer["plan"] }) {
  const configs = {
    lite: { label: "Lite", color: "bg-secondary text-secondary-foreground" },
    pro: { label: "Pro", color: "bg-accent text-accent-foreground" },
    max: { label: "Max", color: "bg-primary text-primary-foreground" },
  };
  const config = configs[plan] ?? { label: "Free", color: "bg-gray-200 text-gray-800" };
  return (
    <Badge variant="outline" className={`${config.color} border-0 font-medium`}>
      {config.label}
    </Badge>
  );
}

// Plan status badge
function PlanStatusBadge({ status }: { status: Customer["planStatus"] }) {
  const getStatusConfig = (status: Customer["planStatus"]) => {
    switch (status) {
      case "active":
        return { label: "Active", color: "bg-secondary text-secondary-foreground", icon: <Check size={12} /> };
      case "expired":
        return { label: "Expired", color: "bg-secondary text-secondary-foreground", icon: <X size={12} /> };
      case "suspended":
        return {
          label: "Suspended",
          color: "bg-secondary text-secondary-foreground",
          icon: <AlertTriangle size={12} />,
        };
      case "trial":
        return { label: "Trial", color: "bg-secondary text-secondary-foreground", icon: <Clock size={12} /> };
      default:
        return {
          label: status,
          color: "bg-secondary text-secondary-foreground",
          icon: <Loader2 size={12} className="animate-spin" />,
        };
    }
  };
  const config = getStatusConfig(status);
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1 border-0 font-medium`}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}

// Delivery status badge
function DeliveryStatusBadge({ status }: { status: Customer["deliveryStatus"] }) {
  const getStatusConfig = (status: Customer["deliveryStatus"]) => {
    switch (status) {
      case "processing":
        return {
          label: "Processing",
          color: "bg-secondary text-secondary-foreground",
          icon: <Loader2 size={12} className="animate-spin" />,
        };
      case "shipped":
        return { label: "Shipped", color: "bg-secondary text-secondary-foreground", icon: <Truck size={12} /> };
      case "delivered":
        return { label: "Delivered", color: "bg-secondary text-secondary-foreground", icon: <Package size={12} /> };
      case "failed":
        return { label: "Failed", color: "bg-secondary text-secondary-foreground", icon: <X size={12} /> };
      case "pending":
        return { label: "Pending", color: "bg-secondary text-secondary-foreground", icon: <Pause size={12} /> };
      default:
        return {
          label: status,
          color: "bg-secondary text-secondary-foreground",
          icon: <Loader2 size={12} className="animate-spin" />,
        };
    }
  };
  const config = getStatusConfig(status);
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1 border-0 font-medium`}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}

// User info cell with CustomerDrawer
function UserInfoCell({ customer }: { customer: Customer }) {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="hover:bg-muted -m-1 flex cursor-pointer items-center justify-start space-x-3 rounded-md p-1 transition-colors">
      <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full">
        <span className="text-xs font-medium">{initials}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{customer.name}</span>
        <span className="text-muted-foreground text-xs">@{customer.username}</span>
      </div>
    </div>
  );
}

// Revenue cell
function RevenueCell({ customer }: { customer: Customer }) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  const formatNumber = (num: number) => new Intl.NumberFormat("en-US").format(num);

  return (
    <div className="text-right">
      <div className="font-medium">{formatCurrency(customer.revenue)}</div>
      <div className="text-xs text-gray-400">{formatNumber(customer.multilinkViews)} views</div>
    </div>
  );
}

// Date formatter
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

// Actions menu
function ActionsMenu({ customer }: { customer: Customer }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical size={16} />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem
          onClick={() => window.dispatchEvent(new CustomEvent("openCustomerDrawer", { detail: { customer } }))}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem>View Multilink</DropdownMenuItem>
        <DropdownMenuItem>Edit Customer</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{customer.planStatus === "suspended" ? "Reactivate" : "Suspend"}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Column definitions
export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => <UserInfoCell customer={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm text-gray-400">{row.original.email}</div>,
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
  },
  {
    accessorKey: "planStatus",
    header: "Status",
    cell: ({ row }) => <PlanStatusBadge status={row.original.planStatus} />,
  },
  {
    accessorKey: "deliveryStatus",
    header: "Delivery",
    cell: ({ row }) => <DeliveryStatusBadge status={row.original.deliveryStatus} />,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div className="text-sm">{row.original.location}</div>,
  },
  {
    accessorKey: "revenue",
    header: () => <div className="text-right">Revenue</div>,
    cell: ({ row }) => <RevenueCell customer={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <div className="text-sm text-gray-400">{formatDate(row.original.createdAt)}</div>,
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => <div className="text-sm text-gray-400">{formatDate(row.original.lastLogin)}</div>,
  },
  {
    id: "details",
    header: () => <div className="text-center">Details</div>,
    cell: ({ row }) => <DetailsButton customer={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
