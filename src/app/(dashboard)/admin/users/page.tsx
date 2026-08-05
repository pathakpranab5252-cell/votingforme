'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MoreVertical, 
  Star, 
  Coins, 
  ChevronDown, 
  ChevronUp,
  BarChart3,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const initialUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Poll Creator', credits: 450, isPremium: true, joined: '2023-10-12', pollsCreated: 12, votesManaged: 3450 },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Poll Creator', credits: 120, isPremium: false, joined: '2023-11-05', pollsCreated: 3, votesManaged: 890 },
  { id: 3, name: 'Mike Brown', email: 'mike@example.com', role: 'Admin', credits: 9999, isPremium: true, joined: '2023-01-15', pollsCreated: 45, votesManaged: 12500 },
  { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'Poll Creator', credits: 0, isPremium: false, joined: '2024-01-20', pollsCreated: 1, votesManaged: 56 },
  { id: 5, name: 'Chris Wilson', email: 'chris@example.com', role: 'Poll Creator', credits: 850, isPremium: true, joined: '2023-08-30', pollsCreated: 8, votesManaged: 4200 },
  { id: 6, name: 'Jessica Taylor', email: 'jessica@example.com', role: 'Poll Creator', credits: 50, isPremium: false, joined: '2024-02-14', pollsCreated: 0, votesManaged: 0 },
  { id: 7, name: 'David Lee', email: 'david@example.com', role: 'Poll Creator', credits: 320, isPremium: false, joined: '2023-12-01', pollsCreated: 5, votesManaged: 1100 },
  { id: 8, name: 'Amanda Clark', email: 'amanda@example.com', role: 'Poll Creator', credits: 1500, isPremium: true, joined: '2023-05-22', pollsCreated: 24, votesManaged: 8600 },
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
  // Add credits state
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePremium = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setUsers(users.map(u => u.id === id ? { ...u, isPremium: !u.isPremium } : u));
  };

  const handleAddCredits = (e: React.FormEvent, userId: number) => {
    e.preventDefault();
    const amount = parseInt(creditAmount);
    if (!isNaN(amount) && amount > 0) {
      setUsers(users.map(u => u.id === userId ? { ...u, credits: u.credits + amount } : u));
      setCreditAmount('');
      setCreditReason('');
      // In a real app, you'd show a success toast here
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
      setCreditAmount('');
      setCreditReason('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0D1A] text-slate-200 p-6 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-400 mt-2">Manage platform users, roles, and credits</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white w-full md:w-64 placeholder-slate-500 transition-all backdrop-blur-sm"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Credits</th>
                <th className="px-6 py-4 font-medium text-center">Premium</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <tr 
                    onClick={() => toggleExpand(user.id)}
                    className={`border-b border-white/5 hover:bg-white/[0.08] transition-colors cursor-pointer ${expandedRow === user.id ? 'bg-white/[0.05]' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-white flex items-center">
                            {user.name}
                            {user.isPremium && <Star className="w-3.5 h-3.5 text-amber-400 ml-1.5 fill-amber-400" />}
                          </span>
                          <span className="text-xs text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-500/10 text-slate-300 border border-slate-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center font-medium">
                        <Coins className="w-4 h-4 text-amber-400 mr-1.5" />
                        {user.credits.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={(e) => togglePremium(e, user.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0D1A] ${
                          user.isPremium ? 'bg-indigo-500' : 'bg-slate-700'
                        }`}
                      >
                        <span 
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            user.isPremium ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-400">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        {expandedRow === user.id ? 
                          <ChevronUp className="w-5 h-5 text-slate-400" /> : 
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        }
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Content */}
                  <AnimatePresence>
                    {expandedRow === user.id && (
                      <tr>
                        <td colSpan={6} className="p-0 border-b border-white/5">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#1A1730]/50 overflow-hidden"
                          >
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                              
                              {/* User Stats Summary */}
                              <div>
                                <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
                                  <BarChart3 className="w-4 h-4 mr-2 text-indigo-400" />
                                  Platform Usage Summary
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-xs text-slate-400 mb-1">Polls Created</p>
                                    <p className="text-xl font-semibold text-white">{user.pollsCreated}</p>
                                  </div>
                                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-xs text-slate-400 mb-1">Total Votes Managed</p>
                                    <p className="text-xl font-semibold text-white">{user.votesManaged.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <Link href={`/admin/polls?user=${user.id}`} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center">
                                    View user's polls <ChevronRight className="w-4 h-4 ml-1" />
                                  </Link>
                                </div>
                              </div>
                              
                              {/* Add Credits Inline Form */}
                              <div>
                                <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
                                  <Coins className="w-4 h-4 mr-2 text-amber-400" />
                                  Add Credits to Account
                                </h4>
                                <form onSubmit={(e) => handleAddCredits(e, user.id)} className="space-y-3">
                                  <div className="flex gap-3">
                                    <div className="flex-1">
                                      <input 
                                        type="number" 
                                        placeholder="Amount (e.g. 500)" 
                                        value={creditAmount}
                                        onChange={(e) => setCreditAmount(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white text-sm"
                                        required
                                        min="1"
                                      />
                                    </div>
                                    <div className="flex-[2]">
                                      <input 
                                        type="text" 
                                        placeholder="Reason (e.g. Promotional offer)" 
                                        value={creditReason}
                                        onChange={(e) => setCreditReason(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white text-sm"
                                        required
                                      />
                                    </div>
                                    <button 
                                      type="submit"
                                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                      Add
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    Credits will be immediately available to the user for running polls.
                                  </p>
                                </form>
                              </div>
                              
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
