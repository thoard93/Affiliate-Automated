import Link from 'next/link';
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-aa-dark">
      {/* Navigation */}
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
              <Link 
                href="/auth/signin" 
                className="text-white/70 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signin" 
                className="btn-primary flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aa-orange/10 border border-aa-orange/20 mb-8">
              <Zap className="w-4 h-4 text-aa-orange" />
              <span className="text-sm font-medium text-aa-orange">
                Exclusive MCN Commission Rates
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Maximize Your</span>
              <br />
              <span className="text-gradient">TikTok Shop</span>
              <br />
              <span className="text-white">Commissions</span>
            </h1>
            
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              Access exclusive boosted commission rates on 213+ products. 
              Earn <span className="text-aa-gold font-semibold">5-8% higher</span> than 
              open collaboration rates as an Affiliate Automated creator.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/signin" 
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                Connect Your Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#features" 
                className="btn-secondary text-lg px-8 py-4"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { value: '213+', label: 'Products Available' },
              { value: '5-8%', label: 'Higher Rates' },
              { value: '218+', label: 'Active Creators' },
              { value: '$0', label: 'Platform Fees' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="card text-center"
              >
                <div className="text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-aa-dark-500/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Maximize Earnings
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Our platform gives you the tools and exclusive rates to 
              supercharge your TikTok Shop affiliate business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Boosted Commissions',
                description: 'Access exclusive rates 5-8% higher than standard open collaborations on curated products.',
              },
              {
                icon: Zap,
                title: 'One-Click Adding',
                description: 'Add products to your showcase with a single tap. We send you the deep link, you click to add.',
              },
              {
                icon: Users,
                title: 'Discord Alerts',
                description: 'Get instant notifications when new high-commission products are available.',
              },
              {
                icon: BarChart3,
                title: 'Earnings Dashboard',
                description: 'Track your sales, commissions, and performance in real-time.',
              },
              {
                icon: Shield,
                title: 'Verified Products',
                description: 'All products are vetted for quality, stock availability, and seller reliability.',
              },
              {
                icon: Sparkles,
                title: 'Free Samples',
                description: 'Many products offer free samples so you can create authentic content.',
              },
            ].map((feature, i) => (
              <div 
                key={i}
