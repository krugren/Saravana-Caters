import { getTasks, getUsers } from "@/features/tasks/actions";
import TasksClient from "./tasks-client";

export default async function TasksPage() {
  const [allTasks, users] = await Promise.all([getTasks(), getUsers()]);
  return <TasksClient allTasks={allTasks} users={users} />;
}
