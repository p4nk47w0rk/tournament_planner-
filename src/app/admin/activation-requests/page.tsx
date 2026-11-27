"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

interface ActivationRequest {
  id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function ActivationRequestsPage() {
  const t = useTranslations("admin");
  const [requests, setRequests] = useState<ActivationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/activation-requests");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id: string, email: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/activation-requests/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessage({
        type: "success",
        text: `Anfrage für ${email} genehmigt — Magic-Link gesendet!`,
      });
      await fetchRequests();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Fehler";
      setMessage({ type: "error", text: msg });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string, email: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/activation-requests/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessage({ type: "success", text: `Anfrage für ${email} abgelehnt.` });
      await fetchRequests();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Fehler";
      setMessage({ type: "error", text: msg });
    } finally {
      setActionLoading(null);
    }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const rejected = requests.filter((r) => r.status === "rejected");

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-stone dark:text-dark-text-secondary">
          {t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Pending */}
      <section>
        <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          {t("pending")} ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="text-center py-8 bg-paper dark:bg-dark-bg border border-slate-hairline dark:border-dark-border rounded-2xl">
            <p className="text-slate-stone dark:text-dark-text-secondary">
              {t("noPending")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map((req) => (
              <div
                key={req.id}
                className="bg-paper dark:bg-dark-bg border border-slate-hairline dark:border-dark-border rounded-xl p-4 flex items-center justify-between gap-4"
              >
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
                    onClick={() => handleReject(req.id, req.email)}
                    disabled={actionLoading === req.id}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === req.id ? "..." : t("reject")}
                  </button>
                  <button
                    onClick={() => handleApprove(req.id, req.email)}
                    disabled={actionLoading === req.id}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-sage dark:bg-dark-primary hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === req.id ? "..." : "✓ " + t("approve")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved */}
      {approved.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            {t("approved")} ({approved.length})
          </h2>
          <div className="space-y-2">
            {approved.map((req) => (
              <div
                key={req.id}
                className="bg-paper dark:bg-dark-bg border border-slate-hairline dark:border-dark-border rounded-xl p-4 flex items-center justify-between opacity-60"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-ink dark:text-dark-text truncate">
                    {req.email}
                  </p>
                  <p className="text-xs text-slate-stone dark:text-dark-text-secondary mt-0.5">
                    {new Date(req.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium shrink-0">
                  ✓ Genehmigt
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            {t("rejected")} ({rejected.length})
          </h2>
          <div className="space-y-2">
            {rejected.map((req) => (
              <div
                key={req.id}
                className="bg-paper dark:bg-dark-bg border border-slate-hairline dark:border-dark-border rounded-xl p-4 flex items-center justify-between opacity-60"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-ink dark:text-dark-text truncate">
                    {req.email}
                  </p>
                  <p className="text-xs text-slate-stone dark:text-dark-text-secondary mt-0.5">
                    {new Date(req.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-xs text-red-600 dark:text-red-400 font-medium shrink-0">
                  ✗ Abgelehnt
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
