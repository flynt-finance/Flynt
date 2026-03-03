import { motion } from "framer-motion";

interface CreditScoreGaugeProps {
  score: number;
  label?: string;
  lastCheck?: string;
  hideLabels?: boolean;
}

export default function CreditScoreGauge({
  score,
  label = "Your Financial Health is Average",
  lastCheck = "Last Check on 21 Apr",
  hideLabels = false,
}: CreditScoreGaugeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Credit Score Gauge */}
      <div
        className={`relative flex items-center justify-center ${hideLabels ? "" : "mb-4"}`}
      >
        <motion.svg
          className={`${hideLabels ? "w-24 h-12" : "w-48 h-24"}`}
          viewBox="0 0 200 100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Background arc */}
          <motion.path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {/* Poor section (red) */}
          <motion.path
            d="M 20 90 A 80 80 0 0 1 66.4 23.6"
            fill="none"
            stroke="#FF4757"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut" }}
          />
          {/* Fair section (yellow) */}
          <motion.path
            d="M 66.4 23.6 A 80 80 0 0 1 133.6 23.6"
            fill="none"
            stroke="#FFB020"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeInOut" }}
          />
          {/* Good section (green) */}
          <motion.path
            d="M 133.6 23.6 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#00D9A3"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.5, ease: "easeInOut" }}
          />
          {/* Indicator dot - positioned at score */}
          <motion.circle
            cx="120"
            cy="35"
            r="6"
            fill="#FFB020"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          />
        </motion.svg>
        <div
          className={`absolute ${hideLabels ? "top-6" : "top-12"} left-1/2 -translate-x-1/2 text-center`}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className={`${hideLabels ? "text-2xl" : "text-5xl"} font-bold text-text-primary`}
          >
            {score}
          </motion.div>
        </div>
      </div>

      {!hideLabels && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-text-primary mb-1">
            {label}
          </p>
          <p className="text-xs text-text-muted">{lastCheck}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
