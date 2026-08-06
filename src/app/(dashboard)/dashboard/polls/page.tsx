'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  Search,
  Vote,
  Users,
  Calendar,
  ChevronRight,
  BarChart3,
  FileEdit,
  Eye,
  Inbox,
} from 'lucide-react';

/* ─── Types ─── */
type PollStatus = 'draft' | 'active' | 'voting_open' | 'closed' | 'published';

interface Poll {
  id: string;
  title: string;
  status: PollStatus;
  totalVoters: number;
  votedCount: number;
  createdAt: string;
  endTime?: string;
}

/* ─── Mock Data ─── */
const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'Board of Directors Election 2025',
    status: 'voting_open',
    totalVoters: 100,
    votedCount: 73,
    createdAt: 'Aug 1, 2025',
    endTime: 'Aug 5, 2025',
  },
  {
    id: '2',
    title: 'Annual General Meeting Resolution',
    status: 'published',
    totalVoters: 250,
    votedCount: 198,
    createdAt: 'Jul 15, 2025',
  },
  {
    id: '3',
    title: 'Committee Member Selection',
    status: 'draft',
    totalVoters: 50,
    votedCount: 0,
    createdAt: 'Aug 3, 2025',
  },
  {
    id: '4',
    title: 'Budget Approval Vote Q3',
    status: 'closed',
    totalVoters: 75,
    votedCount: 62,
    createdAt: 'Jun 20, 2025',
  },
  {
    id: '5',
    title: 'Office Location Preference Poll',
    status: 'active',
    totalVoters: 30,
    votedCount: 12,
    createdAt: 'Aug 4, 2025',
    endTime: 'Aug 10, 2025',
  },
];

/* ─── Status Config ─── */
const statusConfig: Record<PollStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-slate-400', bg: 'bg-slate-400/10' },
  active: { label: 'Active', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  voting_open: { label: 'Voting Open', color: 'text-green-400', bg: 'bg-green-400/10' },
  closed: { label: 'Closed', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  published: { label: 'Published', color: 'text-purple-400', bg: 'bg-purple-400/10' },
};

const tabs: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Voting Open', value: 'voting_open' },
  { label: 'Closed', value: 'closed' },
  { label: 'Published', value: 'published' },
];

export default function PollsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPolls() {
      try {
        const res = await fetch('/api/polls');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.polls)) {
            const mappedPolls = data.polls.map((p: any) => ({
              id: p.id,
              title: p.title,
              status: p.status || 'draft',
              totalVoters: p.voters?.length || p.credits_consumed || 0,
              votedCount: p.voters?.filter((v: any) => v.has_voted).length || 0,
              createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Today',
              endTime: p.end_time ? new Date(p.end_time).toLocaleDateString() : undefined,
            }));
            setPolls(mappedPolls);
          }
        }
      } catch (err) {
        console.warn('Error fetching polls:', err);
        setPolls([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPolls();
  }, []);

  const filtered = polls.filter((p) => {
    const matchTab = activeTab === 'all' || p.status === activeTab;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">My Polls</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage and monitor all your elections
          </p>
        </div>
        <Link
          href="/dashboard/polls/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Poll
        </Link>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search polls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.value
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Poll Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((poll, i) => {
            const status = statusConfig[poll.status];
            const progress =
              poll.totalVoters > 0
                ? Math.round((poll.votedCount / poll.totalVoters) * 100)
                : 0;

            return (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/15 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {poll.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                      >
                        {poll.status === 'voting_open' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
                        )}
                        {status.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {poll.createdAt}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {poll.totalVoters} voters
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Vote className="w-4 h-4" />
                        {poll.votedCount} voted
                      </span>
                    </div>

                    {/* Progress bar */}
                    {poll.status !== 'draft' && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-slate-400 font-mono w-10">
                          {progress}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    {poll.status === 'draft' && (
                      <Link
                        href={`/dashboard/polls/${poll.id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all text-sm"
                      >
                        <FileEdit className="w-4 h-4" />
                        Edit
                      </Link>
                    )}
                    {poll.status === 'published' && (
                      <Link
                        href={`/dashboard/polls/${poll.id}/results`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all text-sm"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Results
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/polls/${poll.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm group-hover:bg-indigo-500/10 group-hover:text-indigo-400"
                    >
                      <Eye className="w-4 h-4" />
                      View
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No polls found
          </h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {search
              ? 'Try a different search term'
              : 'Create your first poll and start collecting votes in minutes.'}
          </p>
          {!search && (
            <Link
              href="/dashboard/polls/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Poll
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
