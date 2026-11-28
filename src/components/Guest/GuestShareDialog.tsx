/**
 * GuestShareDialog — QR-Code & Share Dialog
 */

"use client";

import { GuestShareDialogContent } from "./ShareDialogContent";
import { useGuestToken } from "./useGuestToken";

interface GuestShareDialogProps {
  slug: string;
  tournamentName: string;
}

export default function GuestShareDialog({
  slug,
  tournamentName,
}: GuestShareDialogProps) {
  const {
    token,
    loading,
    error,
    guestUrl,
    handleCreate,
    handleShare,
    handleClose,
  } = useGuestToken(slug);

  return (
    <GuestShareDialogContent
      token={token}
      guestUrl={guestUrl}
      loading={loading}
      error={error}
      tournamentName={tournamentName}
      onShare={handleShare}
      onCreate={handleCreate}
      onClose={handleClose}
    />
  );
}
