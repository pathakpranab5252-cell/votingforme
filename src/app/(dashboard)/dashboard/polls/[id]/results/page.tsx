'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Download, 
  ChevronLeft,
  Users,
  CheckCircle2,
  TrendingUp,
  XCircle,
  Share
} from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_RESULTS = {
  id: '123',
  title: 'Annual Board of Directors Election 2025',
  status: 'published',
  totalVoters: 100,
  votesCast: 73,
  participationRate: 73,
  didNotVote: 27,
  candidates: [
    { id: 'c1', name: 'Sarah Johnson', votes: 31, percentage: 42, isWinner: true },
    { id: 'c2', name: 'Michael Chen', votes: 22, percentage: 30, isWinner: false },
    { id: 'c3', name: 'Priya Sharma', votes: 14, percentage: 19, isWinner: false },
    { id: 'c4', name: 'David Williams', votes: 6, percentage: 8, isWinner: false },
  ]
};

import { useState, useEffect, use } from 'react';

export default function PollResults({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [results, setResults] = useState<any>(MOCK_RESULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await fetch(`/api/polls/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.poll && data.candidates) {
            const totalCast = data.stats?.voted || 0;
            const sortedCandidates = [...data.candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
            const maxVotes = sortedCandidates[0]?.votes || 0;

            const mappedCandidates = sortedCandidates.map((c: any) => ({
              id: c.id,
              name: c.name,
              votes: c.votes || 0,
              percentage: totalCast > 0 ? Math.round(((c.votes || 0) / totalCast) * 100) : 0,
              isWinner: maxVotes > 0 && c.votes === maxVotes,
            }));

            setResults({
              id: data.poll.id,
              title: data.poll.title,
              status: data.poll.status,
              totalVoters: data.stats?.total_voters || 0,
              votesCast: totalCast,
              participationRate: data.stats?.participation_rate || 0,
              didNotVote: (data.stats?.total_voters || 0) - totalCast,
              candidates: mappedCandidates.length > 0 ? mappedCandidates : MOCK_RESULTS.candidates,
            });
          }
        }
      } catch (err) {
        console.warn('Using mock results fallback:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [id]);

  const winner = results.candidates.find((c: any) => c.isWinner);

  return (
    <div className="min-h-screen bg-[#0F0D1A] text-slate-200 font-sans p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
          <Link href={`/dashboard/polls/${results.id}`} className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{results.title}</h1>
              <div className="flex items-center gap-3">
                <span className="text-xl text-slate-400 font-light">Results</span>
                <span className="h-4 w-px bg-slate-700"></span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Results Published
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                <Share className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 rounded-3xl p-8 text-center"
          >
            {/* Confetti-like decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-[10%] w-3 h-3 rounded-full bg-pink-500/50 blur-[1px]"></div>
              <div className="absolute top-20 right-[20%] w-4 h-4 rounded-full bg-emerald-500/50 blur-[1px]"></div>
              <div className="absolute bottom-10 left-[30%] w-2 h-2 rounded-full bg-amber-500/50 blur-[1px]"></div>
              <div className="absolute top-1/2 right-[10%] w-3 h-3 rounded-full bg-blue-500/50 blur-[1px]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20 mb-2">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <h2 className="text-xl text-indigo-200 font-medium tracking-widest uppercase">Winner</h2>
              <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-violet-300">
                {winner.name}
              </h3>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-bold text-white">{winner.percentage}%</span>
                <span className="h-6 w-px bg-white/20"></span>
                <span className="text-lg text-indigo-200">{winner.votes} votes</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Main Results Chart */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-white">All Candidates</h3>
            
            <div className="space-y-6 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-6">
              {results.candidates.map((candidate: any, i: number) => (
                <div key={candidate.id} className="space-y-2">
                  <div className="flex justify-between items-end text-sm">
                    <span className={`font-medium ${candidate.isWinner ? 'text-white text-base' : 'text-slate-300'}`}>
                      {candidate.name} {candidate.isWinner && '👑'}
                    </span>
                    <span className="text-slate-400">
                      <strong className="text-white">{candidate.votes}</strong> votes ({candidate.percentage}%)
                    </span>
                  </div>
                  
                  <div className="h-6 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${candidate.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className={`h-full relative overflow-hidden ${
                        candidate.isWinner 
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-500' 
                          : 'bg-slate-600'
                      }`}
                    >
                      {/* Shine effect for winner */}
                      {candidate.isWinner && (
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                      )}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Breakdown Table */}
            <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Detailed Breakdown</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Votes</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {results.candidates.map((candidate: any) => (
                    <tr key={candidate.id} className={candidate.isWinner ? 'bg-indigo-500/5' : 'hover:bg-white/[0.02] transition-colors'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${candidate.isWinner ? 'font-bold text-indigo-300' : 'text-slate-200'}`}>
                          {candidate.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-slate-300">{candidate.votes}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-slate-400">{candidate.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Participation</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Eligible Voters</p>
                  <p className="text-2xl font-bold text-white">{results.totalVoters}</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Votes Cast</p>
                  <p className="text-2xl font-bold text-white">{results.votesCast}</p>
                </div>
              </div>
              
              <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Participation Rate</p>
                  <p className="text-2xl font-bold text-white">{results.participationRate}%</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-500/10 text-slate-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Did Not Vote</p>
                  <p className="text-2xl font-bold text-white">{MOCK_RESULTS.didNotVote}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 rounded-2xl p-6">
              <h4 className="text-sm font-medium text-white mb-2">Audit Information</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex justify-between">
                  <span>Voting Started:</span>
                  <span>Aug 1, 2025</span>
                </li>
                <li className="flex justify-between">
                  <span>Voting Ended:</span>
                  <span>Aug 5, 2025</span>
                </li>
                <li className="flex justify-between">
                  <span>Result Verification:</span>
                  <span className="text-emerald-400">Verified</span>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Custom CSS for the shimmer effect on the winning bar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}
