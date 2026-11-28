"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useActivationRequests } from "./useActivationRequests";
import PendingList from "./PendingList";
import StatusList from "./StatusList";

export default function ActivationRequestsPage() {
  const t = useTranslations("admin");
  const { requests, loading, actionLoading, message, handleAction } =
    useActivationRequests();

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
      <MessageBanner message={message} />
      <PendingList
        pending={pending}
        actionLoading={actionLoading}
        onAction={(id, email) => handleAction(id, email, "approve")}
        onReject={(id, email) => handleAction(id, email, "reject")}
        t={t}
      />
      <StatusList
        items={approved}
        color="green"
        label={t("approved")}
        statusText="✓ Genehmigt"
        t={t}
      />
      <StatusList
        items={rejected}
        color="red"
        label={t("rejected")}
        statusText="✗ Abgelehnt"
        t={t}
      />
    </div>
  );
}

function MessageBanner({
  message,
}: {
  message: { type: "success" | "error"; text: string } | null;
}) {
  if (!message) return null;
  return (
    <div
      className={`p-4 rounded-xl text-sm ${
        message.type === "success"
          ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
      }`}
    >
      {message.text}
    </div>
  );
}
