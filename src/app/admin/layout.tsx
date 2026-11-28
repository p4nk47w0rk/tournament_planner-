"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/supabase/hooks";
import { useEffect } from "react";
import AdminHeader from "./AdminHeader";

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

  if (!isSuperAdmin) return null;

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg">
      <AdminHeader />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
