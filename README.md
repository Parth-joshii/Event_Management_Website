# Shree Velora Event's Platform

Enterprise foundation for a luxury event management platform built with Next.js
15, React 19, TypeScript, Tailwind CSS, Shadcn UI conventions, Framer Motion,
GSAP, Lenis, TanStack Query, Zustand-ready architecture, React Hook Form, and
Zod.

This phase intentionally contains platform infrastructure only. Marketing pages,
dashboards, booking flows, forms, galleries, and business workflows are reserved
for the next build phase.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run format` formats the workspace with Prettier.

## Architecture

The project uses feature-based architecture. Each feature owns its components,
hooks, types, services, API handlers, validation, utilities, and constants.
