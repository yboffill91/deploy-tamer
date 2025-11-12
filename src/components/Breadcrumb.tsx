"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

interface BreadcrumbProps {
  className?: string;
  separator?: React.ReactNode;
  is404?: boolean;
}

export function Breadcrumb({
  className,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  is404 = false,
}: BreadcrumbProps) {
  const pathname = usePathname();

  const isNotFoundPage = is404 || pathname.includes("/404");

  if (isNotFoundPage) {
    return (
      <nav
        aria-label="Breadcrumb"
        className={cn("flex items-center justify-center ", className)}
      >
        <Link href="#">
          <Button variant="ghost" size="sm">
            <Home />
          </Button>
        </Link>
      </nav>
    );
  }

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const filteredSegments = segments.filter(
    (segment) => !["services", "tools"].includes(segment.toLowerCase())
  );

  if (filteredSegments.length === 0) return null;

  const breadcrumbItems = filteredSegments.map((segment, index) => {
    const segmentIndex = segments.indexOf(segment);
    const path = `/${segments.slice(0, segmentIndex + 1).join("/")}`;

    const displayName = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    const isLastItem = index === filteredSegments.length - 1;

    return {
      name: displayName,
      path,
      isLastItem,
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center justify-center ", className)}
    >
      <Link href="#">
        <Button variant="ghost" size="sm">
          <Home />
          {separator}
        </Button>
      </Link>
      {breadcrumbItems.map(({ name, path, isLastItem }, index) => (
        <Link key={name + index} className="" href={path}>
          <Button
            variant="ghost"
            size="sm"
            className={`${
              isLastItem
                ? " pointer-events-none text-accent"
                : "pointer-events-auto"
            }`}
          >
            {name} {!isLastItem && separator}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
