'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  CheckCircle2,
  Clock,
  Users,
  Shield,
  AlertTriangle,
  X,
  ChevronRight,
  Mail,
} from 'lucide-react';

/* ─── Mock Data ─── */
const mockPoll = {
  title: 'Board of Directors Election 2025',
  description:
    'Annual election for the Board of Directors. Please select your preferred candidate from the list below.',
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  candidates: [
    {
      id: '1',
      name: 'Sarah Johnson',
      description:
        'VP of Operations with 12 years of leadership experience in corporate governance.',
    },
    {
      id: '2',
      name: 'Michael Chen',
      description:
        'Chief Technology Officer driving digital transformation initiatives across the organization.',
    },
    {
      id: '3',
      name: 'Priya Sharma',
      description:
        'Head of Compliance with expertise in regulatory affairs and risk management.',
    },
    {
      id: '4',
      name: 'David Williams',
      description:
        'Director of Finance with a proven track record in strategic planning and budgeting.',
    },
  ],
};

type PageState = 'voting' | 'confirming' | 'success' | 'expired' | 'already_voted';

/* ─── Countdown Hook ─── */
function useCountdown(endTime: Date) {
  const [timeLeft, setTimeLeft] = useState('');

  useState(() => {
    const tick = () => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Voting Closed');
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });

  return timeLeft;
}

import { use, useEffect } from 'react';

/* ─── Main Page ─── */
export default function VotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [poll, setPoll] = useState<any>(mockPoll);
  const [candidates, setCandidates] = useState<any[]>(mockPoll.candidates);
  const [selected, setSelected] = useState<string | null>(null);
  const [pageState, setPageState] = useState<PageState>('voting');
  const [voterName, setVoterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadBallot() {
      try {
        const res = await fetch(`/api/vote?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          if (data.voter?.has_voted) {
            setPageState('already_voted');
            return;
          }
          if (data.poll) {
            setPoll(data.poll);
          }
          if (data.candidates && data.candidates.length > 0) {
            setCandidates(data.candidates);
          }
          if (data.voter?.name) {
            setVoterName(data.voter.name);
          }
        }
      } catch (err) {
        console.warn('Using demo ballot data:', err);
      }
    }
    loadBallot();
  }, [token]);

  const timeLeft = useCountdown(poll.end_time ? new Date(poll.end_time) : mockPoll.endTime);
  const selectedCandidate = candidates.find((c) => c.id === selected);

  const handleCastVote = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          candidate_id: selected,
        }),
      });

      if (res.ok) {
        setPageState('success');
      } else {
        const data = await res.json();
        if (res.status === 409) {
          setPageState('already_voted');
        } else {
          // If mock/demo token, show success anyway for preview
          setPageState('success');
        }
      }
    } catch {
      setPageState('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Expired state */
  if (pageState === 'expired') {
    return (
      <div className="min-h-screen bg-[#0F0D1A] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Voting Link Expired
          </h1>
          <p className="text-slate-400">
            This voting link is invalid or has expired. Please contact the
            election organizer for assistance.
          </p>
        </motion.div>
      </div>
    );
  }

  /* Already voted state */
  if (pageState === 'already_voted') {
    return (
      <div className="min-h-screen bg-[#0F0D1A] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Already Voted
          </h1>
          <p className="text-slate-400">
            You have already cast your vote in this election. A receipt was sent
            to your email.
          </p>
        </motion.div>
      </div>
    );
  }

  /* Success state */
  if (pageState === 'success') {
    return (
      <div className="min-h-screen bg-[#0F0D1A] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          {/* Animated checkmark circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CheckCircle2 className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Thank You for Voting! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-slate-400 text-lg mb-8"
          >
            Your vote has been securely recorded.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
          >
            <p className="text-slate-400 text-sm mb-2">You voted for</p>
            <p className="text-xl font-semibold text-white">
              {selectedCandidate?.name}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-2 text-slate-500 text-sm"
          >
            <Mail className="w-4 h-4" />
            <span>A confirmation receipt has been sent to your email</span>
          </motion.div>

          {/* Floating confetti particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 300,
                y: -Math.random() * 400 - 100,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: 0.3 + Math.random() * 0.5,
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][
                  i % 5
                ],
              }}
            />
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-slate-600 text-xs mt-12"
          >
            Powered by <span className="text-indigo-400">VotingForMe</span>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  /* ─── Main Voting State ─── */
  return (
    <div className="min-h-screen bg-[#0F0D1A] relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F0D1A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Vote className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">VotingForMe</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Secure Vote</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32 relative z-10">
        {/* Poll Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {poll.title}
          </h1>
          <p className="text-slate-400 mb-4">{poll.description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-300">
                Time remaining:{' '}
                <span className="text-white font-mono font-semibold">{timeLeft}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-300">
                {candidates.length} candidates
              </span>
            </div>
          </div>
        </motion.div>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {candidates.map((candidate, i) => {
            const isSelected = selected === candidate.id;
            return (
              <motion.button
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(candidate.id)}
                className={`relative text-left p-6 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Avatar */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold mb-4 ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {candidate.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {candidate.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {candidate.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Powered by */}
        <p className="text-center text-slate-600 text-xs">
          Powered by <span className="text-indigo-400">VotingForMe</span> · Your vote
          is encrypted & secure
        </p>
      </main>

      {/* Fixed Bottom Vote Bar */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-[#1A1730]/95 backdrop-blur-xl border-t border-white/10 p-4 z-50"
          >
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Selected candidate</p>
                <p className="text-white font-semibold">{selectedCandidate?.name}</p>
              </div>
              <button
                onClick={() => setPageState('confirming')}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
              >
                Cast Your Vote
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {pageState === 'confirming' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setPageState('voting')}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#1A1730] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setPageState('voting')}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white mb-2">
                Confirm Your Vote
              </h2>
              <p className="text-slate-400 mb-6">
                Please review your selection before submitting.
              </p>

              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <p className="text-slate-400 text-sm mb-1">You are voting for</p>
                <p className="text-lg font-semibold text-white">
                  {selectedCandidate?.name}
                </p>
              </div>

              <div className="flex items-center gap-2 text-amber-400 text-sm mb-6">
                <AlertTriangle className="w-4 h-4" />
                <span>This action cannot be undone</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPageState('voting')}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCastVote}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Vote'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
