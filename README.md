# Smart Student Planner PWA

A modern, fast, installable Progressive Web App built with React, Vite, and Tailwind CSS. Helps students manage tasks, focus with Pomodoro, and works completely offline.

## Features
- **Offline First**: Uses IndexedDB (`localforage`)
- **PWA Ready**: Installable on Home Screen, caching via Workbox
- **Smart Dashboard**: Progress metrics & dynamic task suggestions
- **Task Management**: Full CRUD for study tasks
- **Focus Timer**: Built-in visual 25/5 Pomodoro timer
- **Dark Mode**: Class-based manual toggle

## Tech Stack
- React 18
- Vite
- Tailwind CSS v3
- `vite-plugin-pwa`
- `lucide-react` (Icons)
- `date-fns` (Date formatting)

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Deployment (Vercel)

This project is fully configured to be deployed seamlessly on Vercel.

1. Push this folder to a GitHub repository.
2. Go to Vercel (https://vercel.com/) and Import the repository.
3. Vercel will automatically detect the **Vite** framework.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. 

> Note: The Vite PWA plugin generates the `manifest.json` and service worker automatically during the build process. No extra configuration is needed for production.
