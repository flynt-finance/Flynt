"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Connect from "@mono.co/connect.js";
import InvestmentInsightsModal from "@/components/InvestmentInsightsModal";
import { Card } from "@/components/ui";
import { ConnectBankSecureModal, ConfirmModal } from "@/components/modal";
import {
  CategoryCard,
  TransactionItem,
  CreditHealthSection,
  CreateDebtModal,
  AccountBreakdownModal,
  TransactionDetailModal,
  LinkedAccountsCard,
  UnlinkAccountModal,
  DebtDecisionCard,
  TotalAggregatedLiquiditySection,
  type LinkedAccount,
} from "@/components/dashboard";
import { useDebts } from "@/contexts/DebtContext";
import FlyntInsights from "@/components/dashboard/Insights";
import FinancialLeaksSystem from "@/components/dashboard/FinancialLeak";
import {
  useLinkedAccountsQuery,
  useTransactionsQuery,
  useSpendingInsightsQuery,
  LINKED_ACCOUNTS_QUERY_KEY,
  LIQUIDITY_QUERY_KEY,
  TRANSACTIONS_QUERY_KEY,
  SPENDING_INSIGHTS_QUERY_KEY,
  LEAKS_QUERY_KEY,
  linkBankRequest,
  unlinkBankAccountRequest,
} from "@/lib/api/requests";
import type {
  LinkedAccountsApiResponse,
  Transaction,
  TransactionsApiResponse,
  SpendingInsightItem,
  SpendingInsightsApiResponse,
} from "@/lib/api/types";
import {
  ShoppingBag,
  Car,
  Utensils,
  Tv,
  Smile,
  ShieldCheck,
  AlertTriangle,
  CircleDollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNigerianBanks } from "@/lib/banks/nigerian-banks";
import { useAuthStore } from "@/stores/use-auth-store";
import { useGlobalLoader } from "@/contexts/GlobalLoaderContext";
import { showErrorToast } from "@/lib/api/client";

/** Extract last 4 digits from masked account number (e.g. "******3461" -> "3461") */
const getLastFourFromAccountNumber = (accountNumber: string): string => {
  const digits = accountNumber.replace(/\D/g, "");
  if (digits.length >= 4) return digits.slice(-4);
  return accountNumber.slice(-4) || "****";
};

/** Map API spending insight icon name to Lucide component */
const SPENDING_INSIGHT_ICON_MAP: Record<string, LucideIcon> = {
  ShoppingBag,
  Car,
  Utensils,
  Tv,
  Smile,
  ShieldCheck,
  AlertTriangle,
};

const SPENDING_INSIGHT_DEFAULT_ICON = CircleDollarSign;

/** Map API spending insight icon name to CategoryCard color */
const SPENDING_INSIGHT_COLOR_MAP: Record<
  string,
  "blue" | "amber" | "purple" | "cyan" | "orange" | "sky"
> = {
  ShoppingBag: "amber",
  Car: "blue",
  Utensils: "orange",
  Tv: "cyan",
  Smile: "purple",
  ShieldCheck: "sky",
  AlertTriangle: "orange",
};

