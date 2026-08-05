'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  Vote, 
  Coins, 
  Activity, 
  Server, 
  Mail, 
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Users', value: '156', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Active Polls', value: '23', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Total Votes', value: '12,450', icon: Vote, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Revenue (Credits)', value: '8,500', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

const recentUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', date: '2 hrs ago', status: 'Premium' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', date: '5 hrs ago', status: 'Free' },
  { id: 3, name: 'Mike Brown', email: 'mike@example.com', date: '1 day ago', status: 'Active' },
  { id: 4, name: 'Emma Davis', email: 'emma@example.com', date: '1 day ago', status: 'Free' },
  { id: 5, name: 'Chris Wilson', email: 'chris@example.com', date: '2 days ago', status: 'Premium' },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0F0D1A] text-slate-200 p-6 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 mt-2">System overview and quick metrics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <span className="text-xs font-medium text-emerald-400 flex items-center bg-emerald-400/10 px-2 py-1 rounded-full">
                +12% <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Signups</h2>
            <Link href="/admin/users" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center transition-colors">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{user.name}</span>
                        <span className="text-xs text-slate-400">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{user.date}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Premium' ? 'bg-purple-400/10 text-purple-400 border border-purple-400/20' : 
                        user.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
                        'bg-slate-400/10 text-slate-300 border border-slate-400/20'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System Health & Quick Actions */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-400" />
              System Health
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Server className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-sm">API Uptime</span>
                </div>
                <span className="text-sm font-medium text-emerald-400">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Mail className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-sm">Email Delivery</span>
                </div>
                <span className="text-sm font-medium text-emerald-400">98.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Users className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-sm">Active Sessions</span>
                </div>
                <span className="text-sm font-medium text-blue-400">34</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center text-slate-300">
                  <ShieldAlert className="w-4 h-4 mr-3 text-amber-400" />
                  <span className="text-sm">Security Alerts</span>
                </div>
                <span className="text-sm font-medium text-slate-400">0</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/admin/users"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium"
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-3 text-indigo-400" />
                  Manage Users
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
              <Link 
                href="/admin/credits"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium"
              >
                <div className="flex items-center">
                  <Coins className="w-4 h-4 mr-3 text-amber-400" />
                  Add Credits
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
              <Link 
                href="/admin/polls"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium"
              >
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-3 text-emerald-400" />
                  View All Polls
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
