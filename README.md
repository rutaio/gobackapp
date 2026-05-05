# Go Back App

A solo strategy tool for creators who operate in uncertainty, juggle multiple projects and struggle with too many parallel ideas.

Name your work areas (Threads),
Log small progress steps (Checkins),
After a break, resume your work easily by seeing context on where you left off.

Return → Remember → Continue.

## Tech Stack

- Frontend: React + TypeScript + Pico CSS
- Testing: Playwright (basic MVP flow coverage)
- Backend: Supabase
- Authentication via Google OAuth
- Hosting: Vercel

## Architecture Overview

```mermaid
flowchart LR
  user[User]

  subgraph device[User Device]
    browser[Web Browser]
    app[GoBack Frontend<br/>React + TypeScript]
    local[(localStorage<br/>guest data)]
  end

  subgraph vercel[Vercel]
    hosting[Static frontend hosting]
  end

  subgraph supabase[Supabase]
    auth[Supabase Auth<br/>login + session]
    db[(Postgres DB<br/>threads + checkins)]
  end

  google[Google OAuth Provider]

  user --> browser

  browser -->|requests app| hosting
  hosting -->|serves frontend assets| browser
  browser -->|runs| app

  app -->|guest mode| local
  app -->|login / session| auth
  app -->|threads + checkins data| db

  auth -->|redirects to Google| google
  google -->|redirects back with session| browser
  ```

## Next Phases

### Product & UX
- Improve onboarding experience (first-time user clarity)
- Strengthen continuity UX (help users easily return to context)
- Develop brand identity for the app

### Privacy & Security
- Introduce application-level encryption for user data

### Monetization & Product Model
- Integrate Stripe for payments
- Explore feature gating (free vs paid tiers)
- Move toward an open-core model (public + private features)