"use client";

import * as React from "react";
import { X, ExternalLink, User, CreditCard, Calendar, Eye } from "lucide-react";

// Global drawer state
const DrawerContext = React.createContext<{
  isOpen: boolean;
  customer: Customer | null;
  openDrawer: (customer: Customer) => void;
  closeDrawer: () => void;
}>({
  isOpen: false,
  customer: null,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState<Customer | null>(null);

  const openDrawer = (customer: Customer) => {
    setCustomer(customer);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setCustomer(null);
  };

  React.useEffect(() => {
    const handleOpenDrawer = (event: any) => {
      const { customer } = event.detail;
      openDrawer(customer);
    };

    window.addEventListener("openCustomerDrawer", handleOpenDrawer);
    return () => {
      window.removeEventListener("openCustomerDrawer", handleOpenDrawer);
    };
  }, []);

  return (
    <DrawerContext.Provider value={{ isOpen, customer, openDrawer, closeDrawer }}>
      {children}
      {isOpen && customer && <GlobalDrawer />}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  return React.useContext(DrawerContext);
}

// Customer type
interface Customer {
  id: number;
  username: string;
  email: string;
  name: string;
  plan: "lite" | "pro" | "max";
  planStatus: "active" | "expired" | "suspended" | "trial";
  deliveryStatus: "processing" | "shipped" | "delivered" | "failed" | "pending";
  createdAt: string;
  lastLogin: string;
  revenue: number;
  multilinkViews: number;
  location: string;
  paymentMethod: string;
  nextBilling?: string;
  multilinkData: any;
}

// Global Drawer Component
function GlobalDrawer() {
  const { customer, closeDrawer } = useDrawer();

  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeDrawer();
        }}
      />

      {/* Drawer */}
      <div
        className="bg-card fixed top-0 right-0 z-[10000] h-full w-full max-w-md border-l shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>{customer.name}</DrawerTitle>
                <DrawerDescription>Customer details and multilink information</DrawerDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={closeDrawer}>
                <X size={16} />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-muted-foreground mb-3 flex items-center text-sm font-medium">
                  <User size={16} />
                  <span className="ml-2">Customer Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Name</span>
                    <span className="text-foreground text-sm font-medium">{customer.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Username</span>
                    <span className="text-foreground text-sm font-medium">@{customer.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Email</span>
                    <span className="text-foreground text-sm font-medium">{customer.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Location</span>
                    <span className="text-foreground text-sm font-medium">{customer.location}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Plan Info */}
              <div>
                <h3 className="text-muted-foreground mb-3 flex items-center text-sm font-medium">
                  <CreditCard size={16} />
                  <span className="ml-2">Plan & Billing</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Current Plan</span>
                    <PlanBadge plan={customer.plan} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Status</span>
                    <StatusBadge status={customer.planStatus} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Total Revenue</span>
                    <span className="text-foreground text-sm font-medium">{formatCurrency(customer.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Payment Method</span>
                    <span className="text-foreground text-sm font-medium">{customer.paymentMethod}</span>
                  </div>
                  {customer.nextBilling && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Next Billing</span>
                      <span className="text-foreground text-sm font-medium">{formatDate(customer.nextBilling)}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Activity */}
              <div>
                <h3 className="text-muted-foreground mb-3 flex items-center text-sm font-medium">
                  <Calendar size={16} />
                  <span className="ml-2">Activity</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Member Since</span>
                    <span className="text-foreground text-sm font-medium">{formatDate(customer.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Last Login</span>
                    <span className="text-foreground text-sm font-medium">{formatDate(customer.lastLogin)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Multilink Views</span>
                    <span className="text-foreground text-sm font-medium">{formatNumber(customer.multilinkViews)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Multilink Preview */}
              <div>
                <h3 className="text-muted-foreground mb-3 flex items-center text-sm font-medium">
                  <ExternalLink size={16} />
                  <span className="ml-2">Multilink Preview</span>
                </h3>
                <div className="bg-muted rounded-lg border p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
                        <span className="text-foreground text-lg font-semibold">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-foreground font-medium">{customer.multilinkData?.name || customer.name}</h4>
                        <p className="text-muted-foreground text-sm">
                          {customer.multilinkData?.title || "No title set"}
                        </p>
                      </div>
                    </div>

                    {customer.multilinkData?.description && (
                      <p className="text-muted-foreground text-sm">{customer.multilinkData.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Offers:</span>
                        <span className="text-foreground ml-1 font-medium">{customer.multilinkData?.offers || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Products:</span>
                        <span className="text-foreground ml-1 font-medium">
                          {customer.multilinkData?.products || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Views:</span>
                        <span className="text-foreground ml-1 font-medium">
                          {customer.multilinkData?.totalViews || customer.multilinkViews}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Theme:</span>
                        <span className="text-foreground ml-1 font-medium">
                          {customer.multilinkData?.primaryColor || "Default"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <div className="flex w-full space-x-2">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary flex-1">
                <ExternalLink size={16} />
                <span className="ml-2">View Multilink</span>
              </Button>
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent flex-1"
                onClick={closeDrawer}
              >
                Close
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </div>
    </div>
  );
}
function DrawerTrigger({
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
        setIsOpen?.(true);
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}

function DrawerContent({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen?.(false);
        }}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-[10000] h-full w-full max-w-md border-l border-gray-700 bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">{children}</div>
      </div>
    </div>
  );
}

function DrawerHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col space-y-1.5 border-b border-gray-700 p-6 ${className}`}>{children}</div>;
}

function DrawerTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-foreground text-lg leading-none font-semibold tracking-tight ${className}`}>{children}</h2>
  );
}

function DrawerDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-muted-foreground text-sm ${className}`}>{children}</p>;
}

function DrawerFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-2 border-t border-gray-700 p-6 ${className}`}>{children}</div>;
}

function DrawerClose({ children, setIsOpen }: { children: React.ReactNode; setIsOpen?: (open: boolean) => void }) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen?.(false);
      }}
    >
      {children}
    </div>
  );
}

// Simple components
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
  variant?: "default" | "ghost" | "outline" | "destructive";
  size?: "default" | "icon" | "sm";
  onClick?: () => void;
  [key: string]: any;
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "",
    ghost: "hover:bg-gray-700 hover:text-white text-foreground",
    outline: "border border-gray-600 bg-gray-800 hover:bg-gray-700 hover:text-white text-foreground",
    destructive: "bg-red-600 text-white hover:bg-red-700",
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
    default: "bg-blue-600 text-white",
    outline: "border border-current",
    destructive: "bg-red-600 text-white",
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
}

function Separator({ className = "" }: { className?: string }) {
  return <div className={`h-[1px] w-full shrink-0 bg-gray-700 ${className}`} />;
}

// Icons (now using Lucide React - keeping for backwards compatibility but using imports)

// Utility functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

// Status badge components
function PlanBadge({ plan }: { plan: Customer["plan"] }) {
  const configs = {
    lite: { label: "Lite", color: "bg-secondary text-secondary-foreground" },
    pro: { label: "Pro", color: "bg-accent text-accent-foreground" },
    max: { label: "Max", color: "bg-primary text-primary-foreground" },
  };

  const config = configs[plan] ?? { label: "Free", color: "bg-gray-200 text-gray-800" };

  return <Badge className={`${config.color} border-0 font-medium`}>{config.label}</Badge>;
}

function StatusBadge({ status }: { status: Customer["planStatus"] }) {
  const configs = {
    active: { label: "Active", color: "bg-secondary text-secondary-foreground" },
    expired: { label: "Expired", color: "bg-secondary text-secondary-foreground" },
    suspended: { label: "Suspended", color: "bg-secondary text-secondary-foreground" },
    trial: { label: "Trial", color: "bg-secondary text-secondary-foreground" },
  };

  const config = configs[status];

  return <Badge className={`${config.color} border-0 font-medium`}>{config.label}</Badge>;
}

// Legacy CustomerDrawer component for backwards compatibility
export function CustomerDrawer({ customer, children }: { customer: Customer; children?: React.ReactNode }) {
  const { openDrawer } = useDrawer();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openDrawer(customer);
      }}
      className="w-full cursor-pointer"
    >
      {children || (
        <Button variant="ghost" size="sm">
          <Eye size={16} />
          <span className="ml-2">View Details</span>
        </Button>
      )}
    </div>
  );
}
