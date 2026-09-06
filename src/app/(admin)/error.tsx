"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // LOW-3: Log full error detail server-side / to monitoring — never surface internals to UI
    console.error("[AdminError]", error);
  }, [error]);

  // LOW-3: In production, display a generic message to prevent schema/table name leakage
  // via ORM or constraint error messages. The digest is safe to show — it's an opaque hash.
  const userFacingMessage =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again or contact support."
      : error.message || "An unexpected error occurred while loading this page.";

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4 animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-on-surface">Something went wrong!</h2>
        <p className="text-on-surface-variant max-w-md mx-auto">
          {userFacingMessage}
        </p>
        {error.digest && (
          <p className="text-xs text-on-surface-variant/60 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <Button
        onClick={() => reset()}
        variant="outline"
        className="mt-4 border-outline/50 hover:bg-surface-container"
      >
        Try again
      </Button>
    </div>
  );
}
