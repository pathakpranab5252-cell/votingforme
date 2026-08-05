'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { 
  CheckCircle, 
  Menu, 
  X, 
  Mail, 
  BarChart2, 
  FileSpreadsheet, 
  ShieldCheck, 
  Bell, 
  PieChart,
  ArrowRight,
  Check
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0D1A] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      </div>

      {/* Navigation Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0F0D1A]/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">VotingForMe</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How It Works</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all hover:scale-105"
            >
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            >
              Get Started Free
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#0F0D1A]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex flex-col gap-4"
          >
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-2 border-b border-white/5">Features</Link>
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-2 border-b border-white/5">How It Works</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-2 border-b border-white/5">Pricing</Link>
            <Link href="/signup" className="text-center py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-medium mt-2">Get Started Free</Link>
          </motion.div>
        )}
      </header>

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 md:px-12 pt-10 md:pt-20 pb-24 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              VotingForMe 2.0 is now live
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Create secure online elections in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                under 5 minutes
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
              The modern voting platform trusted by organizations worldwide. Simple setup, beautiful experience, instant results.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-full text-base font-medium transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="#how-it-works" 
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-base font-medium transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                See How It Works
              </Link>
            </motion.div>

            {/* Stats Bar */}
            <motion.div variants={fadeInUp} className="mt-20 pt-10 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-20">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-1">500+</span>
                <span className="text-sm text-slate-400">Elections Run</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-1">50,000+</span>
                <span className="text-sm text-slate-400">Votes Cast</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-1">99.9%</span>
                <span className="text-sm text-slate-400">Uptime</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to run an election</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Powerful features wrapped in an intuitive interface that both organizers and voters will love.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<Mail className="w-6 h-6 text-indigo-400" />}
                title="Email Invitations"
                description="Automated email invitations with unique, secure voting links for each eligible voter."
                delay={0.1}
              />
              <FeatureCard 
                icon={<BarChart2 className="w-6 h-6 text-purple-400" />}
                title="Live Dashboard"
                description="Monitor participation rates, bounce rates, and voting progress in real-time."
                delay={0.2}
              />
              <FeatureCard 
                icon={<FileSpreadsheet className="w-6 h-6 text-indigo-400" />}
                title="CSV Import"
                description="Upload voter lists via CSV/Excel with smart validation, deduplication and preview."
                delay={0.3}
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-6 h-6 text-purple-400" />}
                title="Secure Voting"
                description="Token-based one-time voting links ensure the fundamental rule: one person, one vote."
                delay={0.4}
              />
              <FeatureCard 
                icon={<Bell className="w-6 h-6 text-indigo-400" />}
                title="Smart Reminders"
                description="Automatic reminder emails sent only to non-voters before the election closes."
                delay={0.5}
              />
              <FeatureCard 
                icon={<PieChart className="w-6 h-6 text-purple-400" />}
                title="Instant Results"
                description="Beautiful charts and winner announcements available at the click of a button when voting ends."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-white/[0.02] border-y border-white/5 relative">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">From setup to results in three simple steps.</p>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 -translate-y-1/2 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <StepCard 
                  number="1"
                  title="Create Your Election"
                  description="Set up your poll with our guided wizard. Add candidates, set voting dates, and upload your voter list."
                  delay={0.2}
                />
                <StepCard 
                  number="2"
                  title="Voters Cast Ballots"
                  description="Voters receive secure links via email and vote with a beautiful, responsive one-click experience."
                  delay={0.4}
                />
                <StepCard 
                  number="3"
                  title="Publish Results"
                  description="View live participation, then publish final results when ready. Everyone gets notified instantly."
                  delay={0.6}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Start for free, upgrade when you need to run larger elections.</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col h-full"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-slate-400 mb-6">Perfect for testing and small groups</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-slate-400">/ forever</span>
                  </div>
                </div>
                
                <ul className="flex-1 space-y-4 mb-8">
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">5 free voting credits</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">Basic email invitations</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">Standard results dashboard</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">Community support</span></li>
                </ul>
                
                <Link 
                  href="/signup" 
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-center transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>

              {/* Pro Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-b from-[#1A1730] to-[#0F0D1A] backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 flex flex-col h-full relative"
              >
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</span>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-slate-400 mb-6">For organizations running serious elections</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">Pay</span>
                    <span className="text-slate-400">per event</span>
                  </div>
                </div>
                
                <ul className="flex-1 space-y-4 mb-8">
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">Unlimited voting credits (volume pricing)</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">Custom email branding</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">Advanced analytics & exports</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">Smart reminders & tracking</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /><span className="text-slate-300">Priority email support</span></li>
                </ul>
                
                <Link 
                  href="/contact" 
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-xl font-medium text-center transition-colors shadow-lg shadow-indigo-500/25"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 rounded-3xl p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to modernize your elections?</h2>
                <p className="text-indigo-200 mb-8 max-w-2xl mx-auto text-lg">Join thousands of organizations running secure, transparent, and easy-to-use online elections.</p>
                <Link 
                  href="/signup" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-950 hover:bg-indigo-50 rounded-full text-lg font-bold transition-transform hover:scale-105"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0A0812] pt-16 pb-8">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">VotingForMe</span>
              </Link>
              <p className="text-slate-400 text-sm mb-6">Secure, simple online voting for modern organizations.</p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Twitter</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">GitHub</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">LinkedIn</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} VotingForMe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents for cleaner code

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all hover:-translate-y-1"
    >
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, delay }: { number: string, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center group"
    >
      <div className="w-16 h-16 rounded-full bg-[#1A1730] border-2 border-indigo-500/50 flex items-center justify-center text-2xl font-bold mb-6 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500 transition-all z-10">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
