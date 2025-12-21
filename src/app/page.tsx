import Link from 'next/link';
import { TrendingUp, Zap, Shield, Users, BarChart3, ArrowRight, CheckCircle2, Sparkles, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-aa-bg-primary selection:bg-aa-orange selection:text-white overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-aa-orange/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse-glow delay-700" />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-aa-gold/5 rounded-full blur-[130px] animate-pulse-glow delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-aa-bg-primary/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20 sm:h-24">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative w-11 h-11 overflow-hidden rounded-xl shadow-2xl shadow-aa-orange/20 flex items-center justify-center bg-gradient-to-br from-aa-orange to-aa-gold group-hover:scale-105 transition-transform duration-500">
                <TrendingUp className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white leading-tight tracking-tighter text-lg uppercase">Affiliate</span>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-aa-orange to-aa-gold text-[10px] tracking-[0.3em] leading-tight uppercase -mt-0.5">Automated</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/auth/signin" className="hidden md:block text-sm font-black text-white/40 hover:text-white transition-all uppercase tracking-widest">Sign In</Link>
              <Link href="/auth/signin" className="btn-primary group flex items-center gap-3 px-8 py-3 shadow-xl shadow-aa-orange/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 font-black uppercase tracking-widest text-[10px]">Get Started</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 sm:px-8 lg:px-12 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto relative">
            {/* Animated Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-12 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-aa-orange/0 via-aa-orange/10 to-aa-orange/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="w-2 h-2 rounded-full bg-aa-orange animate-ping" />
              <span className="text-[10px] font-black text-white/60 tracking-[0.2em] uppercase">Official TikTok MCN Partner</span>
            </div>

            {/* Main Heading with Cinematic Reveal */}
            <h1 className="animate-fade-in-up delay-100 text-6xl sm:text-8xl lg:text-9xl font-black mb-10 leading-[0.95] tracking-tighter">
              <span className="text-white block opacity-90">Maximize Your</span>
              <span className="text-gradient block drop-shadow-2xl">Earnings.</span>
            </h1>

            {/* Premium Subtext */}
            <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-white/40 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
              Join the elite network of creators unlocking exclusive <span className="text-aa-gold font-black border-b border-aa-gold/20 pb-0.5">5-8% commission boosts</span> on the world's hottest products. Reach your peak potential.
            </p>

            {/* Interactive CTA */}
            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/auth/signin" className="btn-primary w-full sm:w-auto text-lg px-12 py-6 flex items-center justify-center gap-4 group shadow-2xl shadow-aa-orange/30">
                <span className="font-black uppercase tracking-widest text-xs">Connect TikTok Shop</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link href="#features" className="group w-full sm:w-auto px-12 py-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] transition-all flex items-center justify-center gap-3">
                <span className="font-black uppercase tracking-widest text-xs text-white/60 group-hover:text-white transition-colors">Explore Alpha</span>
                <ChevronDown className="w-4 h-4 text-white/20 group-hover:translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Stat Cards - Modern Minimalist */}
          <div className="animate-fade-in-up delay-500 grid grid-cols-2 lg:grid-cols-4 gap-6 mt-32 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-aa-orange/5 via-transparent to-aa-gold/5 blur-[100px] pointer-events-none" />
            {[
              { label: 'Products', value: '213+', sub: 'Vetted Selection', icon: Package },
              { label: 'Avg Boost', value: '6.5%', sub: 'Pure Profit', icon: Zap },
              { label: 'Partners', value: '218+', sub: 'Verified Creators', icon: Users },
              { label: 'Platform Fee', value: '$0', sub: 'Infinite Value', icon: Shield },
            ].map((stat, i) => (
              <div key={i} className="card group relative overflow-hidden p-10 hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon className="w-16 h-16 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl font-black text-white mb-3 group-hover:text-aa-orange transition-colors duration-500 tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                  <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - High Fidelity Grid */}
      <section id="features" className="py-40 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <div className="w-16 h-1 bg-gradient-to-r from-aa-orange to-aa-gold rounded-full mb-8" />
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">Built for <span className="text-gradient">Performance.</span></h2>
            <p className="text-lg text-white/30 max-w-2xl font-bold uppercase tracking-widest text-[10px]">The ultimate toolkit for the modern affiliate creator.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'Turbo Boost', desc: 'Instantly activate higher commission tiers across the catalog.', color: 'aa-orange' },
              { icon: Zap, title: 'Instant Link', desc: 'Add trending products to your showcase in a single tap.', color: 'yellow-400' },
              { icon: Shield, title: 'Safe Harbor', desc: 'Secure platform protecting your data and your earnings.', color: 'aa-success' },
              { icon: Users, title: 'MCN Network', desc: 'Collaborate with top-tier creators in our private network.', color: 'purple-500' },
              { icon: BarChart3, title: 'Live Tracker', desc: 'Pixel-perfect analytics tracking every click and convert.', color: 'aa-gold' },
              { icon: Star, title: 'Premium Access', desc: 'Priority sample shipping from our direct brand partners.', color: 'blue-500' },
            ].map((feature, i) => (
              <div key={i} className="card group p-10 hover:border-white/20 transition-all duration-500">
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-white/[0.05] transition-all duration-500",
                  `group-hover:border-${feature.color}/40 group-hover:shadow-2xl group-hover:shadow-${feature.color}/10`
                )}>
                  <feature.icon className={cn("w-8 h-8 opacity-40 group-hover:opacity-100 transition-all", `text-${feature.color}`)} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-gradient transition-all">{feature.title}</h3>
                <p className="text-sm font-bold text-white/30 leading-relaxed group-hover:text-white/50 transition-colors uppercase tracking-tight">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic CTA */}
      <section className="py-32 px-6 sm:px-8 lg:px-12 relative">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden border border-white/5 bg-white/[0.01] backdrop-blur-3xl group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-aa-orange/10 via-transparent to-aa-gold/5 opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-aa-orange/10 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-aa-gold/5 blur-[100px] rounded-full animate-pulse delay-500" />

            <div className="relative p-14 md:p-24 text-center z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight">
                Secure Your <br /> <span className="text-gradient">Advantage Today.</span>
              </h2>
              <p className="text-lg md:text-xl text-white/30 mb-14 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px]">
                No contracts. No hidden fees. Just elite tools for professional creators.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-16">
                {['Verified Only', 'Live Payouts', 'Elite Catalog'].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-white/[0.02] px-6 py-3 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-aa-success shadow-sm" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth/signin" className="btn-primary text-xl px-16 py-7 inline-flex items-center gap-4 group shadow-2xl shadow-aa-orange/20">
                <span className="font-black uppercase tracking-widest text-xs">Start Scaling Now</span>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-20 border-t border-white/5 bg-black/20 relative z-10">
        <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
            <img src="https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg" alt="AA" className="h-10 w-auto rounded-lg" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black tracking-[0.4em] text-white uppercase mt-2">Market Mix Media LLC</span>
              <span className="text-[8px] font-bold tracking-[0.1em] text-white/40 uppercase">Professional Network Platform</span>
            </div>
          </div>
          <div className="flex gap-12 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
            <Link href="#" className="hover:text-aa-orange transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-aa-orange transition-colors">Terms</Link>
            <Link href="#" className="hover:text-aa-orange transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper icons needed but not imported
import { ChevronDown, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
  );
}
