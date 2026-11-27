"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "../Shared/ThemeToggle";
import LocaleSwitcher from "../Shared/LocaleSwitcher";
import { useAuth } from "@/lib/supabase/hooks";
import { useEditMode } from "@/lib/edit-mode-context";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { editable, toggle: toggleEditMode } = useEditMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("edit-mode");
  };

  return (
    <nav className="navbar sticky top-0 z-40 bg-white dark:bg-dark-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D97757] flex items-center justify-center text-white text-sm font-bold font-mono">
              TP
            </div>
            <span className="font-bold text-base tracking-tight text-slate-ink dark:text-dark-text hidden sm:block">
              TOURNAMENT PLANNER
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            <NavItem href="/" label="Home" />
            <NavItem href="/spielplan" label="Spielplan" />
            <NavItem href="/gruppen" label="Gruppen" />
            <NavItem href="/teams" label="Teams" />
            <NavItem href="/infos" label="Infos" />
          </div>

          {/* Right side: Auth + Locale + Theme */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  Admin
                </span>
                <button
                  onClick={toggleEditMode}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    editable
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  title={editable ? "Edit-Mode: AN" : "Edit-Mode: AUS"}
                >
                  {editable ? "✏️ Edit" : "👁 View"}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#D97757] text-white hover:bg-[#c46649] transition-colors"
              >
                Login
              </a>
            )}

            <LocaleSwitcher />
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-1">
              <NavItem href="/" label="Home" mobile />
              <NavItem href="/spielplan" label="Spielplan" mobile />
              <NavItem href="/gruppen" label="Gruppen" mobile />
              <NavItem href="/teams" label="Teams" mobile />
              <NavItem href="/infos" label="Infos" mobile />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  mobile = false,
}: {
  href: string;
  label: string;
  mobile?: boolean;
}) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const isActive = pathname === href;
  const baseClass = mobile
    ? "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
    : "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200";

  return (
    <a
      href={href}
      className={`${baseClass} ${
        isActive
          ? "bg-[#3B5E4D] text-white"
          : "text-slate-stone hover:text-slate-ink dark:text-dark-text-secondary dark:hover:text-dark-text hover:bg-sage-mist/50 dark:hover:bg-dark-border"
      }`}
    >
      {label}
    </a>
  );
}
