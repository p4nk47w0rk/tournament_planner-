"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "../Shared/ThemeToggle";
import LocaleSwitcher from "../Shared/LocaleSwitcher";
import { useAuth } from "@/lib/supabase/hooks";
import { TPIcon } from "../Shared/BrandSVGs";
import { isLocalDevAuth } from "@/lib/supabase/client";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Measure scrollbar width and reserve space for consistent layout across pages
  useEffect(() => {
    const outer = document.createElement("div");
    Object.assign(outer.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      visibility: "hidden",
      pointerEvents: "none",
      zIndex: "-1",
    });
    const inner = document.createElement("div");
    Object.assign(inner.style, { width: "100%", height: "200vh" });
    outer.appendChild(inner);
    document.body.appendChild(outer);

    const without = inner.offsetWidth;
    outer.style.overflowY = "scroll";
    const with_ = inner.offsetWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-gutter",
      `${without - with_}px`
    );

    document.body.removeChild(outer);
  }, []);

  // Load edit mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("edit-mode");
    if (stored === "true") setEditMode(true);
  }, []);

  const toggleEditMode = () => {
    const newState = !editMode;
    setEditMode(newState);
    localStorage.setItem("edit-mode", String(newState));
  };

  const handleLogout = async () => {
    await signOut();
    setEditMode(false);
    localStorage.removeItem("edit-mode");
  };

  return (
    <nav className="navbar sticky top-0 z-40 bg-paper shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3">
            <TPIcon className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-base tracking-tight text-slate-ink text-slate-ink hidden sm:block">
              TOURNAMENT PLANNER
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            <NavItem href="/" label="Home" />
            <NavItem href="/turniere" label="Meine Turniere" />
            <NavItem href="/neues-turnier" label="Neues Turnier" />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <AuthSection
              isLoading={isLoading}
              isAuthenticated={isAuthenticated}
              user={user}
              editMode={editMode}
              toggleEditMode={toggleEditMode}
              handleLogout={handleLogout}
              isLocalDev={isLocalDevAuth()}
            />
            <LocaleSwitcher />
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <MenuIcon open={mobileMenuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <MobileMenu />}
      </div>
    </nav>
  );
}

// ============================================
// Sub-components (reduce parent complexity)
// ============================================

function AuthSection({
  isLoading,
  isAuthenticated,
  user,
  editMode,
  toggleEditMode,
  handleLogout,
  isLocalDev,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: unknown;
  editMode: boolean;
  toggleEditMode: () => void;
  handleLogout: () => Promise<void>;
  isLocalDev: boolean;
}) {
  if (isLoading) {
    return (
      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    );
  }

  if (isAuthenticated && user) {
    return (
      <>
        <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          Admin
        </span>
        <button
          onClick={toggleEditMode}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            editMode
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
          title={editMode ? "Edit-Mode: AN" : "Edit-Mode: AUS"}
        >
          {editMode ? "✏️ Edit" : "👁 View"}
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Logout
        </button>
      </>
    );
  }

  // Local dev login link
  if (isLocalDev) {
    return (
      <Link
        href="/?dev=login"
        className="px-4 py-2 rounded-lg text-sm font-medium bg-[#D97757] text-white hover:bg-[#c46649] transition-colors"
      >
        Login
      </Link>
    );
  }

  return (
    <a
      href="/login"
      className="px-4 py-2 rounded-lg text-sm font-medium bg-[#D97757] text-white hover:bg-[#c46649] transition-colors"
    >
      Login
    </a>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  const d = open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16";

  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={d}
      />
    </svg>
  );
}

function MobileMenu() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="md:hidden pb-4">
      <div className="flex flex-col gap-1">
        <NavItem href="/" label="Home" mobile active={isActive("/")} />
        <NavItem
          href="/turniere"
          label="Meine Turniere"
          mobile
          active={isActive("/turniere")}
        />
        <NavItem
          href="/neues-turnier"
          label="Neues Turnier"
          mobile
          active={isActive("/neues-turnier")}
        />
      </div>
    </div>
  );
}

function NavItem({
  href,
  label,
  mobile = false,
  active,
}: {
  href: string;
  label: string;
  mobile?: boolean;
  active?: boolean;
}) {
  const pathname = usePathname();
  const isCurrent = active ?? pathname === href;
  const baseClass = mobile
    ? "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
    : "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200";

  return (
    <Link
      href={href}
      className={`${baseClass} ${
        isCurrent
          ? "bg-[#3B5E4D] text-white"
          : "text-slate-stone hover:text-slate-ink text-slate-stone dark:hover:text-dark-text hover:bg-sage-mist/50 dark:hover:bg-muted"
      }`}
    >
      {label}
    </Link>
  );
}
