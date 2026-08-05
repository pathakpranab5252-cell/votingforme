'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Search, 
  Mail, 
  StopCircle, 
  BarChart3, 
  ChevronLeft, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_POLL = {
  id: '123',
  title: 'Annual Board of Directors Election 2025',
  status: 'active',
  totalVoters: 100,
  votesCast: 73,
  participationRate: 73,
  timeRemaining: 'Manual Close',
};

const TIMELINE_EVENTS = [
  { id: 1, title: 'Election Created', time: 'Aug 1, 2025, 10:00 AM', status: 'completed' },
  { id: 2, title: 'Invitations Sent', time: 'Aug 1, 2025, 10:05 AM (100 emails)', status: 'completed' },
  { id: 3, title: 'Voting Started', time: 'Aug 1, 2025, 10:05 AM', status: 'completed' },
  { id: 4, title: 'Reminder Sent', time: 'Scheduled (15 min before close)', status: 'in-progress' },
  { id: 5, title: 'Voting Closed', time: 'Pending', status: 'pending' },
  { id: 6, title: 'Results Published', time: 'Pending', status: 'pending' },
];

const VOTERS_DATA = [
  { id: '1', name: 'Alice Smith', email: 'alice.smith@example.com', status: 'voted', votedAt: 'Aug 2, 2025, 09:12 AM' },
  { id: '2', name: 'Bob Jones', email: 'bob.j@example.com', status: 'voted', votedAt: 'Aug 2, 2025, 11:45 AM' },
  { id: '3', name: 'Charlie Davis', email: 'cdavis88@example.com', status: 'not_voted', votedAt: null },
  { id: '4', name: 'Diana Prince', email: 'diana.p@example.com', status: 'voted', votedAt: 'Aug 3, 2025, 02:30 PM' },
  { id: '5', name: 'Evan Wright', email: 'evan.w@example.com', status: 'not_voted', votedAt: null },
  { id: '6', name: 'Fiona Gallagher', email: 'fgallagher@example.com', status: 'voted', votedAt: 'Aug 4, 2025, 08:20 AM' },
  { id: '7', name: 'George Miller', email: 'gmiller@example.com', status: 'not_voted', votedAt: null },
];

import { use, useEffect } from 'react';

export default function PollDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [poll, setPoll] = useState<any>(MOCK_POLL);
  const [voters, setVoters] = useState<any[]>(VOTERS_DATA);
  const [stats, setStats] = useState<any>({
    totalVoters: MOCK_POLL.totalVoters,
    votesCast: MOCK_POLL.votesCast,
    participationRate: MOCK_POLL.participationRate,
  });
  const [activeTab, setActiveTab] = useState<'voted' | 'not_voted'>('voted');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPollDetail() {
      try {
        const res = await fetch(`/api/polls/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.poll) {
            setPoll(data.poll);
          }
          if (data.stats) {
            setStats({
              totalVoters: data.stats.total_voters,
              votesCast: data.stats.voted,
              participationRate: data.stats.participation_rate,
            });
          }
          if (data.voter_list && data.voter_list.length > 0) {
            const mappedVoters = data.voter_list.map((v: any) => ({
              id: v.id,
              name: v.name || 'Anonymous Voter',
              email: v.email,
              status: v.has_voted ? 'voted' : 'not_voted',
              votedAt: v.has_voted ? 'Recorded' : null,
            }));
            setVoters(mappedVoters);
          }
        }
      } catch (err) {
        console.warn('Using mock poll detail fallback:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPollDetail();
  }, [id]);

  const filteredVoters = voters.filter(voter => 
    voter.status === activeTab && 
    (voter.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     voter.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0F0D1A] text-slate-200 font-sans p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link href="/dashboard/polls" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Polls
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{poll.title}</h1>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-medium text-sm capitalize">{poll.status ? poll.status.replace('_', ' ') : 'Voting Open'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                <Mail className="w-4 h-4 text-slate-300" />
                Send Reminder
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-sm font-medium transition-colors">
                <StopCircle className="w-4 h-4" />
                Close Voting
              </button>
              <Link 
                href={`/dashboard/polls/${poll.id}/results`}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              >
                <BarChart3 className="w-4 h-4" />
                View Results
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Voters', value: stats.totalVoters, icon: Users, color: 'text-blue-400' },
            { label: 'Votes Cast', value: stats.votesCast, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Participation Rate', value: `${stats.participationRate}%`, icon: TrendingUp, color: 'text-violet-400' },
            { label: 'Time Remaining', value: 'Active', icon: Clock, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 flex items-start justify-between"
            >
              <div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Progress & Timeline */}
          <div className="space-y-6">
            
            {/* Participation Progress */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Participation</h3>
                <span className="text-violet-400 font-bold text-xl">{MOCK_POLL.participationRate}%</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${MOCK_POLL.participationRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                />
              </div>
              <p className="text-sm text-slate-400 text-right">
                {MOCK_POLL.votesCast} / {MOCK_POLL.totalVoters} voted
              </p>
            </motion.div>

            {/* Election Timeline */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-6">Timeline</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-800">
                {TIMELINE_EVENTS.map((event, i) => (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#0F0D1A] bg-slate-800 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10">
                      {event.status === 'completed' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                      {event.status === 'in-progress' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      {event.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-600" />}
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] pl-4 md:pl-0">
                      <div className={`p-3 rounded-xl border ${
                        event.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10' :
                        event.status === 'in-progress' ? 'bg-amber-500/5 border-amber-500/10' :
                        'bg-white/5 border-white/5'
                      }`}>
                        <p className={`text-sm font-medium ${event.status === 'pending' ? 'text-slate-400' : 'text-slate-200'}`}>
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{event.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Voter Table */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl flex flex-col h-[700px]"
          >
            <div className="p-6 border-b border-white/5">
              <h3 className="font-semibold text-white mb-4">Voter Status</h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex space-x-1 bg-black/20 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('voted')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'voted' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Voted ({MOCK_POLL.votesCast})
                  </button>
                  <button
                    onClick={() => setActiveTab('not_voted')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'not_voted' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Not Yet Voted ({MOCK_POLL.totalVoters - MOCK_POLL.votesCast})
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search voters..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/[0.02] sticky top-0 backdrop-blur-md border-b border-white/5">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Voter</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVoters.length > 0 ? (
                    filteredVoters.map((voter) => (
                      <tr key={voter.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-200">{voter.name}</span>
                            <span className="text-xs text-slate-500">{voter.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {voter.status === 'voted' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Voted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 text-xs font-medium">
                              <Loader2 className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {voter.votedAt || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No voters found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
