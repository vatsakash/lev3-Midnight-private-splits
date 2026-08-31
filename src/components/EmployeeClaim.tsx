import React, { useState } from 'react';
import { KeyRound, ShieldCheck, CheckCircle, Zap, AlertCircle, Download, ArrowRight, Lock } from 'lucide-react';
import { LedgerState, PrivateSalarySplit, LaceWalletState } from '../midnight/types';
import { MidnightPayrollEngine } from '../midnight/payrollSimulator';

interface EmployeeClaimProps {
  ledgerState: LedgerState;
  privateSplits: PrivateSalarySplit[];
  walletState: LaceWalletState;
  onRefresh: () => void;
}

export const EmployeeClaim: React.FC<EmployeeClaimProps> = ({
  ledgerState,
  privateSplits,
  walletState,
  onRefresh,
}) => {
  const engine = MidnightPayrollEngine.getInstance();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [claimMessage, setClaimMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; txHash?: string } | null>(null);

  const handleClaim = async (splitId: string) => {
    if (!walletState.isConnected) {
      setClaimMessage({ type: 'error', text: 'Please connect your 1AM wallet to claim.' });
      return;
    }

    if (!ledgerState.isFinalized) {
      setClaimMessage({ type: 'error', text: 'Payroll batch is not finalized yet by the employer.' });
      return;
    }

    setIsClaiming(true);
    setClaimMessage({
      type: 'info',
      text: 'Generating zero-knowledge entitlement proof for claim_payout circuit...',
    });

    try {
      const proofLog = await engine.claimPayout(splitId);
      setClaimMessage({
        type: 'success',
        text: 'Payout claimed successfully! ZK proof verified on Midnight Preview.',
        txHash: proofLog.txHash,
      });
      onRefresh();
    } catch (err: any) {
      setClaimMessage({ type: 'error', text: err.message || 'Claim failed' });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleQuickFinalize = async () => {
    setIsFinalizing(true);
    setClaimMessage({ type: 'info', text: 'Finalizing payroll batch on Midnight Preview...' });
    try {
      await engine.finalizePayroll();
      setClaimMessage({
        type: 'success',
        text: 'Batch finalized! Recipient payout claims are now unlocked.',
      });
      onRefresh();
    } catch (err: any) {
      setClaimMessage({ type: 'error', text: err.message || 'Finalization failed' });
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#10172A] via-cyan-950/20 to-[#10172A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Employee Payout Portal</h2>
              <p className="text-sm text-slate-300 mt-1">
                Claim your private salary split using your zero-knowledge entitlement proof. No one else can trace your payout amount or link your wallet address to other employees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Pending Finalization Banner */}
      {!ledgerState.isFinalized && privateSplits.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Batch Status: Pending Finalization</h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                The employer must finalize the batch before employee payout claims can be executed on-chain.
              </p>
            </div>
          </div>

          <button
            onClick={handleQuickFinalize}
            disabled={isFinalizing || ledgerState.totalAllocatedAmount !== ledgerState.totalBudget}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition disabled:opacity-40 shrink-0"
          >
            {isFinalizing ? 'Finalizing...' : 'Finalize Batch Now'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Status Message */}
      {claimMessage && (
        <div
          className={`p-4 rounded-xl flex flex-col gap-2 text-sm ${
            claimMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
              : claimMessage.type === 'error'
              ? 'bg-red-950/60 border border-red-500/30 text-red-300'
              : 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {claimMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {claimMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {claimMessage.type === 'info' && <Zap className="w-5 h-5 text-cyan-400 animate-bounce" />}
              <span>{claimMessage.text}</span>
            </div>
            <button onClick={() => setClaimMessage(null)} className="text-xs opacity-70 hover:opacity-100">
              Dismiss
            </button>
          </div>
          {claimMessage.txHash && (
            <div className="text-xs font-mono bg-[#090D16] p-2 rounded border border-emerald-800/40 text-emerald-400 flex items-center justify-between">
              <span>On-Chain Tx Hash: {claimMessage.txHash}</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">Verified</span>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Available Claims */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Your Encrypted Entitlements</h3>
              <span className="text-xs text-slate-400 font-mono">
                Batch Status: {ledgerState.isFinalized ? 'Finalized (Unlocked)' : 'Pending Finalization (Locked)'}
              </span>
            </div>

            {privateSplits.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No salary splits available in current batch. Employer must initialize and commit splits first.
              </div>
            ) : (
              <div className="space-y-4">
                {privateSplits.map((split) => (
                  <div
                    key={split.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      split.isClaimed
                        ? 'bg-[#10172A]/50 border-slate-800 opacity-80'
                        : ledgerState.isFinalized
                        ? 'bg-[#10172A] border-indigo-500/30 hover:border-indigo-500/60 shadow-lg shadow-indigo-950/20'
                        : 'bg-[#10172A]/70 border-amber-500/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">{split.recipientName}</h4>
                          {split.isClaimed ? (
                            <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                              Claimed
                            </span>
                          ) : ledgerState.isFinalized ? (
                            <span className="bg-cyan-950 text-cyan-300 text-[10px] px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-semibold">
                              Ready to Claim
                            </span>
                          ) : (
                            <span className="bg-amber-950 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                              Pending Finalization
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          Commitment: {split.commitment.slice(0, 24)}...
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Salary Payout</div>
                          <div className="text-lg font-bold text-cyan-400 font-mono">
                            {split.salaryAmount.toLocaleString()} <span className="text-xs font-normal">tNIGHT</span>
                          </div>
                        </div>

                        {!split.isClaimed && (
                          <button
                            onClick={() => handleClaim(split.id)}
                            disabled={isClaiming || !ledgerState.isFinalized}
                            className="purple-glow-btn px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 disabled:opacity-40"
                            title={!ledgerState.isFinalized ? 'Batch must be finalized by employer first' : 'Execute ZK Claim'}
                          >
                            <Download className="w-4 h-4" />
                            {isClaiming ? 'Proving...' : 'Claim Payout'}
                          </button>
                        )}
                      </div>
                    </div>

                    {split.isClaimed && split.claimedTxHash && (
                      <div className="mt-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                        <span>Nullifier Verified</span>
                        <span className="text-emerald-400">{split.claimedTxHash.slice(0, 20)}...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: ZK Proof Explanation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Privacy Assurance
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                When you click <strong className="text-cyan-300">Claim Payout</strong>, your browser executes a local Midnight zero-knowledge circuit (`claim_payout`).
              </p>
              <div className="p-3 bg-[#090D16] rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 space-y-1">
                <div>Public Input: Commitment Hash</div>
                <div>Witness: Private Secret Key</div>
                <div>Output: Valid Claim Proof</div>
              </div>
              <p>
                The Midnight blockchain verifies that your secret key corresponds to a valid salary commitment without learning your identity, your secret key, or your salary amount.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
