"use client";

import { useState } from "react";
import Link from "next/link";

export default function CardsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const cards = [
    {
      id: 1,
      name: "Primary Card",
      type: "Discretionary",
      lastFour: "4242",
      allocated: 90000,
      spent: 33000,
      status: "active",
      color: "from-green-dark to-green-secondary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Virtual Cards</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your budget-enforced cards</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-green-primary px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-green-light"
        >
          + Create Card
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-bg-card border border-white/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Active Cards</span>
            <svg className="h-5 w-5 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-text-primary">1</div>
          <p className="text-xs text-text-muted mt-1">Out of 5 available</p>
        </div>

        <div className="rounded-xl bg-bg-card border border-white/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Total Allocated</span>
            <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-text-primary">₦90,000</div>
          <p className="text-xs text-text-muted mt-1">Across all cards</p>
        </div>

        <div className="rounded-xl bg-bg-card border border-white/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Total Spent</span>
            <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-text-primary">₦33,000</div>
          <p className="text-xs text-text-muted mt-1">37% of allocated</p>
        </div>

        <div className="rounded-xl bg-bg-card border border-white/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Remaining</span>
            <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-text-primary">₦57,000</div>
          <p className="text-xs text-success mt-1">Available to spend</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {cards.map((card) => (
          <div key={card.id} className="space-y-4">
            {/* Card Visual */}
            <div className={`rounded-xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl`}>
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{card.name}</p>
                  <p className="mt-1 text-xs opacity-80">{card.type} Spending</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-light/20 px-3 py-1 text-xs font-semibold capitalize">
                    {card.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs opacity-80 mb-1">Available Balance</p>
                <p className="text-3xl font-bold">₦{(card.allocated - card.spent).toLocaleString()}</p>
                <p className="text-xs opacity-60 mt-1">of ₦{card.allocated.toLocaleString()} allocated</p>
              </div>

              <div className="mb-6">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="opacity-80">Spent this month</span>
                  <span className="font-semibold">{Math.round((card.spent / card.allocated) * 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/20">
                  <div 
                    className="h-full rounded-full bg-green-light" 
                    style={{ width: `${(card.spent / card.allocated) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-60 mb-1">Card Number</p>
                  <p className="font-mono text-lg tracking-wider">•••• •••• •••• {card.lastFour}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-60 mb-1">Expires</p>
                  <p className="text-sm font-medium">12/28</p>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="rounded-xl bg-bg-card border border-white/5 p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Card Controls</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-primary/10">
                      <svg className="h-5 w-5 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Card Active</p>
                      <p className="text-xs text-text-muted">Can be used for transactions</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-primary">
                    <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10">
                      <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Online Purchases</p>
                      <p className="text-xs text-text-muted">E-commerce transactions</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-primary">
                    <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple/10">
                      <svg className="h-5 w-5 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">International</p>
                      <p className="text-xs text-text-muted">Foreign transactions</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-bg-elevated">
                    <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition"></span>
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-lg bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated/80">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg bg-error/10 px-4 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/20">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Freeze Card
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl bg-bg-card border border-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary">Recent Transactions</h3>
                <Link href="/dashboard/transactions" className="text-xs font-medium text-green-primary hover:text-green-light">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { merchant: "Uber Eats", amount: -5000, date: "Jan 28", icon: "🍔" },
                  { merchant: "Netflix", amount: -3000, date: "Jan 22", icon: "🎬" },
                  { merchant: "Spotify", amount: -2500, date: "Jan 21", icon: "🎵" },
                ].map((txn, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-elevated transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated text-sm">
                        {txn.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{txn.merchant}</p>
                        <p className="text-xs text-text-muted">{txn.date}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-error">-₦{Math.abs(txn.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Create New Card Placeholder */}
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 p-12 text-center transition-colors hover:border-green-primary/50 hover:bg-green-primary/5"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-primary/10 mb-4">
            <svg className="h-8 w-8 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Create New Card</h3>
          <p className="text-sm text-text-secondary">Set up a card for specific spending categories</p>
        </button>
      </div>

      {/* How It Works */}
      <div className="rounded-xl bg-bg-card border border-white/5 p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">How Virtual Cards Work</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-primary/10 text-sm font-bold text-green-primary">
              1
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-sm mb-1">Set Your Budget</h4>
              <p className="text-xs text-text-secondary">Allocate a specific amount to each card based on your budget categories.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-primary/10 text-sm font-bold text-green-primary">
              2
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-sm mb-1">Spend Safely</h4>
              <p className="text-xs text-text-secondary">Use your card for purchases. Transactions are automatically declined if they exceed your budget.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-primary/10 text-sm font-bold text-green-primary">
              3
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-sm mb-1">Stay On Track</h4>
              <p className="text-xs text-text-secondary">Get real-time alerts and insights to help you stick to your financial goals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
