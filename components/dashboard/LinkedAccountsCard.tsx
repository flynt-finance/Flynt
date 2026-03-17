"use client";

import { Card, Button } from "@/components/ui";
import Image from "next/image";

export interface LinkedAccount {
  id: string;
  name: string;
  icon: string;
  lastFour: string;
  balance: number;
}

interface LinkedAccountsCardProps {
  accounts: LinkedAccount[];
  onAddAccount: () => void;
  onSelectAccount: (account: LinkedAccount) => void;
}

export default function LinkedAccountsCard({
  accounts,
  onAddAccount,
  onSelectAccount,
}: LinkedAccountsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-bg-elevated border border-border-primary">
          <svg
            className="w-5 h-5 text-text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
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
        {accounts.map((account) => (
          <div
            key={account.id}
            onClick={() => onSelectAccount(account)}
            className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-primary hover:border-green-primary/30 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-primary/10 flex items-center justify-center border border-green-primary/20 group-hover:scale-105 transition-transform">
                {/* Fallback to simple icon if image fails */}
                <div className="p-2 rounded-lg text-white">
                  <Image
                    src={account.icon}
                    alt={account.name}
                    width={24}
                    height={24}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">
                  {account.name}
                </p>
                <p className="text-xs text-text-secondary font-medium tracking-widest">
                  ****{account.lastFour}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-bg-secondary px-3 py-1 rounded-full border border-border-primary">
                <p className="text-sm font-bold text-text-primary">
                  ₦{account.balance.toLocaleString()}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={onAddAccount}
        className="py-3 rounded-xl bg-transparent border-dashed border-2 border-border-primary hover:border-green-primary hover:bg-green-primary/5 text-text-secondary hover:text-green-primary flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="font-bold">Add New Account</span>
      </Button>
    </Card>
  );
}
