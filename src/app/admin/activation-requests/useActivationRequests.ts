import { useState, useEffect, useCallback } from "react";

interface ActivationRequest {
  id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export function useActivationRequests() {
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

  const handleAction = useCallback(
    async (id: string, _email: string, action: "approve" | "reject") => {
      setActionLoading(id);
      setMessage(null);
      try {
        const endpoint =
          action === "approve"
            ? "/api/admin/activation-requests/approve"
            : "/api/admin/activation-requests/reject";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        const email = requests.find((r) => r.id === id)?.email ?? "";
        setMessage({
          type: "success",
          text:
            action === "approve"
              ? `Anfrage für ${email} genehmigt — Magic-Link gesendet!`
              : `Anfrage für ${email} abgelehnt.`,
        });
        await fetchRequests();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Fehler";
        setMessage({ type: "error", text: msg });
      } finally {
        setActionLoading(null);
      }
    },
    [fetchRequests, requests]
  );

  return {
    requests,
    loading,
    actionLoading,
    message,
    handleAction,
    fetchRequests,
  };
}

export type { ActivationRequest };
