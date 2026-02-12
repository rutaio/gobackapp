# Go Back App

A solo strategy tool for creators who operate in uncertainty, juggle multiple projects and struggle with too many parallel ideas.

You create Threads (your work areas),
log small checkins,
and when you return, you see context before you act.

Return → Remember → Continue.

## Tech Stack

- Frontend: React + TypeScript + Pico CSS
- Testing: Playwright (basic MVP flow coverage)
- Backend: Supabase (planned for Phase 2)
- Hosting: Vercel

## MVP (Phase 1)

Core flow:

- Threads render
- Selecting a thread shows its checkins
- Adding a checkin persists to localStorage
- Last touched thread is restored on refresh

## Up Next (Phase 2)

- Clearer onboarding and framing
- Thread ownership (create / archive)
- Supabase persistence
