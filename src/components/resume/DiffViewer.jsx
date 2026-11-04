import React, { useState } from 'react';
import { Copy, Check, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

export const DiffViewer = ({ suggestion, onAccept }) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.improved);
    setCopied(true);
    addToast('Copied improved phrasing to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = () => {
    setIsAccepted(true);
    if (onAccept) onAccept(suggestion);
    addToast('Revision accepted!', 'success');
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-brand-border pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          <h4 className="text-sm font-bold text-brand-navy">{suggestion.section || 'Resume Bullet'}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-colors text-xs flex items-center gap-1 cursor-pointer"
            title="Copy suggestion"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-primary" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <Button
            variant={isAccepted ? 'mint' : 'primary'}
            size="sm"
            onClick={handleAccept}
            className="text-xs"
            disabled={isAccepted}
          >
            {isAccepted ? 'Accepted' : 'Accept Revision'}
          </Button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Original Content</div>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">{suggestion.original}</p>
        </div>

        {/* AI Improved */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> PulseAI Optimized Phrasing
          </div>
          <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">{suggestion.improved}</p>
        </div>
      </div>

      {/* Rationale Note */}
      {suggestion.reason && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-text">
          <Lightbulb className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-brand-navy">Why this improves your ATS score: </span>
            <span className="text-brand-muted leading-relaxed">{suggestion.reason}</span>
          </div>
        </div>
      )}
    </div>
  );
};

