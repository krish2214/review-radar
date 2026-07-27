export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
};

export type TaskPriority = "Low" | "Medium" | "High";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: TaskPriority;
  dueDate: string;
  category: string;
};

export type User = {
  name: string;
  email: string;
};

export const initialNotes: Note[] = [
  {
    id: "note-1",
    title: "Launch checklist",
    content:
      "Finalize onboarding flow, polish the dashboard, and ship the first public release.",
    createdAt: "2026-07-20T09:30:00.000Z",
    updatedAt: "2026-07-21T10:00:00.000Z",
    pinned: true,
  },
  {
    id: "note-2",
    title: "Design notes",
    content:
      "Use warm neutrals, subtle shadows, and a calm blue accent system for the workspace UI.",
    createdAt: "2026-07-22T08:15:00.000Z",
    updatedAt: "2026-07-22T08:15:00.000Z",
    pinned: false,
  },
];

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Refine the auth flow",
    done: true,
    priority: "High",
    dueDate: "Today",
    category: "Product",
  },
  {
    id: "task-2",
    title: "Wire up note editing",
    done: false,
    priority: "Medium",
    dueDate: "Tomorrow",
    category: "UX",
  },
  {
    id: "task-3",
    title: "Prepare deployment checklist",
    done: false,
    priority: "Low",
    dueDate: "Friday",
    category: "Ops",
  },
];
