# Product decisions

## Guest vs authenticated data flow

Guests use localStorage.

Authenticated users use Supabase.

Guest data syncs once on first login.

Sync flag:
goback_synced_user_id

Repeated automatic sync is out of scope.