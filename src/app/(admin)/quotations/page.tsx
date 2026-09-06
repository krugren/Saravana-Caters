import { getQuotations } from "@/features/quotations/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function QuotationsPage() {
  const quotations = await getQuotations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Quotations</h1>
          <p className="text-on-surface-variant">Manage generated pricing quotes.</p>
        </div>
        <Link href="/quotations/new">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Quote
          </Button>
        </Link>
      </div>

      <div className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-container">
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Grand Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((qtn) => (
              <TableRow key={qtn.id} className="hover:bg-surface-container-low transition-colors">
                <TableCell className="font-medium">
                  <Link href={`/quotations/${qtn.id}`} className="text-primary hover:underline">
                    {qtn.quotationNumber}
                  </Link>
                </TableCell>
                <TableCell className="text-on-surface-variant text-sm">
                  {formatDateTime(qtn.createdAt)}
                </TableCell>
                <TableCell>
                  {qtn.eventType.replace("_", " ")}
                  <div className="text-xs text-on-surface-variant">
                    {formatDate(qtn.eventDate)}
                  </div>
                </TableCell>
                <TableCell>{qtn.guests}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(Number(qtn.grandTotal))}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-outline/30 bg-surface-container">
                    {qtn.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {quotations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-on-surface-variant">
                  No quotations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
