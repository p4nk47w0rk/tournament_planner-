/**
 * Guest View Client Component — T04
 *
 * Client-Side mit Supabase Realtime Subscriptions.
 * Wird in T04 implementiert.
 */

export default function GuestViewClient({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  return (
    <div data-test="guest-view-placeholder">
      <p>Loading guest view...</p>
    </div>
  );
}
