import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ScoreGauge = ({ score = 85, analysis = {} }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 85) return 'text-brand-primary stroke-[#159B79]';
    if (val >= 70) return 'text-amber-600 stroke-amber-500';
    return 'text-red-600 stroke-red-500';
  };

  const metrics = [
    { label: 'Resume Structure', score: analysis?.structureScore || 90 },
    { label: 'Executive Summary', score: analysis?.summaryScore || 82 },
    { label: 'Technical Skills Depth', score: analysis?.skillsScore || 88 },
    { label: 'Quantified Experience', score: analysis?.experienceScore || 85 },
    { label: 'ATS Readability', score: analysis?.readabilityScore || 92 },
  ];

  return (
    <div className="bg-white rounded-xl border border-brand-border p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-3 border-b border-brand-border/60 pb-2.5">
        <div>
          <h3 className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-primary" /> ATS Quality Score
          </h3>
          <p className="text-[11px] text-brand-muted">Calculated by PulseAI Neural Engine</p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-bg text-brand-navy border border-brand-border">
          Ready for Applications
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Circular Gauge */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 110 110">
              <circle
                cx="55"
                cy="55"
                r={radius}
                className="stroke-gray-100"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="55"
                cy="55"
                r={radius}
                className={getScoreColor(score)}
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold text-brand-navy tracking-tight">{score}</span>
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">/ 100</span>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-brand-navy mt-1.5">
            {score >= 85 ? 'Excellent Profile Quality' : score >= 70 ? 'Competitive Profile' : 'Needs Optimization'}
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="md:col-span-2 space-y-2">
          {metrics.map((m, i) => (
            <div key={i}>
              <div className="flex justify-between text-[11px] font-semibold text-brand-text mb-0.5">
                <span>{m.label}</span>
                <span className="text-brand-navy font-bold">{m.score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.score}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full rounded-full bg-brand-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
