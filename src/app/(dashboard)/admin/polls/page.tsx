'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BarChart3, 
  Eye, 
  Ban,
  Calendar,
  Users
} from 'lucide-react';
import Link from 'next/link';

const tabs = ['All', 'Active', 'Closed', 'Published'];

// Status colors matching the user dashboard theme
const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  Closed: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  Published: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  Draft: 'bg-amber-400/10 text-amber-400 border-amber-400/20'
};

const mockPolls = [
  { id: '1', title: 'Q1 Product Roadmap Prioritization', creator: 'Alex Johnson', status: 'Active', voters: 145, maxVoters: 200, created: '2024-02-12' },
  { id: '2', title: 'Team Offsite Destination 2024', creator: 'Sarah Smith', status: 'Published', voters: 45, maxVoters: 45, created: '2024-02-10' },
  { id: '3', title: 'New Logo Design Feedback', creator: 'Mike Brown', status: 'Closed', voters: 890, maxVoters: 1000, created: '2024-01-25' },
  { id: '4', title: 'Frontend Framework Selection', creator: 'Alex Johnson', status: 'Active', voters: 32, maxVoters: 50, created: '2024-02-14' },
  { id: '5', title: 'Employee Benefits Survey', creator: 'Emma Davis', status: 'Draft', voters: 0, maxVoters: 500, created: '2024-02-15' },
  { id: '6', title: 'Weekly Townhall Questions', creator: 'Chris Wilson', status: 'Active', voters: 120, maxVoters: null, created: '2024-02-13' },
];

export default function AdminPollsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPolls = mockPolls.filter(poll => {
    const matchesTab = activeTab === 'All' || poll.status === activeTab;
    const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          poll.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0F0D1A] text-slate-200 p-6 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            All Polls
          </h1>
          <p className="text-slate-400 mt-2">System-wide poll monitoring and management</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search polls or creators..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-xl w-fit border border-white/10"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Polls Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-white/[0.02] border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Poll Title</th>
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Voters</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Created Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolls.map((poll) => (
                <tr key={poll.id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white mb-1">{poll.title}</div>
                    <div className="text-xs text-slate-500 font-mono">ID: {poll.id.padStart(6, '0')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{poll.creator}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[poll.status] || statusStyles.Draft}`}>
                      {poll.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-300">
                      <Users className="w-4 h-4 mr-2 text-slate-500" />
                      <span>{poll.voters}</span>
                      {poll.maxVoters && (
                        <span className="text-slate-500 mx-1">/ {poll.maxVoters}</span>
                      )}
                    </div>
                    {poll.maxVoters && (
                      <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${Math.min(100, (poll.voters / poll.maxVoters) * 100)}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-slate-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                      {new Date(poll.created).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {poll.status === 'Active' && (
                        <button className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors" title="Force Close">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredPolls.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-slate-600 mb-3" />
                      <p>No polls found matching your criteria</p>
                    </div>
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
