# Joineazy — Student Assignments Dashboard (Demo)

A small React + Tailwind demo app that simulates a student-assignment management dashboard with role-based views (Student / Admin). No backend required — data is stored in localStorage.

## Features

- Role switcher: view as Student or Admin
- Students: see their assignments, drive link, and mark "submitted" via a double-confirmation modal
- Admins: create assignments, attach a Drive link, assign to students, and view per-student submission statuses with progress bars
- All data simulated in localStorage; persists across reloads
- Responsive layout using Tailwind CSS

## Tech stack

- React 18
- Vite
- Tailwind CSS
- Vanilla JS for data (mocked via localStorage)

## Quick start (Windows PowerShell)

1. Install dependencies

```powershell
npm install
```

2. Start dev server

```powershell
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173)

Build for production

```powershell
npm run build
npm run preview
```

## Folder structure

- `index.html` - Vite entry
- `package.json`, `vite.config.js`, `tailwind.config.cjs`, `postcss.config.cjs`
- `src/`
  - `main.jsx` - React entry bootstrapping `App`
  - `index.css` - Tailwind directives + helpers
  - `App.jsx` - Top-level: role & user selector, renders `Dashboard`
  - `utils/data.js` - Mock data and helpers (localStorage)
  - `components/`
    - `Dashboard.jsx` - Chooses Student or Admin view
    - `StudentView.jsx` - Student UI (list, submit flow)
    - `AdminView.jsx` - Admin UI (create + view statuses)
    - `AssignmentCard.jsx` - Reusable assignment card component
    - `ConfirmModal.jsx` - Double-confirmation modal
    - `ProgressBar.jsx` - Tiny progress indicator

## Component overview & design decisions

- Component-based: UI split into small components for clarity and reuse (e.g., `AssignmentCard` used by both views)
- State: small local state with `useState` / `useEffect` where needed; data is fetched from `src/utils/data.js`
- Data persistence: `localStorage` is used so actions (create assignment, submit) are remembered across reloads
- Double-verification: Students press "Mark Submitted" then confirm in `ConfirmModal` — only after confirmation is the submission recorded as `submitted` and `confirmed`.
- Admin view shows per-assignment progress calculated from the assignments' submissions. Progress is visualized via `ProgressBar`.
- Responsive: Tailwind grid and utility classes keep layout friendly on mobile and desktop.

## How data is modeled (brief)

- `users` — array of { id, name, role }
- `assignments` — array of { id, title, dueDate, driveLink, createdBy, assignedTo }
- `submissions` — array of { assignmentId, studentId, submitted, confirmed, timestamp }

## Deploying / GitHub

- Create a GitHub repo and push the folder. Example:

```powershell
git init
git add .
git commit -m "Initial commit: Joineazy demo"
# create repo on GitHub and push
```

- Deploy to Vercel or Netlify by connecting the GitHub repo. Vercel will detect the Vite app automatically. Build command: `npm run build`, publish directory: `dist`.

## Next steps / Improvements

- Add authentication or simulated tokens to lock data per demo user
- Add tests (React Testing Library) for main flows
- Add small animations and ARIA improvements for accessibility

---

If you'd like, I can:

- Run `npm install` and start the dev server (I can run the terminal commands for you here), or
- Add a small deploy configuration for GitHub Actions and Vercel, or
- Add unit tests and CI pipeline.

Which would you like me to do next?
