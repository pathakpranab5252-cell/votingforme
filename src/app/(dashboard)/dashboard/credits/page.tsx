'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Zap, Shield, HelpCircle, CreditCard, Plus } from 'lucide-react';

export default function CreditsPage() {
  const transactions = [
    { id: 1, date: 'Oct 12, 2025', reason: 'Admin credit', amount: '+100', isAdd: true, balance: '1,250' },
    { id: 2, date: 'Oct 10, 2025', reason: 'Board Election 2025', amount: '-50', isAdd: false, balance: '1,150' },
    { id: 3, date: 'Oct 01, 2025', reason: 'Employee Satisfaction', amount: '-10', isAdd: false, balance: '1,200' },
    { id: 4, date: 'Sep 25, 2025', reason: 'Signup bonus', amount: '+50', isAdd: true, balance: '1,210' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Credits & Billing</h1>
        <p className="text-slate-400">Manage your account credits and view transaction history.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <motion.div variants={itemVariants} className="md:col-span-1 bg-gradient-to-br from-indigo-900/40 to-[#1A1730] backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Coins className="w-32 h-32 text-indigo-400" />
          </div>
          
          <div className="relative z-10 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium mb-4 border border-indigo-500/30">
              <Zap className="w-3 h-3" /> Pay As You Go
            </div>
            <h2 className="text-slate-400 font-medium mb-1">Available Credits</h2>
            <div className="flex items-baseline gap-2">
              <motion.span 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-5xl font-bold text-white"
              >
                1,250
              </motion.span>
              <span className="text-indigo-400 font-medium">credits</span>
            </div>
          </div>
          
          <button className="relative z-10 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4" />
            Buy More Credits
          </button>
        </motion.div>

        {/* Info Cards */}
        <motion.div variants={itemVariants} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">How Credits Work</h3>
            <p className="text-sm text-slate-400 mb-4 flex-1">
              One credit equals one voter invitation or one SMS sent. Credits never expire as long as your account remains active.
            </p>
            <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
              Read documentation
            </a>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Enterprise Plans</h3>
            <p className="text-sm text-slate-400 mb-4 flex-1">
              Need more than 10,000 credits per month? Contact our sales team for volume discounts and unlimited plans.
            </p>
            <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
              Contact Sales
            </a>
          </div>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mt-8">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Transaction History</h2>
          <button className="text-slate-400 hover:text-white p-2">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">{tx.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{tx.reason}</td>
                  <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                    <span className={`inline-flex font-semibold ${tx.isAdd ? 'text-green-400' : 'text-rose-400'}`}>
                      {tx.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 text-right whitespace-nowrap">
                    {tx.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-center">
          <button className="text-sm text-slate-400 hover:text-white font-medium">
            Load More Transactions
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
