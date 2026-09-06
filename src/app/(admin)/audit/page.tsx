import { getAuditLogs } from "@/features/dashboard/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Audit Trail</h1>
          <p className="text-on-surface-variant">System-wide activity and security logs.</p>
        </div>
      </div>

      <div className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-container">
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Entity ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(({ log, user }) => (
              <TableRow key={log.id} className="hover:bg-surface-container-low transition-colors">
                <TableCell className="text-on-surface-variant text-sm">
                  {formatDateTime(log.createdAt)}
                </TableCell>
                <TableCell className="font-medium text-on-surface">
                  {user?.name || "System"}
                </TableCell>
                <TableCell>
                  <Badge variant={log.action === "CREATE" ? "default" : log.action === "UPDATE" ? "secondary" : "destructive"}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.module}</TableCell>
                <TableCell className="font-mono text-xs text-on-surface-variant truncate max-w-[150px]">
                  {log.entityId}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-on-surface-variant">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
