import { Breadcrumb } from "@/components/Breadcrumb";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/modules/dashboard";
import { ReactNode } from "react";

const layout = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <>
      <SidebarProvider defaultOpen>
        <AppSidebar variant="sidebar" />
        <SidebarInset
          //   data-content-layout={contentLayout}
          className={cn(
            "data-[content-layout=centered]:mx-auto! data-[content-layout=centered]:max-w-screen-2xl",

            "max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!"
          )}
        >
          <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-1 lg:gap-2">
                <SidebarTrigger className="-ml-1" />

                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb />
                {/* <SearchDialog /> */}
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />

                {/* <AccountSwitcher users={users} /> */}
              </div>
            </div>
          </header>
          <div className="h-full p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default layout;
