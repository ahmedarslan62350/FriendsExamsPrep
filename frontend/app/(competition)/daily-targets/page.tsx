"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { completeTask, createTask, deleteTask, getTasks } from "@/lib/api";
import { type Task } from "@/lib/types";

export default function DailyTargetsPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    if (!token) return;
    const authToken = token;
    const result = await getTasks(authToken);
    setTasks(result);
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const run = async () => {
      try {
        await loadTasks();
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load tasks.");
      }
    };

    void Promise.resolve().then(run);
  }, [loadTasks, token]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const completion = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const totalXp = tasks.reduce((sum, task) => sum + (task.xpReward ?? 0), 0);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge>Today&apos;s mission</Badge>
              <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Live daily tasks</h1>
              <div className="mt-4 inline-flex items-center gap-2 rounded-[8px] border border-black/15 bg-neutral-50 px-4 py-2 text-sm text-neutral-700">
                <Target className="size-4" />
                {totalXp} XP available from `/tasks`
              </div>
            </div>
            <div className="min-w-[240px] rounded-[12px] border border-black/15 bg-neutral-50 p-5">
              <div className="text-sm text-slate-400">Completion</div>
              <div className="mt-2 text-4xl font-bold text-white">{completion}%</div>
              <div className="mt-2 text-sm text-neutral-600">
                {completedCount}/{tasks.length} tasks completed
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="space-y-4 p-5">
          <Badge>Create task</Badge>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input placeholder="New task title" value={newTask} onChange={(event) => setNewTask(event.target.value)} />
            <Button
              onClick={async () => {
                if (!token || !newTask.trim()) return;
                await createTask(token, { title: newTask.trim(), xpReward: 20, estimatedMinutes: 60 });
                setNewTask("");
                await loadTasks();
              }}
            >
              <Plus className="mr-2 size-4" />
              Add task
            </Button>
          </div>
        </CardContent>
      </Card>

      {error ? <div className="text-sm text-neutral-600">{error}</div> : null}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task._id}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-semibold text-black">{task.title}</div>
                <div className="mt-1 text-sm text-neutral-600">
                  {task.xpReward ?? 0} XP reward | {task.estimatedMinutes ?? 0} minutes | {task.completed ? "Completed" : "Pending"}
                </div>
              </div>
              <div className="flex gap-2">
                {!task.completed ? (
                  <Button
                    onClick={async () => {
                      if (!token) return;
                      await completeTask(token, task._id);
                      await loadTasks();
                    }}
                  >
                    Complete
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  onClick={async () => {
                    if (!token) return;
                    await deleteTask(token, task._id);
                    await loadTasks();
                  }}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
