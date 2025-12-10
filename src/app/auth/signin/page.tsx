'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, MessageCircle, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'creator' | 'admin'>('creator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleDiscordSignIn = async () => {
    setIsLoading(true);
    await signIn('discord', { callbackUrl });
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAdminError('');
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      setAdminError(result.error);
      setIsLoading(false);
    } else {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-aa-dark flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-aa-gradient opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,107,0,0.15),transparent_70%)]" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-aa-gradient flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold">
                <span className="text-white">AFFILIATE</span>
                <span className="text-aa-gold ml-2">AUTOMATED</span>
              </div>
              <div className="text-white/40 text-sm">Market Mix Media LLC</div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome Back
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-md">
            Sign in to access exclusive boosted commission rates on 213+ TikTok Shop products.
          </p>
          
          <div className="space-y-4">
            {[
              '5-8% higher commission rates',
              'Instant Discord product alerts',
              'One-click showcase adding',
              'Real-time earnings tracking',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70">
                <div className="w-2 h-2 rounded-full bg-aa-orange" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-aa-gradient flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-xl">AFFILIATE</span>
              <span className="font-bold text-aa-gold text-xl ml-1">AUTOMATED</span>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error === 'OAuthAccountNotLinked' 
                ? 'This email is already registered with a different sign-in method.'
                : 'An error occurred during sign in. Please try again.'}
            </div>
          )}
          
          {/* Tab Switcher */}
          <div className="flex gap-2 p-1 bg-aa-dark-500 rounded-lg mb-8">
            <button
              onClick={() => setLoginType('creator')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'creator'
                  ? 'bg-aa-orange text-white shadow-aa'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Creator Login
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-aa-orange text-white shadow-aa'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Admin Login
            </button>
          </div>
          
          {loginType === 'creator' ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">
                Sign in with Discord
              </h2>
              <p className="text-white/60 mb-8">
                Connect your Discord account to access the creator dashboard.
              </p>
              
              <button
                onClick={handleDiscordSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Continue with Discord
                  </>
                )}
              </button>
              
              <p className="mt-6 text-center text-sm text-white/40">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-aa-orange hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-aa-orange hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">
                Admin Sign In
              </h2>
              <p className="text-white/60 mb-8">
                Sign in with your admin credentials.
              </p>
              
              {adminError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {adminError}
                </div>
              )}
              
              <form onSubmit={handleAdminSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-12"
                      placeholder="admin@affiliateautomated.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-12"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
