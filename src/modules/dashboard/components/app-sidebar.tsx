"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { AdminSidebarItems, APP_CONFIG } from "../utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { useTheme } from "next-themes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const theme = useTheme();

  return (
    <Sidebar {...props} variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className=" hover:bg-transparent! min-w-12">
              <Avatar className="rounded-lg size-6">
                <AvatarImage
                  src={
                    theme.theme === "dark"
                      ? "/brand/light-t_transparent.webp"
                      : "/brand/dark-t_transparent.webp"
                  }
                />
                <AvatarFallback>TD</AvatarFallback>
              </Avatar>

              <span className="text-base font-semibold">{APP_CONFIG.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={AdminSidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
