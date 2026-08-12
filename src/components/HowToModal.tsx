import React from 'react';
import { X, AlertTriangle, ExternalLink, Flame, Sparkles, Copy, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToModal: React.FC<HowToModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const sampleTweet = `Locked in for @247pmstudio's Hacker House Goa 2026! 🌴⚡

Generated my official Builder ID for #FrameInGoa. See you on the sand in Goa this October!

Here's how to generate your own:
1. Upload your photo
2. Pick your role & roll your builder class
3. Download 1-click & share!

Generate yours: ${typeof window !== 'undefined' ? window.location.href : 'https://hhgoa.com'}

#HHGoa2026 #FrameInGoa #HackerHouseGoa`;

  const copySample = async () => {
    soundManager.playClick();
    await navigator.clipboard.writeText(sampleTweet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#064423] border-4 border-black rounded-3xl pop-shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-black bg-[#FFE600] border-2 border-black rounded-xl pop-shadow hover:bg-yellow-300 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Tag */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-3 py-1 rounded-md text-xs font-mono font-black bg-[#FF007A] text-white border-2 border-black pop-shadow flex items-center">
            <Flame className="w-3.5 h-3.5 mr-1 text-[#FFE600]" />
            TASK #1 SHORTLISTING GUIDE
          </span>
          <span className="text-xs font-mono font-bold text-[#FFE600]">#FrameInGoa</span>
        </div>

        <h2 className="text-2xl font-serif-hh font-black text-[#FFE600] mb-2 tracking-wide">
          How to Submit & Get Shortlisted for HH Goa 2026
        </h2>
        <p className="text-sm text-slate-100 mb-5">
          Follow these exact steps to complete your submission and get featured on the Radar!
        </p>

        {/* Important Warning Banner */}
        <div className="p-4 mb-5 bg-[#FFE600] border-3 border-black rounded-2xl pop-shadow flex items-start space-x-3 text-black">
          <AlertTriangle className="w-6 h-6 text-[#FF007A] shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-black font-black text-sm block mb-0.5">
              ⚠ CRITICAL REQUIREMENT:
            </strong>
            Your X post <strong>MUST</strong> contain the hashtag{' '}
            <span className="font-mono font-black text-white bg-[#FF007A] px-1.5 py-0.5 rounded border border-black">
              #FrameInGoa
            </span>
            . Submissions without this hashtag will be treated as invalid.
          </div>
        </div>

        {/* 4 Steps */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3 p-3.5 bg-[#0a6c38] rounded-xl border-2 border-black pop-shadow">
            <div className="w-7 h-7 rounded-full bg-[#FFE600] border-2 border-black text-black flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-sm font-black text-[#FFE600]">Generate your Beach ID / PFP</h4>
              <p className="text-xs text-slate-200">
                Choose Format A (PFP Frame), Format B (Builder ID Card), or the Squad Combined Frame. Adjust your photo and roll your builder title.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 bg-[#0a6c38] rounded-xl border-2 border-black pop-shadow">
            <div className="w-7 h-7 rounded-full bg-[#FFE600] border-2 border-black text-black flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-sm font-black text-[#FFE600]">Download or Copy Image</h4>
              <p className="text-xs text-slate-200">
                Click <strong>"1-Click Download"</strong> or <strong>"Copy Image"</strong> to get the crystal-clear 2K PNG file.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 bg-[#0a6c38] rounded-xl border-2 border-black pop-shadow">
            <div className="w-7 h-7 rounded-full bg-[#FFE600] border-2 border-black text-black flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-sm font-black text-[#FFE600]">Post on X (Twitter)</h4>
              <p className="text-xs text-slate-200">
                Click <strong>"Share to X"</strong>. Attach your downloaded graphic, include a quick how-to, and make sure <code className="text-[#FFE600] font-bold">#FrameInGoa</code> and <code className="text-[#FFE600] font-bold">@247pmstudio</code> are included!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 bg-[#0a6c38] rounded-xl border-2 border-black pop-shadow">
            <div className="w-7 h-7 rounded-full bg-[#FFE600] border-2 border-black text-black flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h4 className="text-sm font-black text-[#FFE600]">Submit the Official Form</h4>
              <p className="text-xs text-slate-200">
                Submit your live link + your X post link in the official Google Form before <strong>11:59 PM, 13th August 2026</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Tweet Box */}
        <div className="p-4 bg-[#0a6c38] rounded-xl border-2 border-black pop-shadow mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-black text-[#FFE600] flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-[#FF007A]" />
              Sample X Post Template:
            </span>
            <button
              onClick={copySample}
              className="text-xs font-mono font-black text-black bg-[#FFE600] px-2 py-0.5 rounded border border-black hover:bg-yellow-300 flex items-center space-x-1 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Template</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-xs font-mono text-white whitespace-pre-wrap bg-[#064423] p-3 rounded-lg border border-black">
            {sampleTweet}
          </pre>
        </div>

        {/* Action Link to Submission Form */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <a
            href="https://forms.gle/jM5hTaGvsrfEfixPA"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-display font-black text-sm bg-[#FF007A] text-white border-2 border-black pop-shadow hover:bg-pink-600 transition"
          >
            <span>Open Official Submission Form</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto py-3 px-6 rounded-xl font-mono text-xs font-black text-black bg-[#FFE600] border-2 border-black pop-shadow hover:bg-yellow-300 transition cursor-pointer"
          >
            Let's Ship!
          </button>
        </div>
      </div>
    </div>
  );
};
