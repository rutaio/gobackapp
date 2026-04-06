## Guest vs authenticated data flow

Guests use localStorage.

Authenticated users use Supabase.

Guest data syncs once on first login.

Sync flag:
goback_synced_user_id

Repeated automatic sync is out of scope.

## Thread selection after refresh

For authenticated users:

- the app selects the thread with the most recent checkin
- if no checkins exist, the first active thread is selected

Notes:
- newly created empty threads are not selected after refresh
- this is intentional to avoid landing on empty state