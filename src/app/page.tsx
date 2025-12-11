import Link from 'next/link';
import { TrendingUp, Zap, Shield, Users, BarChart3, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-aa-dark">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-aa-dark/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg" alt="AA" className="h-10 w-auto" />
              <div>
                <span className="font-bold text-white">AFFILIATE</span>
                <span className="font-bold text-aa-gold ml-1">AUTOMATED</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin" className="text-white/70 hover:text-white transition-colors">Sign In</Link>
              <Link href="/auth/signin" className="btn-primary flex items-center gap-2">Get Started<ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aa-orange/10 border border-aa-orange/20 mb-8">
              <Zap className="w-4 h-4 text-aa-orange" />
              <span className="text-sm font-medium text-aa-orange">Exclusive MCN Commission Rates</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Maximize Your</span><br />
              <span className="text-gradient">TikTok Shop</span><br />
              <span className="text-white">Commissions</span>
            </h1>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              Access exclusive boosted commission rates on 213+ products. Earn <span className="text-aa-gold font-semibold">5-8% higher</span> than open collaboration rates as an Affiliate Automated creator.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signin" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">Connect Your Account<ArrowRight className="w-5 h-5" /></Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-4">Learn More</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            <div className="card text-center"><div className="text-3xl font-bold text-gradient mb-1">213+</div><div className="text-sm text-white/60">Products Available</div></div>
            <div className="card text-center"><div className="text-3xl font-bold text-gradient mb-1">5-8%</div><div className="text-sm text-white/60">Higher Rates</div></div>
            <div className="card text-center"><div className="text-3xl font-bold text-gradient mb-1">218+</div><div className="text-sm text-white/60">Active Creators</div></div>
            <div className="card text-center"><div className="text-3xl font-bold text-gradient mb-1">$0</div><div className="text-sm text-white/60">Platform Fees</div></div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-aa-dark-500/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything You Need to Maximize Earnings</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">Our platform gives you the tools and exclusive rates to supercharge your TikTok Shop affiliate business.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-interactive group"><div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center mb-4"><TrendingUp className="w-6 h-6 text-aa-orange" /></div><h3 className="text-xl font-semibold text-white mb-2">Boosted Commissions</h3><p className="text-white/60">Access exclusive rates 5-8% higher than standard open collaborations on curated products.</p></div>
            <div className="card-interactive group"><div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center mb-4"><Zap className="w-6 h-6 text-aa-orange" /></div><h3 className="text-xl font-semibold text-white mb-2">One-Click Adding</h3><p className="text-white/60">Add products to your showcase with a single tap. We send you the deep link, you click to add.</p></div>
            <div className="card-interactive group"><div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center mb-4"><Users className="w-6 h-6 text-aa-orange" /></div><h3 className="text-xl font-semibold text-white mb-2">Discord Alerts</h3><p className="text-white/60">Get instant notifications when new high-commission products are available.</p></div>
            <div className="card-interactive group"><div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center mb-4"><BarChart3 className="w-6 h-6 text-aa-orange" /></div><h3 className="text-xl font-semibold text-white mb-2">Earnings Dashboard</h3><p className="text-white/60">Track your sales, commissions, and performance in real-time.</p></div>
            <div className="card-interactive group"><div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center mb-4"><Shield className="w-6 h-6 text-aa-orange" /></div><h3 className="text-xl font-semibold text-white mb-2">Verified Products</h3><p className="text-white/60">All products are vetted for quality, stock availability, and seller reliability.</p></div>
            <div className="card-interactive group"><div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center mb-4"><Sparkles className="w-6 h-6 text-aa-orange" /></div><h3 className="text-xl font-semibold text-white mb-2">Free Samples</h3><p className="text-white/60">Many products offer free samples so you can create authentic content.</p></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">Get started in minutes and start earning higher commissions today.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative"><div className="text-8xl font-bold text-aa-orange/10 absolute -top-4 -left-2">01</div><div className="relative pt-12"><h3 className="text-xl font-semibold text-white mb-2">Connect Your Account</h3><p className="text-white/60">Sign in with Discord and connect your TikTok Shop creator account.</p></div></div>
            <div className="relative"><div className="text-8xl font-bold text-aa-orange/10 absolute -top-4 -left-2">02</div><div className="relative pt-12"><h3 className="text-xl font-semibold text-white mb-2">Browse Products</h3><p className="text-white/60">Explore 213+ products with boosted commission rates and find ones that fit your niche.</p></div></div>
            <div className="relative"><div className="text-8xl font-bold text-aa-orange/10 absolute -top-4 -left-2">03</div><div className="relative pt-12"><h3 className="text-xl font-semibold text-white mb-2">Add and Earn</h3><p className="text-white/60">Click to add products to your showcase and start earning higher commissions.</p></div></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card border-gradient p-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Boost Your Earnings?</h2>
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">Join 218+ creators already earning higher commissions with Affiliate Automated. No platform fees, no strings attached.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-aa-success" />Exclusive MCN Rates</div>
              <div className="flex items-center gap-2 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-aa-success" />Free to Join</div>
              <div className="flex items-center gap-2 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-aa-success" />Instant Discord Alerts</div>
              <div className="flex items-center gap-2 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-aa-success" />One-Click Product Adding</div>
            </div>
            <Link href="/auth/signin" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">Get Started Now<ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg" alt="AA" className="h-8 w-auto" />
              <span className="text-sm text-white/60">Affiliate Automated - Market Mix Media LLC</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
