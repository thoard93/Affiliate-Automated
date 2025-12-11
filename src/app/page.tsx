import Link from 'next/link';
import { TrendingUp, Zap, Shield, Users, BarChart3, ArrowRight, CheckCircle2, Sparkles, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-aa-dark selection:bg-aa-orange selection:text-white overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aa-orange/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-aa-gold/5 rounded-full blur-[100px] animate-pulse-glow delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-lg shadow-aa-orange/20 flex items-center justify-center bg-gradient-to-br from-aa-orange to-aa-gold">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/auth/signin" className="hidden sm:block text-white/70 hover:text-white transition-colors font-medium">Sign In</Link>
              <Link href="/auth/signin" className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aa-orange/10 border border-aa-orange/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-aa-orange animate-pulse" />
              <span className="text-sm font-semibold text-aa-orange tracking-wide uppercase">Official TikTok MCN Partner</span>
            </div>

            {/* Heading */}
            <h1 className="animate-fade-in-up delay-100 text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              <span className="text-white block">Maximize Your</span>
              <span className="text-gradient block glow-text">Commission Rates</span>
            </h1>

            {/* Subtext */}
            <p className="animate-fade-in-up delay-200 text-xl sm:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Unlock exclusive <span className="text-aa-gold font-bold">5-8% boost</span> on top of open collaboration rates. Join 200+ creators earning more with the same views.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/auth/signin" className="btn-primary w-full sm:w-auto text-lg px-10 py-5 flex items-center justify-center gap-3 group">
                Connect TikTok Shop
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="btn-secondary w-full sm:w-auto text-lg px-10 py-5">
                Explore Features
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="animate-fade-in-up delay-300 grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
            {[
              { label: 'Products', value: '213+', sub: 'High Ticket Items' },
              { label: 'Boost', value: '5-8%', sub: 'Higher Commission' },
              { label: 'Creators', value: '218+', sub: 'Active Network' },
              { label: 'Fees', value: '$0', sub: 'Platform Cost' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-aa-orange transition-colors">{stat.value}</div>
                <div className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-1">{stat.label}</div>
                <div className="text-xs text-white/40">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Premium Creator Tools</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">Everything you need to scale your TikTok Shop business efficiently.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'Commission Boost', desc: 'Instantly unlock 5-8% higher rates than public listings.' },
              { icon: Zap, title: 'One-Click Add', desc: 'Deep links let you add products to showcase in seconds.' },
              { icon: Shield, title: 'Vetted Products', desc: 'Only high-stock, 4.5+ star rated products make the cut.' },
              { icon: Users, title: 'Discord Community', desc: 'Join 200+ creators sharing wins and winning strategies.' },
              { icon: BarChart3, title: 'Earnings Dashboard', desc: 'Track your performance across all boosted products.' },
              { icon: Star, title: 'Sample Requests', desc: 'Priority access to free samples for verified creators.' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-aa-orange/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-aa-orange/20 transition-colors duration-500" />

                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-aa-orange/50 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-aa-orange" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-aa-orange transition-colors">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-aa-dark-secondary">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-aa-orange/20 to-transparent opacity-50" />

            <div className="relative p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to <span className="text-gradient">Level Up?</span></h2>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                Join the fastest growing creator network on TikTok Shop. No contracts, no fees, just higher earnings.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-12">
                {['Free to Join', 'Instant Access', '24/7 Support', 'Weekly Payouts'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white/80 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-aa-success" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth/signin" className="btn-primary text-xl px-12 py-5 inline-flex items-center gap-3">
                Start Earning More
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <img src="https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg" alt="AA" className="h-8 w-auto grayscale" />
            <span className="text-sm font-mono tracking-wider">MARKET MIX MEDIA LLC</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
