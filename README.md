# Northstar Workspace

Northstar Workspace is a polished productivity application inspired by Notion, built with Next.js, TypeScript, and Tailwind CSS. It combines a calm, modern interface with note-taking, task management, authentication-style access, and local persistence for a portfolio-ready experience.

## ✨ Features

- Responsive, modern dashboard UI
- Quick notes with create, edit, pin, and select actions
- Task board with add and complete workflows
- Authentication-style sign-in/sign-up experience
- Local persistence so your workspace state is retained across refreshes
- Clean, professional layout designed for showcasing full-stack frontend skills

## 🛠️ Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Node.js

## 🚀 Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Run the development server
   ```bash
   npm run dev
   ```

3. Open your browser at
   ```text
   http://localhost:3000
   ```

## 📁 Project Structure

```text
src/
  app/
    api/auth/          # auth routes
    globals.css       # global styles
    layout.tsx        # app layout
    page.tsx          # main productivity UI
  lib/
    auth-utils.ts     # password helpers
    data.ts           # sample workspace data
    db.ts             # local persistence helpers
```

## 🧪 Build

To verify the project builds successfully:

```bash
npm run build
```

## ☁️ Deployment

This app is ready to be deployed on platforms like Vercel or Netlify.

## 👤 Author

Built as a modern portfolio project to demonstrate full-stack frontend development, UI design, and product thinking.
