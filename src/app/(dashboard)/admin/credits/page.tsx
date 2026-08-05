'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Search,
  Check,
  ChevronDown
} from 'lucide-react';

// Mock Data
const stats = [
  { label: 'Total Credits Issued', value: '450,000', change: '+12,000 this month', icon: Coins, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Total Credits Used', value: '382,450', change: '+8,500 this month', icon: ArrowDownRight, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { label: 'System Float (Available)', value: '67,550', change: 'Current active balance', icon: Wallet, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
];

const mockTransactions = [
  { id: 1, date: '2024-02-15 14:30', user: 'Alex Johnson', amount: 500, type: 'add', reason: 'Startup Package Purchase', admin: 'System' },
  { id: 2, date: '2024-02-15 11:20', user: 'Mike Brown', amount: -150, type: 'deduct', reason: 'Poll Creation: Product Feedback', admin: 'System' },
  { id: 3, date: '2024-02-14 16:45', user: 'Sarah Smith', amount: 1000, type: 'add', reason: 'Custom Enterprise Deal', admin: 'Admin (You)' },
  { id: 4, date: '2024-02-14 09:15', user: 'Emma Davis', amount: 50, type: 'add', reason: 'Signup Bonus', admin: 'System' },
  { id: 5, date: '2024-02-13 18:22', user: 'Chris Wilson', amount: -300, type: 'deduct', reason: 'Premium Poll Upgrade', admin: 'System' },
  { id: 6, date: '2024-02-13 14:10', user: 'Alex Johnson', amount: -50, type: 'deduct', reason: 'Voter Verification Add-on', admin: 'System' },
  { id: 7, date: '2024-02-12 10:05', user: 'Jessica Taylor', amount: 100, type: 'add', reason: 'Support Compensation', admin: 'Admin (You)' },
  { id: 8, date: '2024-02-11 15:30', user: 'David Lee', amount: -250, type: 'deduct', reason: 'Poll Creation: Q1 Planning', admin: 'System' },
  { id: 9, date: '2024-02-10 08:45', user: 'Amanda Clark', amount: 2000, type: 'add', reason: 'Monthly Subscription Renew', admin: 'System' },
  { id: 10, date: '2024-02-09 11:20', user: 'Amanda Clark', amount: -500, type: 'deduct', reason: 'Bulk Email Campaign', admin: 'System' },
];

export default function CreditsManagementPage() {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  
  const handleAddCredits = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would go here
    alert(`Added ${amount} credits to ${selectedUser} for: ${reason}`);
    setAmount('');
    setReason('');
    setSelectedUser('');
  };

  return (
    <div className="min-h-screen bg-[#0F0D1A] text-slate-200 p-6 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Credit Management
        </h1>
        <p className="text-slate-400 mt-2">Monitor system economy and manually allocate credits</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Add Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Coins className="w-5 h-5 mr-2 text-indigo-400" />
              Quick Add Credits
            </h2>
            
            <form onSubmit={handleAddCredits} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Select User</label>
                <div className="relative">
                  <select 
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white appearance-none"
                    required
                  >
                    <option value="" disabled className="bg-[#1A1730]">Search or select user...</option>
                    <option value="Alex Johnson" className="bg-[#1A1730]">Alex Johnson (alex@example.com)</option>
                    <option value="Sarah Smith" className="bg-[#1A1730]">Sarah Smith (sarah@example.com)</option>
                    <option value="Mike Brown" className="bg-[#1A1730]">Mike Brown (mike@example.com)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                    min="1"
                  />
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Reason / Note</label>
                <input 
                  type="text" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Support resolution"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center"
              >
                Issue Credits <ArrowUpRight className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 font-medium">Processed By</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {tx.user}
                    </td>
                    <td className="px-6 py-4 font-bold whitespace-nowrap">
                      {tx.type === 'add' ? (
                        <span className="text-emerald-400 flex items-center">
                          +{tx.amount} <ArrowUpRight className="w-3 h-3 ml-1" />
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center">
                          {tx.amount} <ArrowDownRight className="w-3 h-3 ml-1" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {tx.reason}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        tx.admin.includes('System') ? 'bg-slate-500/10 text-slate-400' : 'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {tx.admin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
