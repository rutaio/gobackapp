## Guest vs authenticated data flow

Guests store data in localStorage.
Authenticated users store data in Supabase.

Guest data syncs once on first login, only if the account has no existing threads.
If the account already contains threads, guest data is not imported again to prevent duplicates.

Sync flag:
goback_synced_user_id

Notes:
- Supabase data is the source of truth for determining whether sync should occur (not localStorage)
- prevents duplicate data across devices
- repeated automatic sync is out of scope
- after initial sync, guest mode is treated as a local-only demo and is not merged again

## Thread selection after refresh

For authenticated users:
- the app selects the thread with the most recent checkin
- if no checkins exist, the first active thread is selected

Notes:
- newly created empty threads are not selected after refresh
- this is intentional to avoid landing on empty state