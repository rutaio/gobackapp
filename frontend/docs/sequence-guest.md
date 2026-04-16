# GoBack Guest Sequence Diagram

```mermaid
sequenceDiagram
  actor User
  participant Browser
  participant Vercel
  participant App as GoBack Frontend
  participant Local as localStorage

  User->>Browser: Open app
  Browser->>Vercel: Request frontend
  Vercel-->>Browser: Return frontend assets
  Browser->>App: Run app

  App->>Local: Load threads + checkins
  Local-->>App: Return guest data

  User->>App: Add / edit activity or step
  App->>Local: Save updated guest data
  Local-->>App: Confirm saved
  ```