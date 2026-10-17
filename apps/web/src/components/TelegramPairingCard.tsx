'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle2, Copy, ExternalLink, Loader2, QrCode, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface TelegramPairingProps {
  isPaired: boolean;
  telegramUsername?: string | null;
  onPairSuccess?: (username?: string) => void;
}

export function TelegramPairingCard({ isPaired: initialPaired, telegramUsername: initialUsername, onPairSuccess }: TelegramPairingProps) {
  const [loading, setLoading] = useState(false);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [paired, setPaired] = useState(initialPaired);
  const [username, setUsername] = useState<string | null>(initialUsername || null);

  useEffect(() => {
    setPaired(initialPaired);
  }, [initialPaired]);

  useEffect(() => {
    if (initialUsername) setUsername(initialUsername);
  }, [initialUsername]);

  // Poll pairing status periodically when ticket is active or checking initial status
  useEffect(() => {
    let interval: any = null;

    const checkStatus = async () => {
      try {
        const res = await fetch('/api/telegram/status');
        const data = await res.json();
        if (data.paired) {
          setPaired(true);
          if (data.telegramUsername) setUsername(data.telegramUsername);
          if (onPairSuccess) onPairSuccess(data.telegramUsername);
          if (interval) clearInterval(interval);
        }
      } catch (err) {
        // silent fail
      }
    };

    if (!paired) {
      checkStatus();
      if (deepLink) {
        interval = setInterval(checkStatus, 3000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [deepLink, paired, onPairSuccess]);

  const generateLink = async () => {
    setLoading(true);
    setPopupBlocked(false);
    try {
      const res = await fetch('/api/telegram/pair', { method: 'POST' });
      const data = await res.json();
      if (data.deepLink) {
        setDeepLink(data.deepLink);

        // Immediately attempt to open Telegram deep link
        try {
          const win = window.open(data.deepLink, '_blank', 'noopener,noreferrer');
          if (!win || win.closed || typeof win.closed === 'undefined') {
            setPopupBlocked(true);
          }
        } catch {
          setPopupBlocked(true);
        }
      }
    } catch (err) {
      console.error('Pairing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (deepLink) {
      navigator.clipboard.writeText(deepLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-dark-800 border border-dark-600 relative overflow-hidden shadow-lg shadow-black/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              Telegram Companion Sync
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                1-Click Auth
              </span>
            </h4>
            <p className="text-xs text-gray-400">Receive 1-tap comment approvals, thumbnail vision scores, & channel alerts on mobile</p>
          </div>
        </div>

        {paired ? (
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            Connected {username ? `@${username}` : '@Tuble_Pilot_bot'}
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Not Paired
          </span>
        )}
      </div>

      {!paired && (
        <div className="mt-4 pt-4 border-t border-dark-700">
          {!deepLink ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-gray-400 max-w-md">
                Click below to generate an instant 1-click deep link to pair your YouTube account directly with <span className="text-sky-400 font-medium">@Tuble_Pilot_bot</span> on port 3001.
              </p>
              <button
                onClick={generateLink}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-900/30 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Generate 1-Click Telegram Link
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {popupBlocked && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Click the <strong>Open in Telegram</strong> button below or scan the QR code to finish pairing!</span>
                </div>
              )}

              {/* Direct Clickable Link Card & QR Code Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-xl bg-dark-900/90 border border-dark-700/80">
                {/* QR Code Column */}
                <div className="flex flex-col items-center justify-center p-3 bg-dark-800 rounded-xl border border-dark-700">
                  <div className="p-2 bg-white rounded-lg shadow-inner">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(deepLink)}&margin=4`}
                      alt="Telegram Pairing QR Code"
                      className="w-32 h-32 rounded object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-medium text-sky-400">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan with Phone Camera</span>
                  </div>
                </div>

                {/* Direct Actions Column */}
                <div className="md:col-span-2 flex flex-col justify-center space-y-3">
                  <div>
                    <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>Ready to Pair with @Tuble_Pilot_bot</span>
                      <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Waiting for tap...</span>
                    </h5>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Tap the button below to launch Telegram. The bot will ask for your language preference (🇺🇿/🇷🇺/🇬🇧) and pair your workspace instantly.
                    </p>
                  </div>

                  {/* Direct Clickable Button & Copy */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <a
                      href={deepLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-900/40"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in Telegram (@Tuble_Pilot_bot)</span>
                    </a>

                    <button
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-600 text-xs font-semibold transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Link'}</span>
                    </button>

                    <button
                      onClick={generateLink}
                      disabled={loading}
                      title="Generate new ticket"
                      className="p-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white border border-dark-600 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Full URL snippet */}
                  <div className="p-2.5 rounded-lg bg-dark-950 border border-dark-800 text-[11px] font-mono text-gray-400 break-all select-all">
                    {deepLink}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
