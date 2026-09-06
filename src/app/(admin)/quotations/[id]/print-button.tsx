"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <Button variant="outline" className="border-outline/50 bg-surface-container hover:bg-surface-container-high" onClick={() => window.print()}>
      <Printer className="w-4 h-4 mr-2" />
      Print Quotation
    </Button>
  );
}
