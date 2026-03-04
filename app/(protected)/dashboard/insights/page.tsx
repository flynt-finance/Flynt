"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowUpRight,
  Send,
  MessageSquare,
  X,
  User,
} from "lucide-react";
import Image from "next/image";

/* -----------------------------
   Types
------------------------------ */

interface Message {
  id: string;
  sender: "sophia" | "user";
  text?: string;
  type: "text" | "insight";
  timestamp: Date;
  insightData?: {
    type: "warning" | "optimization" | "market" | "savings";
    title: string;
    description: string;
    actionText: string;
    logo?: string;
  };
}

/* -----------------------------
   Mock Data
------------------------------ */

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "sophia",
    type: "text",
    text: "Hello. I've analyzed your February financial activity.",
    timestamp: new Date(),
  },
  {
    id: "2",
    sender: "sophia",
    type: "insight",
    timestamp: new Date(),
    insightData: {
      type: "savings",
      title: "Save ₦15,000 on DSTV",
      description:
        "Pause DSTV Premium during international breaks and save ₦15,000.",
      actionText: "Pause Subscription",
      logo: "/dstv.png",
    },
  },
  {
    id: "3",
    sender: "sophia",
    type: "insight",
    timestamp: new Date(),
    insightData: {
      type: "market",
      title: "Dangote Refinery IPO Opportunity",
      description:
        "Analysts suggest this IPO could be the strongest buy of Q2.",
      actionText: "Monitor Stock",
      logo: "/dangote.webp",
    },
  },
];

/* -----------------------------
   Page
------------------------------ */

