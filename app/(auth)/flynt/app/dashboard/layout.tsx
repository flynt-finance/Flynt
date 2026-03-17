"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import SyncAnimation from "../../components/SyncAnimation"; // Import the SyncAnimation component
import useSync from "../../hooks/useSync";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSyncing } = useSync();

  const handleLogout = () => {
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "home" },
    {
      href: "/dashboard/transactions",
      label: "Transactions",
      icon: "transactions",
    },
    { href: "/dashboard/budget", label: "Budget", icon: "budget" },
    { href: "/dashboard/debts", label: "Debts", icon: "debts" },
    { href: "/dashboard/cards", label: "Cards", icon: "cards" },
    { href: "/dashboard/insights", label: "Insights", icon: "insights" },
  ];

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border-primary bg-bg-secondary shadow-sm">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-border-primary">
            <Link
              href="/"
              className="flex items-center gap-2 uppercase font-extrabold tracking-wider"
            >
              FLYNT
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-primary/10 text-green-primary"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  }`}
                >
                  {/* Icons omitted for brevity */}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-border-primary p-4">
            <div className="flex items-center gap-3 rounded-lg bg-bg-elevated p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-primary text-sm font-semibold text-white">
                AO
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  Adebayo Odunsi
                </p>
                <p className="text-xs text-text-muted truncate">
                  odunsi@example.com
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-border-primary p-3">
            <button
              type="button"
              onClick={handleLogout}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLogout();
                }
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2 focus:ring-offset-bg-secondary cursor-pointer"
              aria-label="Log out"
            >
              {/* Logout icon omitted for brevity */}
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-border-primary bg-white/80 dark:bg-bg-secondary/80 backdrop-blur-xl shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <p className="text-sm text-text-secondary font-bold">
                Hello{" "}
                <span className="uppercase text-[#4AD9A3]">
                  Adebayo Odunsi,
                </span>{" "}
                welcome back to <span className="text-[#4AD9A3]">Flynt</span> 👋
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {/* Other buttons omitted for brevity */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {isSyncing && <SyncAnimation />}{" "}
          {/* Show syncing animation if syncing */}
          {children}
        </main>
      </div>
    </div>
  );
}
