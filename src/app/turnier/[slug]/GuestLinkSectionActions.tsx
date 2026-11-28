interface GuestLinkSectionActionsProps {
  showDialog: boolean;
  setShowDialog: (v: boolean) => void;
  handleArchive: () => Promise<void>;
  isArchiving: boolean;
  isArchived: boolean;
}

export function GuestLinkSectionActions({
  showDialog,
  setShowDialog,
  handleArchive,
  isArchiving,
  isArchived,
}: GuestLinkSectionActionsProps) {
  return (
    <>
      <p className="text-sm text-slate-stone dark:text-dark-text-secondary mb-4">
        Erstelle einen QR-Code und einen öffentlichen Link, mit dem Gäste den
        Spielplan, Live-Ergebnisse und Tabellenstände in Echtzeit sehen können.
      </p>
      <div className="flex flex-wrap gap-3">
        <CreateDialogButton
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
        {!isArchived && (
          <ArchiveButton
            handleArchive={handleArchive}
            isArchiving={isArchiving}
          />
        )}
      </div>
      {isArchived && <ArchivedBanner />}
    </>
  );
}

function CreateDialogButton({
  showDialog,
  setShowDialog,
}: {
  showDialog: boolean;
  setShowDialog: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setShowDialog(true)}
      className="px-4 py-2 rounded-xl bg-sage text-white font-medium text-sm hover:bg-sage/90 active:bg-sage/80 dark:bg-dark-primary dark:hover:bg-dark-primary/90 dark:active:bg-dark-primary/80 transition-colors duration-200"
    >
      Gast-Link &amp; QR-Code erstellen
    </button>
  );
}

function ArchiveButton({
  handleArchive,
  isArchiving,
}: {
  handleArchive: () => Promise<void>;
  isArchiving: boolean;
}) {
  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={isArchiving}
      className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 disabled:opacity-50"
    >
      {isArchiving ? "Archiviere..." : "Turnier archivieren"}
    </button>
  );
}

function ArchivedBanner() {
  return (
    <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
      ⚠️ Turnier wurde archiviert. Die Gast-View zeigt die
      Finale-Zusammenfassung.
    </p>
  );
}
