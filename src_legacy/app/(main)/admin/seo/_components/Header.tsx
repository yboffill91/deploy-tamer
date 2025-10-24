"use client";

import { Search, List, CheckCheck, X } from "lucide-react";
import { Building } from "lucide-react";
import { MapPin } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SVGProps, ForwardRefExoticComponent, RefAttributes } from "react";

interface NavigationItem {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>>;
  closeable?: boolean;
}

const baseNavigation: NavigationItem[] = [
  {
    name: "Keyword Research",
    href: "/admin/seo/key_research",
    icon: Search,
  },
  {
    name: "All Requests",
    href: "/admin/seo/requests",
    icon: List,
  },
  {
    name: "Company List",
    href: "/admin/seo/company",
    icon: Building,
  },
  {
    name: "City List",
    href: "/admin/seo/city",
    icon: MapPin,
  },
  {
    name: "Negative Keywords Search Intent",
    href: "/admin/seo/negative-keyword-si",
    icon: AlertTriangle,
  },
];

interface OpenTab {
  id: string;
  title: string;
}

export const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get("id");
  const requestTitle = searchParams.get("title");
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);

  useEffect(() => {
    // Load open tabs from localStorage
    const savedTabs = localStorage.getItem("openTabs");
    if (savedTabs) {
      setOpenTabs(JSON.parse(savedTabs));
    }
  }, []);

  useEffect(() => {
    // Add new tab if requestId exists and tab isn't already open
    if (requestId && requestTitle) {
      setOpenTabs((prev) => {
        if (!prev.some((tab) => tab.id === requestId)) {
          const newTabs = [...prev, { id: requestId, title: requestTitle }];
          localStorage.setItem("openTabs", JSON.stringify(newTabs));
          return newTabs;
        }
        return prev;
      });
    }
  }, [requestId, requestTitle]);

  const navigation = useCallback(() => {
    const items = [...baseNavigation];

    // Add all open tabs
    openTabs.forEach((tab) => {
      items.push({
        name: decodeURIComponent(tab.title) || "Results",
        href: `/results?id=${tab.id}&title=${tab.title}`,
        icon: CheckCheck,
        closeable: true,
      });
    });

    return items;
  }, [openTabs]);

  const handleClose = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const params = new URLSearchParams(href.split("?")[1]);
    const tabId = params.get("id");

    if (tabId) {
      setOpenTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== tabId);
        localStorage.setItem("openTabs", JSON.stringify(newTabs));
        return newTabs;
      });

      // Only navigate if we're closing the current tab
      if (pathname.startsWith("/results") && searchParams.get("id") === tabId) {
        router.push("/requests");
      }
    }
  };

  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="flex space-x-8">
          {navigation().map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative",
                  "hover:text-primary flex items-center gap-2 border-b-2 py-4 transition-colors",
                  pathname === item.href ? "border-primary text-primary" : "text-muted-foreground border-transparent",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
                {item.closeable && (
                  <button
                    onClick={(e) => handleClose(e, item.href)}
                    className={cn(
                      "hover:bg-muted ml-2 rounded-full p-1",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
