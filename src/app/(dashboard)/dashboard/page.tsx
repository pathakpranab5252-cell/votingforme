'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Vote, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Upload,
  Calendar,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const stats = [
    { label: 'Total Polls', value: '24', icon: Vote, trend: '+12%', isPositive: true },
    { label: 'Active Polls', value: '3', icon: Clock, trend: 'Stable', isPositive: null },
    { label: 'Total Votes', value: '1,492', icon: Users, trend: '+8.4%', isPositive: true },
    { label: 'Credits Remaining', value: '1,250', icon: CheckCircle2, trend: '-50', isPositive: false },
  ];

  const recentPolls = [
    { id: 1, name: 'Board Election 2025', status: 'Voting Open', statusColor: 'bg-green-500/10 text-green-400 border-green-500/20', voters: 245, date: 'Oct 12, 2025' },
    { id: 2, name: 'Q4 Product Strategy', status: 'Active', statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20', voters: 42, date: 'Oct 10, 2025' },
    { id: 3, name: 'Employee Satisfaction', status: 'Closed', statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20', voters: 189, date: 'Oct 01, 2025' },
  ];

  const activityFeed = [
    { id: 1, message: 'Election "Board Vote 2025" created', time: '2 hours ago', icon: Plus },
    { id: 2, message: '47 invitations sent', time: '1 hour ago', icon: Upload },
    { id: 3, message: '23 votes received', time: '30 minutes ago', icon: Vote },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
          <p className="text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {today}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-medium flex items-center gap-2 transition-all">
            <Upload className="w-4 h-4" />
            Upload Voters
          </button>
          <Link href="/dashboard/create" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4" />
            Create New Poll
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                {stat.isPositive !== null && (
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                    stat.isPositive ? 'text-green-400 bg-green-400/10' : 'text-rose-400 bg-rose-400/10'
                  }`}>
                    {stat.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.trend}
                  </div>
                )}
                {stat.isPositive === null && (
                  <div className="text-xs font-medium text-slate-500 px-2 py-1 rounded-full bg-white/5">
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Polls */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Polls</h2>
            <Link href="/dashboard/polls" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentPolls.map((poll) => (
              <div key={poll.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <Vote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">{poll.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> {poll.voters} voters • {poll.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 justify-between sm:justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${poll.statusColor}`}>
                    {poll.status}
                  </span>
                  <button className="text-slate-500 hover:text-slate-300">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Activity Feed</h2>
          <div className="relative border-l border-white/10 ml-4 space-y-6">
            {activityFeed.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative pl-6">
                  <span className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-[#1A1730] border border-indigo-500/50 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-indigo-400" />
                  </span>
                  <p className="text-sm font-medium text-slate-300">{item.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-6 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors">
            View All Activity
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
