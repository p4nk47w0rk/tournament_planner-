import Link from "next/link";

interface ActivationFormProps {
  t: (k: string) => string;
  email: string;
  onEmailChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ActivationForm({
  t,
  email,
  onEmailChange,
  loading,
  error,
  onSubmit,
}: ActivationFormProps) {
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

      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-slate-ink dark:text-dark-text">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
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
