"use client";

import { useEffect, useMemo, useState } from "react";
import { initialNotes, initialTasks, type Note, type Task, type User } from "@/lib/data";

type AuthMode = "signin" | "signup";

type WorkspaceData = {
  notes: Note[];
  tasks: Task[];
};

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedNote, setSelectedNote] = useState<Note | null>(initialNotes[0]);
  const [draftTitle, setDraftTitle] = useState(initialNotes[0]?.title ?? "");
  const [draftContent, setDraftContent] = useState(initialNotes[0]?.content ?? "");
  const [taskTitle, setTaskTitle] = useState("");
  const [status, setStatus] = useState("Sign in to unlock your workspace.");
  const [loading, setLoading] = useState(false);

  const completedTasks = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const pinnedNotes = useMemo(() => notes.filter((note) => note.pinned), [notes]);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("northstar-user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser) as User;
    const storedWorkspace = window.localStorage.getItem(`northstar-workspace:${parsedUser.email}`);

    setUser(parsedUser);
    setIsSignedIn(true);
    setStatus(`Welcome back, ${parsedUser.name}.`);

    if (storedWorkspace) {
      const workspace = JSON.parse(storedWorkspace) as WorkspaceData;
      const hydratedNotes = workspace.notes?.length ? workspace.notes : initialNotes;
      const hydratedTasks = workspace.tasks?.length ? workspace.tasks : initialTasks;
      setNotes(hydratedNotes);
      setTasks(hydratedTasks);
      setSelectedNote(hydratedNotes[0] ?? initialNotes[0]);
      setDraftTitle(hydratedNotes[0]?.title ?? initialNotes[0]?.title ?? "");
      setDraftContent(hydratedNotes[0]?.content ?? initialNotes[0]?.content ?? "");
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const payload: WorkspaceData = { notes, tasks };
    window.localStorage.setItem(`northstar-workspace:${user.email}`, JSON.stringify(payload));
  }, [notes, tasks, user]);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(authMode === "signup" ? "Creating your workspace..." : "Signing you in...");

    const endpoint = authMode === "signup" ? "/api/auth/register" : "/api/auth/signin";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: authForm.name,
        email: authForm.email,
        password: authForm.password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus(data.error ?? "Authentication failed.");
      setLoading(false);
      return;
    }

    const nextUser = {
      name: authMode === "signup" ? authForm.name : data.user?.name ?? authForm.email,
      email: authForm.email,
    };

    window.localStorage.setItem("northstar-user", JSON.stringify(nextUser));
    setUser(nextUser);
    setIsSignedIn(true);
    setAuthForm({ name: "", email: "", password: "" });
    setNotes(initialNotes);
    setTasks(initialTasks);
    setSelectedNote(initialNotes[0]);
    setDraftTitle(initialNotes[0]?.title ?? "");
    setDraftContent(initialNotes[0]?.content ?? "");
    setStatus(authMode === "signup" ? "Account created. Your workspace is ready." : "Welcome back. Your workspace is loaded.");
    setLoading(false);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setDraftTitle(note.title);
    setDraftContent(note.content);
  };

  const handleSaveNote = () => {
    if (!selectedNote) return;

    const updated = notes.map((note) =>
      note.id === selectedNote.id
        ? {
            ...note,
            title: draftTitle || note.title,
            content: draftContent || note.content,
            updatedAt: new Date().toISOString(),
          }
        : note
    );

    setNotes(updated);
    setSelectedNote((current) =>
      current
        ? {
            ...current,
            title: draftTitle || current.title,
            content: draftContent || current.content,
            updatedAt: new Date().toISOString(),
          }
        : current
    );
  };

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled note",
      content: "Capture an important thought or plan...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    };

    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setDraftTitle(newNote.title);
    setDraftContent(newNote.content);
  };

  const togglePin = (noteId: string) => {
    setNotes((current) => current.map((note) => (note.id === noteId ? { ...note, pinned: !note.pinned } : note)));
  };

  const addTask = () => {
    if (!taskTitle.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle.trim(),
      done: false,
      priority: "Medium",
      dueDate: "Next week",
      category: "Personal",
    };
    setTasks([newTask, ...tasks]);
    setTaskTitle("");
  };

  const toggleTask = (taskId: string) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)));
  };

  const signOut = () => {
    window.localStorage.removeItem("northstar-user");
    setIsSignedIn(false);
    setUser(null);
    setNotes(initialNotes);
    setTasks(initialTasks);
    setSelectedNote(initialNotes[0]);
    setDraftTitle(initialNotes[0]?.title ?? "");
    setDraftContent(initialNotes[0]?.content ?? "");
    setStatus("Signed out. Sign in again to continue.");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] p-4 text-slate-800 sm:p-6 lg:p-8">
      {!isSignedIn ? (
        <section className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col justify-center rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur xl:flex-row xl:items-center xl:gap-12">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">Northstar Workspace</span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">A calm, collaborative operating system for modern teams.</h1>
            <p className="text-lg text-slate-600">Create notes, manage tasks, and keep momentum in one beautiful workspace inspired by the best productivity apps.</p>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Realtime notes</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Smart task tracking</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Responsive UI</div>
            </div>
          </div>
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
              <span>Secure access</span>
              <span>{authMode === "signin" ? "Sign in" : "Create account"}</span>
            </div>
            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === "signup" ? (
                <input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none" placeholder="Full name" />
              ) : null}
              <input value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none" placeholder="Email address" type="email" />
              <input value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none" placeholder="Password" type="password" />
              <button disabled={loading} className="w-full rounded-2xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
                {loading ? "Working..." : authMode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
              <button onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")} className="font-medium text-slate-300">
                {authMode === "signin" ? "Need an account?" : "Already have one?"}
              </button>
              <span>{status}</span>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto flex max-w-7xl flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/75 p-5 shadow-lg shadow-slate-200/60 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Welcome back</p>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{completedTasks}/{tasks.length} tasks completed</div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{pinnedNotes.length} pinned notes</div>
              <button onClick={signOut} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Sign out</button>
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-200/60">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Quick notes</h3>
                    <p className="text-sm text-slate-500">Capture ideas and keep them organized.</p>
                  </div>
                  <button onClick={addNote} className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white">+ New note</button>
                </div>
                <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <button key={note.id} onClick={() => handleSelectNote(note)} className={`w-full rounded-2xl border p-3 text-left transition ${selectedNote?.id === note.id ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold">{note.title}</h4>
                          {note.pinned ? <span className="text-xs text-amber-600">Pinned</span> : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{note.content}</p>
                      </button>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-semibold">Editor</h4>
                      <button onClick={() => selectedNote && togglePin(selectedNote.id)} className="text-sm font-medium text-slate-600">{selectedNote?.pinned ? "Unpin" : "Pin"}</button>
                    </div>
                    <input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none ring-0" placeholder="Note title" />
                    <textarea value={draftContent} onChange={(e) => setDraftContent(e.target.value)} className="min-h-40 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none ring-0" placeholder="Write your thoughts..." />
                    <div className="mt-3 flex justify-end">
                      <button onClick={handleSaveNote} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-200/60">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Task board</h3>
                    <p className="text-sm text-slate-500">Stay on top of priorities.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm outline-none" placeholder="Add a task" />
                  <button onClick={addTask} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add</button>
                </div>
                <div className="mt-4 space-y-2">
                  {tasks.map((task) => (
                    <label key={task.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <span className="flex items-center gap-3">
                        <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="h-4 w-4 rounded border-slate-300" />
                        <span className={`${task.done ? "text-slate-400 line-through" : "text-slate-700"}`}>{task.title}</span>
                      </span>
                      <span className="text-xs text-slate-500">{task.priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-slate-950 p-5 text-white shadow-lg shadow-slate-200/60">
                <h3 className="text-lg font-semibold">Focus snapshot</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Today</p>
                    <p className="mt-2 text-2xl font-semibold">3 deep work blocks</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Next milestone</p>
                    <p className="mt-2 text-2xl font-semibold">Launch polish</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
