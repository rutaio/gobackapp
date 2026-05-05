# GoBack Deployment Diagram

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