const SPENDING_INSIGHT_DEFAULT_COLOR:
  | "blue"
  | "amber"
  | "purple"
  | "cyan"
  | "orange"
  | "sky" = "blue";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { showLoader, hideLoader } = useGlobalLoader();
  const { debts, deleteDebt } = useDebts();
  const { data: linkedAccountsResponse, isLoading: isLinkedAccountsLoading } =
    useLinkedAccountsQuery();
  const { getBankLogoUrl } = useNigerianBanks();

  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showConnectBankModal, setShowConnectBankModal] = useState(false);
  const [breakdownModal, setBreakdownModal] = useState<{
    isOpen: boolean;
    title: string;
    data: { name: string; icon: string; amount: number }[];
  }>({ isOpen: false, title: "", data: [] });

  const [selectedAccountForUnlink, setSelectedAccountForUnlink] =
    useState<LinkedAccount | null>(null);
  const [isAccountDetailsModalOpen, setIsAccountDetailsModalOpen] =
    useState(false);
  const [isUnlinkConfirmOpen, setIsUnlinkConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { data: transactionsResponse, isLoading: isTransactionsLoading } =
    useTransactionsQuery({ limit: 15, page: 1 });

  const linkedAccountsDisplay = useMemo((): LinkedAccount[] => {
    const res = linkedAccountsResponse as LinkedAccountsApiResponse | undefined;
    const raw = res?.success && Array.isArray(res?.data) ? res.data : [];
    return raw.map((a) => ({
      id: a.id,
      name: a.bankName || a.institution,
      icon: getBankLogoUrl(a.bankName || a.institution),
      lastFour: getLastFourFromAccountNumber(a.accountNumber),
      balance: a.balance ?? 0,
    }));
  }, [linkedAccountsResponse, getBankLogoUrl]);

  const handleUnlinkConfirm = useCallback(async () => {
    if (!selectedAccountForUnlink) return;
    const id = selectedAccountForUnlink.id;
    showLoader({
      title: "Unlinking account",
      subtitle: "Please wait...",
    });
    try {
      const response = await unlinkBankAccountRequest(id);
      if (response?.success) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [LINKED_ACCOUNTS_QUERY_KEY],
          }),
          queryClient.invalidateQueries({ queryKey: [LIQUIDITY_QUERY_KEY] }),
          queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] }),
          queryClient.invalidateQueries({
            queryKey: [SPENDING_INSIGHTS_QUERY_KEY],
          }),
          queryClient.invalidateQueries({ queryKey: [LEAKS_QUERY_KEY] }),
        ]);
        toast.success("Bank account unlinked successfully");
        setSelectedAccountForUnlink(null);
        setIsUnlinkConfirmOpen(false);
        return;
      }
      showErrorToast(
        new Error(response?.message ?? "Could not unlink account."),
        { title: "Error", message: response?.message ?? "Please try again." },
      );
    } catch (err) {
      showErrorToast(err, {
        title: "Error",
        message: "Could not unlink bank account. Please try again.",
      });
    } finally {
      hideLoader();
    }
  }, [selectedAccountForUnlink, queryClient, showLoader, hideLoader]);

  const handleCloseUnlinkConfirm = useCallback(() => {
    setIsUnlinkConfirmOpen(false);
    setSelectedAccountForUnlink(null);
  }, []);

  const handleCloseAccountDetails = useCallback(() => {
    setIsAccountDetailsModalOpen(false);
    setSelectedAccountForUnlink(null);
  }, []);

  const handleUnlinkClick = useCallback(() => {
    setIsAccountDetailsModalOpen(false);
    setIsUnlinkConfirmOpen(true);
  }, []);

  const handleAddAccountClick = () => {
    setShowConnectBankModal(true);
  };

  const handleConnectConfirm = useCallback(() => {
    setShowConnectBankModal(false);
    const monoPublicKey = process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY?.trim();
    if (!monoPublicKey) {
      showErrorToast(new Error("Mono is not configured."), {
        title: "Configuration error",
        message: "Please try again later or contact support.",
      });
      return;
    }
    const customer = {
      name: user?.name ?? "",
      email: user?.email ?? "",
    };
    const connect = new Connect({
      key: monoPublicKey,
      scope: "auth",
      data: { customer },
      onSuccess: async ({ code }: { code: string }) => {
        showLoader({
          title: "Linking account",
          subtitle: "Please wait...",
        });
        try {
          const response = await linkBankRequest({ monoCode: code });
          if (response?.success) {
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [LINKED_ACCOUNTS_QUERY_KEY],
              }),
              queryClient.invalidateQueries({
                queryKey: [LIQUIDITY_QUERY_KEY],
              }),
              queryClient.invalidateQueries({
                queryKey: [TRANSACTIONS_QUERY_KEY],
              }),
              queryClient.invalidateQueries({
                queryKey: [SPENDING_INSIGHTS_QUERY_KEY],
              }),
              queryClient.invalidateQueries({
                queryKey: [LEAKS_QUERY_KEY],
              }),
            ]);
            toast.success("Bank account linked successfully");
            return;
          }
          showErrorToast(
            new Error(response?.message ?? "Could not link account."),
            {
              title: "Error",
              message: response?.message ?? "Please try again.",
            },
          );
        } catch (err) {
          showErrorToast(err, {
            title: "Connection failed",
            message: "Could not link bank account. Please try again.",
          });
        } finally {
          hideLoader();
        }
      },
      onClose: () => {},
    });
    connect.setup();
    connect.open();
  }, [user?.name, user?.email, queryClient, showLoader, hideLoader]);

  const {
    data: spendingInsightsResponse,
    isLoading: isSpendingInsightsLoading,
  } = useSpendingInsightsQuery();

  const spendingInsightsList = useMemo((): SpendingInsightItem[] => {
    const res = spendingInsightsResponse as
      | SpendingInsightsApiResponse
      | undefined;
    if (!res?.success || !Array.isArray(res?.data)) return [];
    return res.data;
  }, [spendingInsightsResponse]);

  const transactionsRes = transactionsResponse as
    | TransactionsApiResponse
    | undefined;
  const transactionsData =
    transactionsRes?.success && transactionsRes?.data
      ? transactionsRes.data
      : null;
  const recentTransactions = transactionsData?.transactions ?? [];
  const hasRecentTransactions =
    !isTransactionsLoading &&
    Array.isArray(recentTransactions) &&
    recentTransactions.length > 0;
  const isEmptyRecent =
    !isTransactionsLoading &&
    (!transactionsData || recentTransactions.length === 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 pt-8">
      {/* Header & Feature Layer */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Connect Card & Credit Health Stack */}
        <div className="lg:col-span-12 grid gap-6 md:grid-cols-2">
          <button
            onClick={() => setShowConnectBankModal(true)}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-primary/5 border-2 border-dashed border-slate-200 dark:border-white/10 text-text-secondary hover:border-green-primary hover:text-green-primary transition-all group h-32 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center group-hover:bg-green-primary/10 transition-colors shadow-sm">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-base font-bold tracking-tight">
                Connect New Card
              </span>
              <span className="block text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">
                Direct Secure Integration
              </span>
            </div>
          </button>

          <CreditHealthSection />
        </div>

        {/* Intelligence & Liquidity Layer */}
        {/* Left: Total Aggregated Liquidity */}
        <div className="lg:col-span-7">
          <TotalAggregatedLiquiditySection />
        </div>

        {/* Right: Flynt Intelligence Hub */}
        <div className="lg:col-span-5">
          <FlyntInsights onAddDebt={() => setShowDebtModal(true)} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Spending Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Debt Decisions - Intelligence Layer */}
          {debts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-text-secondary uppercase tracking-widest">
                  Debt Intelligence
                </h3>
                {debts.length > 2 && (
                  <Link
                    href="/dashboard/debts"
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-green-primary transition-opacity hover:opacity-80"
                  >
                    See All ({debts.length})
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {debts.slice(0, 2).map((debt) => (
                  <DebtDecisionCard
                    key={debt.id}
                    debt={debt}
                    onPay={deleteDebt}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Spending Breakdown */}
          <div>
            <div className="grid gap-4 md:grid-cols-3">
              {isSpendingInsightsLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border-subtle p-5 animate-pulse"
                    aria-hidden
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-border-subtle" />
                      <div className="h-4 w-12 rounded bg-border-subtle" />
                    </div>
                    <div className="h-4 w-24 rounded bg-border-subtle mb-2" />
                    <div className="h-8 w-20 rounded bg-border-subtle mb-2" />
                    <div className="h-3 w-16 rounded bg-border-subtle" />
                  </div>
                ))}
              {!isSpendingInsightsLoading &&
                spendingInsightsList.length > 0 &&
                spendingInsightsList.map((item) => {
                  const IconComponent =
                    SPENDING_INSIGHT_ICON_MAP[item.ui.icon] ??
                    SPENDING_INSIGHT_DEFAULT_ICON;
                  const color =
                    SPENDING_INSIGHT_COLOR_MAP[item.ui.icon] ??
                    SPENDING_INSIGHT_DEFAULT_COLOR;
                  return (
                    <CategoryCard
                      key={item.label}
                      title={item.label}
                      amount={item.amount}
                      percentage={item.percentage}
                      trend={{
                        value: `${Math.abs(item.trend)}%`,
                        isPositive: item.isIncrease,
                      }}
                      icon={<IconComponent className="h-5 w-5" />}
                      color={color}
                    />
                  );
                })}
              {!isSpendingInsightsLoading &&
                spendingInsightsList.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border-primary bg-bg-elevated py-12 px-4 text-center">
                    <p className="text-sm font-medium text-text-muted">
                      No spending insights for this period.
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Recent Transactions */}
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Recent Transactions
              </h2>
              <Link
                href="/dashboard/transactions"
                className="text-sm font-medium text-green-primary hover:text-green-light"
              >
                See All
              </Link>
            </div>

            {isTransactionsLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-border-subtle animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-border-subtle animate-pulse" />
                        <div className="h-3 w-20 rounded bg-border-subtle animate-pulse" />
                      </div>
                    </div>
                    <div className="h-5 w-16 rounded bg-border-subtle animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {isEmptyRecent && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-primary bg-bg-elevated py-12 px-4 text-center">
                <div className="mb-4 rounded-2xl border border-green-primary/20 bg-green-primary/10 p-4">
                  <svg
                    className="h-12 w-12 text-green-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-base font-bold text-text-primary mb-1">
                  No recent transactions
                </p>
                <p className="text-sm text-text-muted">
                  Transactions will appear here once you have activity.
                </p>
              </div>
            )}

            {hasRecentTransactions && (
              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <TransactionItem
                    key={txn.id}
                    transaction={txn}
                    onClick={() => {
                      setSelectedTransaction(txn);
                    }}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Cards & Insights */}
        <div className="space-y-6">
          {/* Virtual Card */}
          {/* <VirtualCard
            cards={[
              {
                id: "1",
                category: "Discretionary Spending",
                categoryIcon: "🛍️",
                cardNumber: "2342********3675",
                validThru: "12/24",
                cvv: "***",
                cardholderName: "Adebayo Odunsi",
                balance: 57000,
                totalAllocated: 90000,
                spentPercentage: 37,
                colorScheme: "purple",
              },
              {
                id: "2",
                category: "Fixed Obligations",
                categoryIcon: "🏠",
                cardNumber: "4521********7890",
                validThru: "11/25",
                cvv: "***",
                cardholderName: "Adebayo Odunsi",
                balance: 48000,
                totalAllocated: 98000,
                spentPercentage: 51,
                colorScheme: "black",
              },
              {
                id: "3",
                category: "Daily Essentials",
                categoryIcon: "🛒",
                cardNumber: "6789********1234",
                validThru: "03/26",
                cvv: "***",
                cardholderName: "Adebayo Odunsi",
                balance: 42000,
                totalAllocated: 75000,
                spentPercentage: 44,
                colorScheme: "orange",
              },
              {
                id: "4",
                category: "Savings & Investment",
                categoryIcon: "💰",
                cardNumber: "8901********5678",
                validThru: "06/25",
                cvv: "***",
                cardholderName: "Adebayo Odunsi",
                balance: 17000,
                totalAllocated: 17000,
                spentPercentage: 0,
                colorScheme: "green",
              },
              {
                id: "5",
                category: "Lifestyle",
                categoryIcon: "🎭",
                cardNumber: "3456********9012",
                validThru: "09/25",
                cvv: "***",
                cardholderName: "Adebayo Odunsi",
                balance: 30000,
                totalAllocated: 75000,
                spentPercentage: 60,
                colorScheme: "blue",
              },
            ]}
          />

					{/* AI Insights */}

          {/* Financial leakages */}
          <FinancialLeaksSystem />

          {/* Linked Accounts */}
          {isLinkedAccountsLoading ? (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-bg-elevated border border-border-primary">
                  <svg
                    className="w-5 h-5 text-text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-text-primary tracking-tight">
                  Linked Accounts
                </h3>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated border border-border-primary animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-border-subtle" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-border-subtle" />
                    <div className="h-3 w-20 rounded bg-border-subtle" />
                  </div>
                  <div className="h-8 w-24 rounded-full bg-border-subtle" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated border border-border-primary animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-border-subtle" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 rounded bg-border-subtle" />
                    <div className="h-3 w-20 rounded bg-border-subtle" />
                  </div>
                  <div className="h-8 w-24 rounded-full bg-border-subtle" />
                </div>
              </div>
            </Card>
          ) : linkedAccountsDisplay.length === 0 ? (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-bg-elevated border border-border-primary">
                  <svg
                    className="w-5 h-5 text-text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-text-primary tracking-tight">
                  Linked Accounts
                </h3>
              </div>
              <div className="flex flex-col items-center justify-center py-12 px-4 mb-6 rounded-xl bg-bg-elevated border border-dashed border-border-primary text-center">
                <div className="p-4 rounded-2xl bg-green-primary/10 border border-green-primary/20 mb-4">
                  <svg
                    className="w-12 h-12 text-green-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-base font-bold text-text-primary mb-1">
                  No linked accounts yet
                </p>
                <p className="text-sm text-text-muted mb-6 max-w-xs">
                  Connect your bank to see balances and track spending in one
                  place.
                </p>
                <button
                  type="button"
                  onClick={handleAddAccountClick}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-green-primary hover:bg-green-hover transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:ring-offset-2 focus:ring-offset-bg-primary"
                  aria-label="Connect bank account"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Connect bank
                </button>
              </div>
            </Card>
          ) : (
            <LinkedAccountsCard
              accounts={linkedAccountsDisplay}
              onAddAccount={handleAddAccountClick}
              onSelectAccount={(account) => {
                setSelectedAccountForUnlink(account);
                setIsAccountDetailsModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Investment Insights Modal */}
      <InvestmentInsightsModal
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
      />

      {/* Create Debt Modal */}
      <CreateDebtModal
        isOpen={showDebtModal}
        onClose={() => setShowDebtModal(false)}
        financialData={{ surplus: 145000, totalInflow: 450000 }}
      />

      {/* Account Breakdown Modal */}
      <AccountBreakdownModal
        isOpen={breakdownModal.isOpen}
        onClose={() => setBreakdownModal({ ...breakdownModal, isOpen: false })}
        title={breakdownModal.title}
        data={breakdownModal.data}
      />

      {/* Transaction detail modal */}
      <TransactionDetailModal
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />

      {/* Account details modal (view account, then choose to unlink or keep) */}
      <UnlinkAccountModal
        isOpen={isAccountDetailsModalOpen}
        onClose={handleCloseAccountDetails}
        account={selectedAccountForUnlink}
        onUnlinkClick={handleUnlinkClick}
      />

      {/* Unlink account confirmation */}
      <ConfirmModal
        open={isUnlinkConfirmOpen}
        onClose={handleCloseUnlinkConfirm}
        title="Unlink account?"
        subtitle={
          selectedAccountForUnlink
            ? `This will remove ${selectedAccountForUnlink.name} from Flynt. You can link it again later.`
            : ""
        }
        confirmLabel="Unlink account"
        cancelLabel="Cancel"
        onConfirm={handleUnlinkConfirm}
        variant="danger"
      />

      {/* Connect Bank Modal */}
      <ConnectBankSecureModal
        open={showConnectBankModal}
        onClose={() => setShowConnectBankModal(false)}
        onConfirm={handleConnectConfirm}
        primaryButtonText="Connect"
      />
    </div>
  );
}
