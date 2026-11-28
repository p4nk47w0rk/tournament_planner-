import Link from "next/link";

export default function SuccessView({ t }: { t: (k: string) => string }) {
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
