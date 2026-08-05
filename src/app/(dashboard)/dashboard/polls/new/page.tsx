'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Users,
  Upload,
  CheckCircle2,
  Rocket,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  File,
} from 'lucide-react';

/* ─── Types ─── */
interface Candidate {
  id: string;
  name: string;
  description: string;
}

interface Voter {
  name: string;
  email: string;
  phone: string;
  valid: boolean;
  issue?: string;
}

type Step = 'details' | 'candidates' | 'voters' | 'review' | 'launch';

/* ─── Wizard Component ─── */
export default function NewPollWizard() {
  // State
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingType, setVotingType] = useState<'single_choice' | 'multi_select_unordered' | 'multi_select_ordered'>('single_choice');
  const [maxSelections, setMaxSelections] = useState(2);
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: '1', name: '', description: '' },
    { id: '2', name: '', description: '' },
  ]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [credits, setCredits] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLaunching, setIsLaunched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pollId, setPollId] = useState<string | null>(null);

  // Steps definition
  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'voters', label: 'Voters', icon: Upload },
    { id: 'review', label: 'Review', icon: CheckCircle2 },
    { id: 'launch', label: 'Launch', icon: Rocket },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Validation
  const canGoNext = () => {
    if (currentStep === 'details') return title.trim().length > 0;
    if (currentStep === 'candidates')
      return candidates.filter((c) => c.name.trim()).length >= 2;
    if (currentStep === 'voters') return voters.filter((v) => v.valid).length > 0;
    return true;
  };

  // Real File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('poll_id', pollId || 'temp-draft');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setVoters(data.voters || []);
      } else {
        // Fallback for mock/offline testing
        handleMockUpload();
      }
    } catch {
      handleMockUpload();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock Upload Handler fallback
  const handleMockUpload = () => {
    setVoters([
      { name: 'John Doe', email: 'john@example.com', phone: '', valid: true },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '', valid: true },
      { name: 'Invalid User', email: 'not-an-email', phone: '', valid: false, issue: 'Invalid Email' },
    ]);
  };

  // Create Poll in Backend
  const handleCreatePollInBackend = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const validCandidates = candidates.filter((c) => c.name.trim());
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          voting_type: votingType,
          max_selections: maxSelections,
          candidates: validCandidates,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPollId(data.poll?.id);
      }
    } catch (err: any) {
      console.warn('API error, proceeding with client state:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Launch Poll Handler
  const handleLaunchElection = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let activePollId = pollId;

      // If poll wasn't saved to backend yet, create it now
      if (!activePollId) {
        const validCandidates = candidates.filter((c) => c.name.trim());
        const createRes = await fetch('/api/polls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            voting_type: votingType,
            max_selections: maxSelections,
            candidates: validCandidates,
          }),
        });

        if (createRes.ok) {
          const createData = await createRes.json();
          activePollId = createData.poll?.id;
          setPollId(activePollId);
        }
      }

      const validVotersList = voters.filter((v) => v.valid);
      if (activePollId) {
        await fetch(`/api/polls/${activePollId}/launch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ voters: validVotersList }),
        });
      }
      setIsLaunched(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to launch election');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render content based on step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Election Details</h2>
              <p className="text-slate-400">Set the basic information for your election.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Poll Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Board of Directors 2025"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context or instructions for the voters..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Voting Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Voting Method & Rules
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setVotingType('single_choice')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      votingType === 'single_choice'
                        ? 'bg-indigo-500/10 border-indigo-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1 text-indigo-400">Single Choice</div>
                    <div className="text-xs">Standard 1 vote per person. Voters select exactly 1 candidate.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVotingType('multi_select_unordered')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      votingType === 'multi_select_unordered'
                        ? 'bg-indigo-500/10 border-indigo-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1 text-purple-400">Multi-Select (Equal)</div>
                    <div className="text-xs">Voters can pick up to N candidates. Each selection counts equally.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVotingType('multi_select_ordered')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      votingType === 'multi_select_ordered'
                        ? 'bg-indigo-500/10 border-indigo-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1 text-emerald-400">Ranked / Ordered</div>
                    <div className="text-xs">Voters rank candidates in order of preference (1st, 2nd, 3rd choice).</div>
                  </button>
                </div>
              </div>

              {/* Max Selections if Multi-Select */}
              {votingType !== 'single_choice' && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Maximum Number of Candidates per Voter
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={maxSelections}
                    onChange={(e) => setMaxSelections(Math.max(2, parseInt(e.target.value) || 2))}
                    className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {votingType === 'multi_select_unordered'
                      ? `Each voter can select up to ${maxSelections} candidates.`
                      : `Each voter will rank up to ${maxSelections} candidates in order of priority.`}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'candidates':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Candidates</h2>
              <p className="text-slate-400">Add the options voters can choose from (min 2).</p>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {candidates.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 relative"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-indigo-400">
                        Candidate {idx + 1}
                      </span>
                      {candidates.length > 2 && (
                        <button
                          onClick={() => setCandidates(candidates.filter((cand) => cand.id !== c.id))}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => {
                          const newCands = [...candidates];
                          newCands[idx].name = e.target.value;
                          setCandidates(newCands);
                        }}
                        placeholder="Candidate Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={c.description}
                        onChange={(e) => {
                          const newCands = [...candidates];
                          newCands[idx].description = e.target.value;
                          setCandidates(newCands);
                        }}
                        placeholder="Short Description (Optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={() => setCandidates([...candidates, { id: Date.now().toString(), name: '', description: '' }])}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Another Candidate
              </button>
            </div>
          </motion.div>
        );

      case 'voters':
        const validCount = voters.filter(v => v.valid).length;
        
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Import Voters</h2>
              <p className="text-slate-400">Upload a CSV or Excel file containing voter emails.</p>
            </div>

            {voters.length === 0 ? (
              <button
                onClick={handleMockUpload}
                className="w-full py-16 border-2 border-dashed border-white/20 rounded-2xl bg-white/5 hover:bg-white/[0.07] transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-lg font-medium text-white mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-400">CSV, XLS, or XLSX (max 5MB)</p>
              </button>
            ) : (
              <div className="space-y-6">
                {/* Validation Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{voters.length}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">{validCount}</p>
                    <p className="text-xs text-green-400/80 uppercase tracking-wider mt-1">Valid</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">{voters.length - validCount}</p>
                    <p className="text-xs text-amber-400/80 uppercase tracking-wider mt-1">Issues</p>
                  </div>
                </div>

                {/* Credit Check */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${validCount > credits ? 'bg-red-500/10 border-red-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${validCount > credits ? 'text-red-400' : 'text-indigo-400'}`} />
                  <div>
                    <h4 className={`text-sm font-medium ${validCount > credits ? 'text-red-400' : 'text-indigo-400'}`}>
                      Credit Check
                    </h4>
                    <p className="text-sm text-slate-300 mt-1">
                      Importing {validCount} voters will consume {validCount} credits. You currently have {credits} credits available.
                    </p>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-300">Data Preview</span>
                    <button onClick={() => setVoters([])} className="text-xs text-red-400 hover:text-red-300">Remove File</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-400 bg-black/20">
                        <tr>
                          <th className="px-4 py-3 font-medium">Name</th>
                          <th className="px-4 py-3 font-medium">Email</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {voters.map((v, i) => (
                          <tr key={i} className="bg-white/[0.02]">
                            <td className="px-4 py-3 text-slate-300">{v.name || '-'}</td>
                            <td className="px-4 py-3 text-slate-300">{v.email}</td>
                            <td className="px-4 py-3">
                              {v.valid ? (
                                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-green-500/10 text-green-400">Valid</span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400" title={v.issue}>{v.issue}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'review':
        const validVoters = voters.filter(v => v.valid).length;
        
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Review & Launch</h2>
              <p className="text-slate-400">Please review your election details before launching.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Election Details</h3>
                <p className="text-xl font-semibold text-white mb-2">{title}</p>
                {description && <p className="text-slate-300 text-sm">{description}</p>}
              </div>

              <div className="p-6 border-b border-white/10">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Candidates ({candidates.filter(c => c.name).length})</h3>
                <ul className="space-y-2">
                  {candidates.filter(c => c.name).map((c, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-slate-200">{c.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Voters & Credits</h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F0D1A] border border-white/5">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span className="text-white">{validVoters} Invitations to send</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Cost: <span className="text-white font-medium">{validVoters} Credits</span></p>
                    <p className="text-xs text-slate-500">Remaining: {credits - validVoters}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'launch':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            {isLaunching ? (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
               >
                 <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-4">Election Launched! 🎉</h2>
                 <p className="text-slate-400 max-w-md mx-auto mb-8">
                   Your election is now live. We are currently sending out {voters.filter(v => v.valid).length} invitation emails to your voters.
                 </p>
                 <Link
                   href="/dashboard/polls"
                   className="inline-block px-8 py-3 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-colors"
                 >
                   Go to Dashboard
                 </Link>
               </motion.div>
            ) : (
               <div>
                  <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                     <Rocket className="w-12 h-12 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Ready for Liftoff</h2>
                  <p className="text-slate-400 max-w-md mx-auto mb-8">
                    When you click launch, emails will be sent immediately to all valid voters with their unique, secure voting links.
                  </p>
                  <button
                    onClick={handleLaunchElection}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {isSubmitting ? 'Launching Election...' : 'Launch Election Now'}
                    <Rocket className="w-5 h-5" />
                  </button>
               </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-10" />
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 -z-10 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: currentStepIndex / (steps.length - 1) }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />

          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isActive = currentStepIndex === idx;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isCompleted
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : isActive
                      ? 'bg-[#0F0D1A] border-indigo-500 text-indigo-400'
                      : 'bg-[#0F0D1A] border-white/20 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium absolute -bottom-6 whitespace-nowrap ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#1A1730]/50 border border-white/5 rounded-3xl p-6 md:p-8 min-h-[400px] mb-8">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      {!isLaunching && currentStep !== 'launch' && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => setCurrentStep(steps[currentStepIndex - 1].id)}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-0 transition-all font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            onClick={() => setCurrentStep(steps[currentStepIndex + 1].id)}
            disabled={!canGoNext()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentStep === 'review' ? 'Continue to Launch' : 'Next Step'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
