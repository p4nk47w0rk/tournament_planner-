"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function RequestActivationPage() {
  const t = useTranslations("auth.requestActivation");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/request-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Senden der Email");
      }

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ein unerwarteter Fehler ist aufgetreten";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-ink dark:text-dark-text mb-2">
          {t("successTitle")}
        </h2>
        <p className="text-slate-stone dark:text-dark-text-secondary mb-6">
          {t("successMessage")}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-sage dark:text-dark-primary hover:underline font-medium"
        >
          {t("successBackToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h2 className="text-xl font-bold text-slate-ink dark:text-dark-text mb-2">
        {t("title")}
      </h2>
      <p className="text-slate-stone dark:text-dark-text-secondary mb-6">
        {t("subtitle")}
      </p>

      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-slate-ink dark:text-dark-text">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("emailPlaceholder")}
            className="w-full px-4 py-3 border border-slate-300 dark:border-dark-border rounded-xl text-sm bg-paper dark:bg-dark-bg text-slate-ink dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-sage dark:focus:ring-dark-primary focus:border-transparent transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sage dark:bg-dark-primary text-white rounded-xl font-medium hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="text-center mt-6">
        <Link
          href="/login"
          className="text-sm text-sage dark:text-dark-primary hover:underline font-medium"
        >
          {t("backToLogin")}
        </Link>
      </p>
    </div>
  );
}
