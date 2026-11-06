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
    <div className="bg-white rounded-xl border border-brand-border p-3.5 shadow-subtle space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          <h4 className="text-xs font-bold text-brand-navy">{suggestion.section || 'Resume Bullet'}</h4>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 rounded-md border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
            title="Copy suggestion"
          >
            {copied ? <Check className="w-3 h-3 text-brand-primary" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <Button
            variant={isAccepted ? 'mint' : 'primary'}
            size="sm"
            onClick={handleAccept}
            className="text-[11px] py-1 px-2.5 h-auto"
            disabled={isAccepted}
          >
            {isAccepted ? 'Accepted' : 'Accept Revision'}
          </Button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* Original */}
        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Original Content</div>
          <p className="text-xs text-gray-700 leading-relaxed font-normal">{suggestion.original}</p>
        </div>

        {/* AI Improved */}
        <div className="p-2.5 rounded-lg bg-brand-primary-light/30 border border-brand-primary/25">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-primary" /> PulseAI Optimized Phrasing
          </div>
          <p className="text-xs text-brand-navy font-medium leading-relaxed">{suggestion.improved}</p>
        </div>
      </div>

      {/* Rationale Note */}
      {suggestion.reason && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-brand-bg border border-brand-border text-[11px] text-brand-text">
          <Lightbulb className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-brand-navy">Why this improves your ATS score: </span>
            <span className="text-brand-muted leading-relaxed">{suggestion.reason}</span>
          </div>
        </div>
      )}
    </div>
  );
};

