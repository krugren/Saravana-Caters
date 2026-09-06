"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChefHat, ChevronRight } from "lucide-react";
import { updatePlanStatus, updateKitchenTaskStatus } from "@/features/kitchen/actions";
import { formatDate } from "@/lib/utils";

type Plan = {
  id: string; bookingId: string; status: string;
  headChefId: string | null; notes: string | null;
  createdAt: string; updatedAt: string;
};
type Booking = { id: string; eventDate: string; eventType: string; venue: string | null } | null;
type HeadChef = { id: string; name: string | null } | null;
type KitchenTask = {
  id: string; planId: string; dishId: string | null; timeSlot: string;
  assignedTo: string | null; status: string; durationMinutes: number | null; notes: string | null;
};
type Dish = { id: string; name: string; category: string } | null;
type Assignee = { id: string; name: string | null } | null;
type KitchenTaskRow = { task: KitchenTask; dish: Dish; assignee: Assignee };

type PlanRow = { plan: Plan; booking: Booking; headChef: HeadChef };

const PLAN_STATUSES = ["PENDING", "IN_PROGRESS", "DONE"];
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  DONE: "bg-emerald-100 text-emerald-700 border-emerald-200",
};
const TASK_STATUS_CYCLE: Record<string, string> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "TODO",
};

export default function KitchenClient({ plans }: { plans: PlanRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [planTasks, setPlanTasks] = useState<Record<string, KitchenTaskRow[]>>({});
  const [loadingTasks, setLoadingTasks] = useState<string | null>(null);

  async function handleExpand(planId: string) {
    if (expandedPlan === planId) { setExpandedPlan(null); return; }
    setExpandedPlan(planId);
    if (planTasks[planId]) return;
    setLoadingTasks(planId);
    const res = await fetch(`/api/kitchen/tasks?planId=${planId}`);
    if (res.ok) {
      const data = await res.json();
      setPlanTasks((p) => ({ ...p, [planId]: data }));
    }
    setLoadingTasks(null);
  }

  function handlePlanStatus(id: string, status: string) {
    startTransition(async () => { await updatePlanStatus(id, status); router.refresh(); });
  }

  function handleTaskStatus(id: string, status: string) {
    const next = TASK_STATUS_CYCLE[status] ?? "TODO";
    startTransition(async () => {
      await updateKitchenTaskStatus(id, next);
      // Refresh task list for the expanded plan
      setPlanTasks((p) => ({
        ...p,
        ...(expandedPlan ? {
          [expandedPlan]: (p[expandedPlan] ?? []).map((r) =>
            r.task.id === id ? { ...r, task: { ...r.task, status: next } } : r
          )
        } : {})
      }));
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Kitchen Operations</h1>
          <p className="text-on-surface-variant">View and manage daily preparation plans.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <ChefHat className="w-4 h-4" />
          <span>{plans.length} plan{plans.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Status legend */}
      <div className="flex gap-3">
        {PLAN_STATUSES.map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${STATUS_COLORS[s]}`}>{s}</span>
          </div>
        ))}
        <span className="text-xs text-on-surface-variant ml-2">← Click status to update</span>
      </div>

      <div className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-container">
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Head Chef</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-on-surface-variant">
                  No kitchen plans yet. Plans are auto-created when a quotation is confirmed.
                </TableCell>
              </TableRow>
            )}
            {plans.map(({ plan, booking, headChef }) => (
              <>
                <TableRow
                  key={plan.id}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => handleExpand(plan.id)}
                >
                  <TableCell>
                    <ChevronRight className={`w-4 h-4 text-on-surface-variant transition-transform ${expandedPlan === plan.id ? "rotate-90" : ""}`} />
                  </TableCell>
                  <TableCell className="font-medium text-on-surface">
                    {booking?.eventDate ? formatDate(booking.eventDate) : "TBD"}
                  </TableCell>
                  <TableCell>{booking?.eventType?.replace("_", " ") ?? "—"}</TableCell>
                  <TableCell className="text-on-surface-variant">{booking?.venue ?? "—"}</TableCell>
                  <TableCell>{headChef?.name ?? <span className="text-on-surface-variant/50 italic">Unassigned</span>}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <select
                      value={plan.status}
                      onChange={(e) => handlePlanStatus(plan.id, e.target.value)}
                      disabled={isPending}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${STATUS_COLORS[plan.status] ?? ""}`}
                    >
                      {PLAN_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </TableCell>
                </TableRow>
                {expandedPlan === plan.id && (
                  <TableRow key={`${plan.id}-tasks`}>
                    <TableCell colSpan={6} className="bg-surface-container/30 px-8 py-4">
                      {loadingTasks === plan.id ? (
                        <p className="text-sm text-on-surface-variant">Loading tasks…</p>
                      ) : (planTasks[plan.id] ?? []).length === 0 ? (
                        <p className="text-sm text-on-surface-variant italic">No tasks assigned to this plan yet.</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-3">Prep Tasks</p>
                          {(planTasks[plan.id] ?? []).map(({ task, dish, assignee }) => (
                            <div key={task.id} className="flex items-center gap-4 bg-surface rounded-lg px-4 py-2.5 border border-outline/10">
                              <button
                                onClick={() => handleTaskStatus(task.id, task.status)}
                                disabled={isPending}
                                className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${STATUS_COLORS[task.status] ?? ""}`}
                              >
                                {task.status.replace("_", " ")}
                              </button>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-on-surface">{dish?.name ?? "Task"}</span>
                                {task.notes && <span className="text-xs text-on-surface-variant ml-2">{task.notes}</span>}
                              </div>
                              <div className="text-xs text-on-surface-variant">{task.timeSlot}</div>
                              <div className="text-xs text-on-surface-variant">{assignee?.name ?? "Unassigned"}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
