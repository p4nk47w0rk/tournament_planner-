import { useState, useCallback } from "react";
import GuestShareDialog from "@/components/Guest/GuestShareDialog";
import { GuestLinkSectionHeader } from "./GuestLinkSectionHeader";
import { GuestLinkSectionActions } from "./GuestLinkSectionActions";

interface GuestLinkSectionProps {
  slug: string;
  name: string;
}

export default function GuestLinkSection({
  slug,
  name,
}: GuestLinkSectionProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const handleArchive = useArchiveAction(slug, setIsArchiving, setIsArchived);

  return (
    <>
      <div className="mb-10">
        <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6">
          <GuestLinkSectionHeader />
          <GuestLinkSectionActions
            showDialog={showDialog}
            setShowDialog={setShowDialog}
            handleArchive={handleArchive}
            isArchiving={isArchiving}
            isArchived={isArchived}
          />
        </div>
      </div>
      {showDialog && <GuestShareDialog slug={slug} tournamentName={name} />}
    </>
  );
}

function useArchiveAction(
  slug: string,
  setIsArchiving: (v: boolean) => void,
  setIsArchived: (v: boolean) => void
) {
  return useCallback(async () => {
    if (
      !confirm(
        "Turnier archivieren? Die Gast-View zeigt dann die Finale-Zusammenfassung."
      )
    )
      return;
    setIsArchiving(true);
    try {
      const res = await fetch("/api/guest-token/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) setIsArchived(true);
      else if (res.status === 503)
        alert(
          "Archiv-Funktion nicht verfügbar — Migration noch nicht deployed."
        );
    } catch {
      alert("Archivierung fehlgeschlagen.");
    } finally {
      setIsArchiving(false);
    }
  }, [slug, setIsArchiving, setIsArchived]);
}
