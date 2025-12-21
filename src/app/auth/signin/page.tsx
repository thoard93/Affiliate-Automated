'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';


export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-aa-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-aa-orange animate-spin" />
      </div>
    }>
      <div className="min-h-screen bg-aa-bg-primary selection:bg-aa-orange selection:text-white overflow-hidden flex items-center justify-center p-6 relative font-sans">
        {/* Ambient Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-aa-orange/10 rounded-full blur-[150px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-aa-gold/5 rounded-full blur-[120px] animate-pulse-glow delay-1000" />
        </div>

        <div className="w-full max-w-xl relative z-10 animate-fade-in-up">
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center justify-center mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-aa-orange/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg"
                  alt="Affiliate Automated"
                  className="h-20 w-auto rounded-2xl shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter">
              Welcome <span className="text-gradient">Back.</span>
            </h1>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Initialize secure creator session</p>
          </div>

          <SignInForm />

          <div className="mt-12 text-center">
            <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
              Need priority access? <Link href="#" className="text-aa-orange hover:text-white transition-colors">Join our Discord</Link>
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscordSignIn = async () => {
    setIsLoading(true);
    await signIn('discord', { callbackUrl });
  };

  return (
    <div className="card p-10 sm:p-14 relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-aa-orange/5 to-transparent opacity-40" />

      <div className="relative z-10">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Authentication</h2>
          <p className="text-sm font-bold text-white/30 truncate">Connect your creator account to continue</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Authorization Failed</span>
            </div>
            <p className="text-[9px] opacity-60">
              {error === 'OAuthSignin' && 'Error starting sign in flow'}
              {error === 'OAuthCallback' && 'Error during sign in callback'}
              {error === 'OAuthAccountNotLinked' && 'Account already linked to another user'}
              {error === 'Callback' && 'Error during callback'}
              {error === 'Default' && 'An error occurred during sign in'}
              {!['OAuthSignin', 'OAuthCallback', 'OAuthAccountNotLinked', 'Callback', 'Default'].includes(error) && 'An error occurred'}
            </p>
          </div>
        )}

        <button
          onClick={handleDiscordSignIn}
          disabled={isLoading}
          className="btn-primary w-full h-16 flex items-center justify-center gap-4 bg-[#5865F2] border-[#5865F2]/20 hover:bg-[#4752C4] shadow-xl shadow-[#5865F2]/10 group/btn"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
                </svg>
              </div>
              <span className="font-black uppercase tracking-[0.2em] text-xs">Continue with Discord</span>
            </>
          )}
        </button>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-center leading-loose max-w-xs">
            By scaling your earnings, you agree to our <br />
            <Link href="#" className="text-white/40 hover:text-white underline transition-colors">Terms of Service</Link> & <Link href="#" className="text-white/40 hover:text-white underline transition-colors">Privacy Policy</Link>
          </p>
          <div className="flex items-center gap-2 opacity-20">
            <Lock className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-widest">End-to-End Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { AlertCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
