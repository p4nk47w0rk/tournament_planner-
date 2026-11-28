interface ActivationRequest {
  id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface PendingListProps {
  pending: ActivationRequest[];
  actionLoading: string | null;
  onAction: (id: string, email: string) => void;
  onReject: (id: string, email: string) => void;
  t: (k: string) => string;
}

export default function PendingList({
  pending,
  actionLoading,
  onAction,
  onReject,
  t,
}: PendingListProps) {
  if (pending.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          {t("pending")} (0)
        </h2>
        <div className="text-center py-8 bg-paper dark:bg-dark-bg border border-slate-hairline dark:border-dark-border rounded-2xl">
          <p className="text-slate-stone dark:text-dark-text-secondary">
            {t("noPending")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        {t("pending")} ({pending.length})
      </h2>
      <div className="space-y-2">
        {pending.map((req) => (
          <ActivationRow
            key={req.id}
            req={req}
            actionLoading={actionLoading === req.id}
            onApprove={() => onAction(req.id, req.email)}
            onReject={() => onReject(req.id, req.email)}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}

function ActivationRow({
  req,
  actionLoading,
  onApprove,
  onReject,
  t,
}: {
  req: ActivationRequest;
  actionLoading: boolean;
  onApprove: () => void;
  onReject: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="bg-paper dark:bg-dark-bg border border-slate-hairline dark:border-dark-border rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-ink dark:text-dark-text truncate">
          {req.email}
        </p>
        <p className="text-xs text-slate-stone dark:text-dark-text-secondary mt-0.5">
          {new Date(req.created_at).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onReject}
          disabled={actionLoading}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
        >
          {actionLoading ? "..." : t("reject")}
        </button>
        <button
          onClick={onApprove}
          disabled={actionLoading}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-sage dark:bg-dark-primary hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {actionLoading ? "..." : "✓ " + t("approve")}
        </button>
      </div>
    </div>
  );
}
