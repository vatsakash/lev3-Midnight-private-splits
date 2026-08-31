import React, { useState } from 'react';
import { Plus, ShieldCheck, Lock, DollarSign, CheckCircle2, AlertCircle, ArrowRight, Zap, EyeOff, RefreshCw } from 'lucide-react';
import { LedgerState, PrivateSalarySplit, LaceWalletState } from '../midnight/types';
import { MidnightPayrollEngine } from '../midnight/payrollSimulator';

interface AdminPayrollProps {
  ledgerState: LedgerState;
  privateSplits: PrivateSalarySplit[];
  walletState: LaceWalletState;
  onRefresh: () => void;
}

export const AdminPayroll: React.FC<AdminPayrollProps> = ({
  ledgerState,
  privateSplits,
  walletState,
  onRefresh,
}) => {
  const engine = MidnightPayrollEngine.getInstance();

  // Form states
  const [initBudgetInput, setInitBudgetInput] = useState('50000');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [salaryInput, setSalaryInput] = useState('');
  
  // Loading & notification states
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletState.isConnected) {
      setStatusMessage({ type: 'error', text: 'Please connect your Lace wallet first.' });
      return;
    }
    const budget = BigInt(initBudgetInput || '0');
    if (budget <= 0n) {
      setStatusMessage({ type: 'error', text: 'Total budget must be greater than zero.' });
      return;
    }

    setIsInitializing(true);
    setStatusMessage({ type: 'info', text: 'Generating initialize_payroll ZK proof & submitting transaction...' });

    try {
      await engine.initializePayroll(walletState.address || 'mn_addr_test_admin', budget);
      setStatusMessage({ type: 'success', text: `Payroll initialized on-chain with ${budget.toString()} tNIGHT total budget.` });
      onRefresh();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Initialization failed' });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAddSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletState.isConnected) {
      setStatusMessage({ type: 'error', text: 'Please connect your Lace wallet first.' });
      return;
    }
    if (ledgerState.totalBudget === 0n) {
      setStatusMessage({ type: 'error', text: 'Please initialize a payroll batch first.' });
      return;
    }
    if (ledgerState.isFinalized) {
      setStatusMessage({ type: 'error', text: 'Batch is already finalized.' });
      return;
    }

    const amount = BigInt(salaryInput || '0');
    if (amount <= 0n) {
      setStatusMessage({ type: 'error', text: 'Salary amount must be greater than 0.' });
      return;
    }

    setIsCommitting(true);
    setStatusMessage({
      type: 'info',
      text: 'Executing commit_salary_split circuit — proving budget conservation without exposing salary on-chain...',
    });

    try {
      const addr = recipientAddress.trim() || `mn_addr_test_${Math.random().toString(36).substring(7)}`;
      const name = recipientName.trim() || `Employee ${privateSplits.length + 1}`;
      await engine.commitSalarySplit(name, addr, amount);
      
      setRecipientName('');
      setRecipientAddress('');
      setSalaryInput('');
      setStatusMessage({
        type: 'success',
        text: `Private split committed! Zero-knowledge proof created for ${amount.toString()} tNIGHT allocation.`,
      });
      onRefresh();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to commit split' });
    } finally {
      setIsCommitting(false);
    }
  };

  const handleFinalizeBatch = async () => {
    setIsFinalizing(true);
    setStatusMessage({ type: 'info', text: 'Executing finalize_payroll circuit on Midnight Preview...' });

    try {
      await engine.finalizePayroll();
      setStatusMessage({
        type: 'success',
        text: 'Payroll batch finalized on-chain! Recipient claims are now unlocked.',
      });
      onRefresh();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Finalization failed' });
    } finally {
      setIsFinalizing(false);
    }
  };

  const remainingBudget = ledgerState.totalBudget - ledgerState.totalAllocatedAmount;
  const progressPercent = ledgerState.totalBudget > 0n
    ? Number((ledgerState.totalAllocatedAmount * 100n) / ledgerState.totalBudget)
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner: Privacy Guarantee */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-[#10172A] to-cyan-950/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Employer Dashboard: Zero-Knowledge Payroll Splits
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl mt-1">
                Distribute company payroll with complete privacy. On-chain observers can only verify total budget conservation. Individual employee salaries and identities are strictly encrypted off-chain.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#090D16] px-4 py-2.5 rounded-xl border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
            <div className="text-xs font-mono">
              <div className="text-slate-400">Circuit Status</div>
              <div className="text-cyan-400 font-semibold">Minokawa Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-red-950/60 border border-red-500/30 text-red-300'
              : 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
            {statusMessage.type === 'info' && <Zap className="w-5 h-5 text-cyan-400 animate-bounce" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Batch Locked Guidance Banner */}
      {ledgerState.isFinalized && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Payroll Batch Locked & Finalized On-Chain!</h4>
              <p className="text-xs text-emerald-300/80 mt-1">
                The ZK salary split commitments are now locked on Midnight Preview. Here is what you can do next:
              </p>
              <ul className="text-xs text-emerald-200/90 mt-2 space-y-1 font-mono list-disc list-inside">
                <li>Go to <strong>Employee Claim</strong> tab to claim private payouts.</li>
                <li>Go to <strong>Selective Disclosure</strong> tab to run compliance audit reports.</li>
                <li>Click <strong>New Batch</strong> in the top header (or use button on right) to start a new batch.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => {
              engine.resetDemoData();
              onRefresh();
            }}
            className="purple-glow-btn px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Start New Batch
          </button>
        </div>
      )}

      {/* Grid Layout: Controls & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Step 1 & Step 2 Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Form 1: Initialize Batch */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Initialize Payroll Batch
              </h3>
              {ledgerState.totalBudget > 0n && (
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  Active
                </span>
              )}
            </div>

            <form onSubmit={handleInitialize} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Total Payroll Budget (tNIGHT)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="number"
                    value={initBudgetInput}
                    onChange={(e) => setInitBudgetInput(e.target.value)}
                    disabled={ledgerState.isFinalized}
                    placeholder="e.g. 50000"
                    className="w-full bg-[#090D16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isInitializing || ledgerState.isFinalized}
                className="w-full purple-glow-btn py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isInitializing ? (
                  <>Initializing Circuit...</>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Set Public Budget & Init Batch
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Form 2: Add Private Split */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Add Private Salary Split
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ZK Protected
              </span>
            </div>

            <form onSubmit={handleAddSplit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Employee Name / Label</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  disabled={ledgerState.totalBudget === 0n || ledgerState.isFinalized}
                  placeholder="e.g. Alice Vance (Lead Eng)"
                  className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Recipient Bech32m Address (Optional)</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  disabled={ledgerState.totalBudget === 0n || ledgerState.isFinalized}
                  placeholder="mn_addr_test1q..."
                  className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Private Salary Split (tNIGHT)</label>
                <input
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  disabled={ledgerState.totalBudget === 0n || ledgerState.isFinalized}
                  placeholder="e.g. 15000"
                  className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isCommitting || ledgerState.totalBudget === 0n || ledgerState.isFinalized}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-lg shadow-cyan-900/30"
              >
                {isCommitting ? (
                  <>Proving Circuit...</>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Commit Private Split (ZK Proof)
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Batch Progress, Splits Table & Finalize */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Batch Budget Allocation</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Batch Hash: {ledgerState.batchHash.slice(0, 16)}...
                </p>
              </div>

              {ledgerState.isFinalized ? (
                <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-500/40 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Batch Finalized On-Chain
                </div>
              ) : (
                <button
                  onClick={handleFinalizeBatch}
                  disabled={
                    isFinalizing ||
                    ledgerState.totalBudget === 0n ||
                    remainingBudget !== 0n ||
                    privateSplits.length === 0
                  }
                  className="purple-glow-btn px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 disabled:opacity-40"
                >
                  {isFinalizing ? 'Finalizing...' : 'Finalize & Lock Batch'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#090D16] p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Total Budget</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">
                  {ledgerState.totalBudget.toLocaleString()} <span className="text-xs font-normal">tNIGHT</span>
                </span>
              </div>
              <div className="bg-[#090D16] p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Allocated Sum</span>
                <span className="text-lg font-bold text-indigo-300 font-mono">
                  {ledgerState.totalAllocatedAmount.toLocaleString()} <span className="text-xs font-normal">tNIGHT</span>
                </span>
              </div>
              <div className="bg-[#090D16] p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Unallocated</span>
                <span className="text-lg font-bold text-slate-300 font-mono">
                  {remainingBudget.toLocaleString()} <span className="text-xs font-normal">tNIGHT</span>
                </span>
              </div>
              <div className="bg-[#090D16] p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Recipients</span>
                <span className="text-lg font-bold text-white font-mono">{privateSplits.length}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                <span>Allocation Progress</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full bg-[#090D16] h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Committed Splits Table */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Committed Private Salary Splits</h3>
              <span className="text-xs text-slate-400">
                On-chain view displays hashes only
              </span>
            </div>

            {privateSplits.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No salary splits committed yet. Use the form on the left to add splits.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="pb-3">Recipient</th>
                      <th className="pb-3">On-Chain Commitment Hash</th>
                      <th className="pb-3 text-right">Amount (Private)</th>
                      <th className="pb-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {privateSplits.map((split) => (
                      <tr key={split.id} className="hover:bg-gray-800/30 transition">
                        <td className="py-3 font-medium text-white">
                          <div>{split.recipientName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {split.recipientAddress.slice(0, 16)}...
                          </div>
                        </td>
                        <td className="py-3 font-mono text-indigo-400 text-[11px]">
                          {split.commitment.slice(0, 20)}...
                        </td>
                        <td className="py-3 text-right font-mono text-cyan-300 font-semibold">
                          {split.salaryAmount.toLocaleString()} tNIGHT
                        </td>
                        <td className="py-3 text-center">
                          {split.isClaimed ? (
                            <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Claimed
                            </span>
                          ) : (
                            <span className="bg-amber-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                              Unclaimed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
