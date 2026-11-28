import QRCode from "react-qr-code";

interface ShareDialogContentProps {
  token: string | null;
  guestUrl: string | null;
  loading: boolean;
  error: string | null;
  tournamentName: string;
  onShare: () => void;
  onCreate: () => void;
  onClose: () => void;
}

export function GuestShareDialogContent({
  token,
  guestUrl,
  loading,
  error,
  tournamentName,
  onShare,
  onCreate,
  onClose,
}: ShareDialogContentProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Gast-Link & QR-Code"
    >
      <div className="bg-paper dark:bg-dark-surface rounded-2xl shadow-xl max-w-sm w-full p-6">
        <DialogHeader title="Gast-Link &amp; QR-Code" onClose={onClose} />
        {guestUrl && <QrSection url={guestUrl} />}
        {error && <ErrorBanner text={error} />}
        <Actions
          guestUrl={guestUrl}
          loading={loading}
          onShare={onShare}
          onCreate={onCreate}
          tournamentName={tournamentName}
        />
      </div>
    </div>
  );
}

function DialogHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-slate-ink dark:text-dark-text">
        {title}
      </h3>
      <CloseButton onClose={onClose} />
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-dark-surface/50 text-slate-stone"
      aria-label="Schließen"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}

function QrSection({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="bg-white p-4 rounded-xl">
        <QRCode
          value={window.location.origin + url}
          size={200}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
      <p className="text-xs text-slate-stone mt-3 text-center break-all">
        {window.location.origin + url}
      </p>
    </div>
  );
}

function ErrorBanner({ text }: { text: string }) {
  return (
    <p className="text-sm text-red-600 dark:text-red-400 mb-3 text-center">
      {text}
    </p>
  );
}

function Actions({
  guestUrl,
  loading,
  onShare,
  onCreate,
  tournamentName,
}: {
  guestUrl: string | null;
  loading: boolean;
  onShare: () => void;
  onCreate: () => void;
  tournamentName: string;
}) {
  return (
    <div className="space-y-3">
      {guestUrl && (
        <>
          <button
            type="button"
            onClick={onShare}
            className="w-full py-3 px-4 rounded-xl bg-sage text-white font-medium text-sm hover:bg-sage/90 active:bg-sage/80 dark:bg-dark-primary dark:hover:bg-dark-primary/90 dark:active:bg-dark-primary/80 transition-colors duration-200"
          >
            Share Link
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="w-full py-3 px-4 rounded-xl border border-slate-hairline dark:border-dark-border text-slate-ink dark:text-dark-text font-medium text-sm hover:bg-slate-50 dark:hover:bg-dark-surface/50 transition-colors duration-200"
          >
            Neuen Link erstellen
          </button>
        </>
      )}
      {!guestUrl && !loading && (
        <button
          type="button"
          onClick={onCreate}
          className="w-full py-3 px-4 rounded-xl bg-sage text-white font-medium text-sm hover:bg-sage/90 active:bg-sage/80 dark:bg-dark-primary dark:hover:bg-dark-primary/90 dark:active:bg-dark-primary/80 transition-colors duration-200 disabled:opacity-50"
        >
          Gast-Link &amp; QR-Code erstellen
        </button>
      )}
      {loading && (
        <div className="flex items-center justify-center py-3">
          <div className="w-5 h-5 border-2 border-sage border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