export default function InsightsPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isSophiaOpen, setIsSophiaOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      type: "text",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userText = inputText.toLowerCase();
    setInputText("");

    // Start simulation
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      let sophiaResponse: Message;

      /* ---------------- Spending Analysis ---------------- */
      if (userText.includes("analyze") || userText.includes("spending")) {
        sophiaResponse = {
          id: (Date.now() + 1).toString(),
          sender: "sophia",
          type: "text",
          text:
            "Here’s your February breakdown:\n\n" +
            "• Food & Dining — 38%\n" +
            "• Subscriptions — 21%\n" +
            "• Transportation — 17%\n" +
            "• Utilities — 9%\n" +
            "• Miscellaneous — 15%\n\n" +
            "Your highest anomaly: subscription stacking.\n" +
            "You currently maintain 6 recurring services. Two show low utilization.\n\n" +
            "Would you like recommendations on which to pause?",
          timestamp: new Date(),
        };
      } else if (userText.includes("budget")) {
        /* ---------------- Budget Check ---------------- */
        sophiaResponse = {
          id: (Date.now() + 1).toString(),
          sender: "sophia",
          type: "text",
          text:
            "Current Budget Health: 72% stable.\n\n" +
            "⚠ Food & Dining is trending above projection.\n" +
            "At this pace, you will exceed allocation by ₦42,300.\n\n" +
            "Recommendation:\n" +
            "• Shift ₦25,000 from Miscellaneous\n" +
            "OR\n" +
            "• Enable soft-limit alerts.\n\n" +
            "Would you like proactive protection activated?",
          timestamp: new Date(),
        };
      } else if (userText.includes("savings")) {
        /* ---------------- Savings Advice ---------------- */
        sophiaResponse = {
          id: (Date.now() + 1).toString(),
          sender: "sophia",
          type: "text",
          text:
            "Liquidity optimization detected.\n\n" +
            "Recommended pauses this month:\n" +
            "• DSTV Premium — Save ₦15,000\n" +
            "• Apple Music Family — Save ₦6,800\n\n" +
            "Total potential liquidity gain: ₦21,800.\n\n" +
            "Would you like automated suspension enabled?",
          timestamp: new Date(),
        };
      } else if (userText.includes("ipo") || userText.includes("stock")) {
        /* ---------------- IPO Updates ---------------- */
        sophiaResponse = {
          id: (Date.now() + 1).toString(),
          sender: "sophia",
          type: "text",
          text:
            "Tracking live opportunities:\n\n" +
            "• Dangote Refinery IPO — Institutional sentiment: Positive\n" +
            "• MTN Infrastructure Bond — Stable yield\n" +
            "• Nigerian Treasury Bills — Yield contraction expected\n\n" +
            "Would you like real-time refinery expansion alerts?",
          timestamp: new Date(),
        };
      } else {
        /* ---------------- Default Smart Response ---------------- */
        sophiaResponse = {
          id: (Date.now() + 1).toString(),
          sender: "sophia",
          type: "text",
          text:
            "I'm analyzing that request.\n\n" +
            "Please specify if you'd like assistance with:\n" +
            "• Spending analysis\n" +
            "• Budget health\n" +
            "• Savings optimization\n" +
            "• Investment monitoring\n\n" +
            "I'm ready when you are.",
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, sophiaResponse]);
      setIsTyping(false);
    }, 1500); // Increased slightly for more "thoughtful" simulation
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const insights = messages.filter(
    (m) => m.type === "insight" && m.insightData,
  );

  return (
    <div className="flex h-[calc(100vh-120px)] max-w-7xl mx-auto gap-6">
      {/* ---------------- LEFT: INSIGHTS STACK ---------------- */}

      <div className="w-[480px] shrink-0 flex flex-col">
        <div className="bg-white dark:bg-[#0A0D27]/40 border border-slate-200 dark:border-white/5 rounded-[2rem] shadow-xl p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black">Insights</h3>
            <Image
              src={"/favicon.ico"}
              alt="Flynt Logo"
              width={28}
              height={28}
              className="rounded-full"
            />
          </div>

          <div className="space-y-4 overflow-y-auto pr-2">
            {insights.map((msg) => (
              <motion.div
                key={msg.id}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1131] shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex gap-4">
                  {msg.insightData?.logo && (
                    <div className="h-11 w-11 relative rounded-full overflow-hidden bg-white border border-slate-100 dark:border-white/10">
                      <Image
                        src={msg.insightData.logo}
                        alt={msg.insightData.title}
                        fill
                        className="object-contain p-1 rounded-full"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="text-sm font-bold">
                      {msg.insightData?.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {msg.insightData?.description}
                    </p>
                  </div>
                </div>

                <button className="mt-5 w-full text-xs font-bold bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  {msg.insightData?.actionText}
                  <ArrowUpRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT: SOPHIA PANEL ---------------- */}

      <AnimatePresence>
        {isSophiaOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-hidden"
          >
            <div className="flex flex-col h-full bg-white dark:bg-[#0A0D27]/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
              {/* Header */}
              <header className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-[#0D1131]/80 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20"
                    animate={{
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Outer Pulse Ring */}
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-emerald-400/40"
                      animate={{
                        scale: [1, 1.6],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />

                    {/* Logo */}
                    <Image
                      src={"/favicon.ico"}
                      alt="Flynt Logo"
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-black">Sophia</h2>
                    <p className="text-xs text-slate-500">
                      Flynt Intelligence Hub • Active
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSophiaOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </header>

              {/* Chat */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6"
              >
                {messages
                  .filter((m) => m.type === "text")
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[65%] p-4 rounded-2xl text-sm ${
                          msg.sender === "user"
                            ? "bg-emerald-600 text-white rounded-tr-none"
                            : "bg-white dark:bg-[#0D1131] border border-slate-200 dark:border-white/10 rounded-tl-none font-medium"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                {/* Sophia is Typing Indicator - Outside the loop */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white dark:bg-[#0D1131] border border-slate-200 dark:border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
                        <span className="h-2 w-2 bg-emerald-500/60 rounded-full animate-bounce" />
                        <span className="h-2 w-2 bg-emerald-500/80 rounded-full animate-bounce [animation-delay:-0.2s]" />
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.4s]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <footer className="p-6 border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0D1131]/80 backdrop-blur-xl">
                <div className="relative">
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Message Sophia..."
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40"
                  />
                  <button
                    onClick={handleSend}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button when closed */}
      {!isSophiaOpen && (
        <button
          onClick={() => setIsSophiaOpen(true)}
          className="fixed bottom-10 right-10 h-14 w-14 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center justify-center"
        >
          <Image
            src={"/favicon.ico"}
            alt="Flynt Logo"
            width={28}
            height={28}
            className="rounded-full"
          />
        </button>
      )}
    </div>
  );
}
