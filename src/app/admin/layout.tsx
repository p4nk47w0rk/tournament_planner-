"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/supabase/hooks";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSuperAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isSuperAdmin) {
      window.location.href = "/login";
    }
  }, [isSuperAdmin, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-stone dark:text-dark-text-secondary">
            Laden...
          </p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg">
      {/* Admin Header */}
      <div className="bg-paper dark:bg-dark-bg border-b border-slate-hairline dark:border-dark-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-sage/10 dark:bg-dark-primary/20 flex items-center justify-center text-sage dark:text-dark-primary">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.342.196.74.272 1.13.272h1.348c.55 0 1.02.398 1.11.94"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-ink dark:text-dark-text">
                  Admin-Dashboard
                </h1>
              </div>
              <p className="text-sm text-slate-stone dark:text-dark-text-secondary">
                Aktivierungsanfragen verwalten
              </p>
            </div>
            <a
              href="/"
              className="text-sm text-slate-stone hover:text-sage dark:hover:text-dark-primary inline-flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Zurück
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
