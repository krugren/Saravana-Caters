"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
import { createTask, updateTaskStatus, deleteTask } from "@/features/tasks/actions";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Task = {
  id: string; title: string; description: string | null;
  status: string; priority: string; dueDate: string | null;
  sourceModule: string | null; createdAt: string;
};
type Assignee = { id: string; name: string | null } | null;
type TaskRow = { task: Task; assignee: Assignee };
type User = { id: string; name: string | null; role: string };

const STATUS_CYCLE: Record<string, string> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "TODO",
};
const STATUS_ICON: Record<string, React.ReactNode> = {
  TODO: <Circle className="w-4 h-4 text-on-surface-variant" />,
  IN_PROGRESS: <Clock className="w-4 h-4 text-amber-500" />,
  DONE: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
};
const PRIORITY_COLOR: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700 border-red-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function TasksClient({ allTasks, users }: { allTasks: TaskRow[]; users: User[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("all");
  const [form, setForm] = useState({
    title: "", description: "", priority: "MEDIUM", assignedTo: "", dueDate: "",
  });

  const filtered = activeTab === "all"
    ? allTasks
    : allTasks.filter(({ task }) => task.status === activeTab);

  const counts = {
    all: allTasks.length,
    TODO: allTasks.filter(({ task }) => task.status === "TODO").length,
    IN_PROGRESS: allTasks.filter(({ task }) => task.status === "IN_PROGRESS").length,
    DONE: allTasks.filter(({ task }) => task.status === "DONE").length,
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createTask({ title: form.title, description: form.description || undefined, priority: form.priority, assignedTo: form.assignedTo || undefined, dueDate: form.dueDate || undefined });
        setOpen(false);
        setForm({ title: "", description: "", priority: "MEDIUM", assignedTo: "", dueDate: "" });
        router.refresh();
        toast.success("Task created");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create task");
      }
    });
  }

  function handleStatusToggle(id: string, status: string) {
    const next = STATUS_CYCLE[status] ?? "TODO";
    startTransition(async () => {
      try {
        await updateTaskStatus(id, next);
        router.refresh();
        toast.success(`Moved to ${next.replace("_", " ")}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this task?")) return;
    startTransition(async () => {
      try {
        await deleteTask(id);
        router.refresh();
        toast.success("Task deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete task");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Tasks</h1>
          <p className="text-on-surface-variant">Track and manage work items across all modules.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Create Task
            </Button>
          } />
          <DialogContent showCloseButton={false} className="max-w-md bg-surface p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-xl font-display font-semibold text-on-surface">Create Task</DialogTitle>
                <DialogClose render={<button className="text-on-surface-variant hover:text-on-surface text-lg leading-none">&times;</button>} />
              </div>
              <DialogDescription className="text-sm text-on-surface-variant mb-5">Add a new task to track.</DialogDescription>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Title *</label>
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Priority</label>
                    <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Assign To</label>
                    <select value={form.assignedTo} onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="">Anyone</option>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Due Date</label>
                    <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-outline/40 bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <DialogClose render={<button type="button" className="px-4 py-2 text-sm rounded-lg border border-outline/40 text-on-surface-variant hover:bg-surface-container">Cancel</button>} />
                  <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                    {isPending ? "Saving…" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-surface-container-low mb-4">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="TODO">To Do ({counts.TODO})</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">In Progress ({counts.IN_PROGRESS})</TabsTrigger>
          <TabsTrigger value="DONE">Done ({counts.DONE})</TabsTrigger>
        </TabsList>

        {["all", "TODO", "IN_PROGRESS", "DONE"].map((tab) => (
          <TabsContent key={tab} value={tab} className="border border-outline/20 rounded-lg bg-surface-container-low/30 overflow-hidden">
            <Table>
              <TableHeader className="bg-surface-container">
                <TableRow>
                  <TableHead className="w-8">Status</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(tab === "all" ? allTasks : allTasks.filter(({ task }) => task.status === tab)).map(({ task, assignee }) => (
                  <TableRow key={task.id} className={`hover:bg-surface-container-low transition-colors ${task.status === "DONE" ? "opacity-60" : ""}`}>
                    <TableCell>
                      <button onClick={() => handleStatusToggle(task.id, task.status)} disabled={isPending}
                        className="hover:scale-110 transition-transform" title={`Click to advance to ${STATUS_CYCLE[task.status]}`}>
                        {STATUS_ICON[task.status] ?? <Circle className="w-4 h-4" />}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium text-on-surface ${task.status === "DONE" ? "line-through" : ""}`}>{task.title}</div>
                      {task.description && <div className="text-xs text-on-surface-variant mt-0.5">{task.description}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge className={PRIORITY_COLOR[task.priority] ?? ""}>{task.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-on-surface-variant">{assignee?.name ?? "Unassigned"}</TableCell>
                    <TableCell className="text-sm text-on-surface-variant">
                      {task.dueDate ? formatDate(task.dueDate) : "—"}
                    </TableCell>
                    <TableCell>
                      {task.sourceModule && (
                        <Badge variant="outline" className="text-xs border-outline/30 text-on-surface-variant">{task.sourceModule}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleDelete(task.id)} disabled={isPending}
                        className="border-red-200 text-red-600 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(tab === "all" ? allTasks : allTasks.filter(({ task }) => task.status === tab)).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-on-surface-variant">
                      No tasks here. Click <span className="text-primary font-medium">+ Create Task</span> to add one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
