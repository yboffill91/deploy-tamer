// app/settings/layout.tsx
"use client";

import { CreditCard, CircleUser } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Main } from "./_components/main";
import SidebarNav from "./_components/sidebar-nav";
import { usePathname } from "next/navigation";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarNavItems = [
    {
      title: "Profile",
      icon: <CircleUser size={18} />,
      href: "/admin/settings/account",
      isActive: pathname === "/admin/settings/account",
    },
    {
      title: "Billing",
      icon: <CreditCard size={18} />,
      href: "/admin/settings/billing",
      isActive: pathname === "/admin/settings/billing",
    },
  ];

  return (
    <>
      {/* ===== Top Heading ===== */}
      {/* <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header> */}

      <Main fixed>
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full overflow-y-hidden p-1">{children}</div>
        </div>
      </Main>
    </>
  );
}
