"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Wraps a server action with loading state, router.refresh(), success/error toasts.
 * Returns [isPending, run].
 */
export function useAction() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(
    action: () => Promise<unknown>,
    options?: { success?: string; error?: string }
  ) {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
        if (options?.success) toast.success(options.success);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        toast.error(options?.error ?? msg);
      }
    });
  }

  return [isPending, run] as const;
}
