"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  Home,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-bold text-foreground">
          Something whent worng
        </h1>

        <p className="mb-8 text-balance text-muted-foreground">
          Sorry but we recieve an unexpected error.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="lg" className="w-full sm:w-auto">
            Try Again <RefreshCcw />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-transparent"
            onClick={() => router.back()}
          >
            Get me save <ChevronLeft />
          </Button>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        {error.message && (
          <p className="mt-6 text-xs text-muted-foreground">
            Error: {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
