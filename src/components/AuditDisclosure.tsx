import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, FileText, CheckCircle2, Lock, Cpu, Sparkles } from 'lucide-react';
import { LedgerState, SelectiveDisclosureReport } from '../midnight/types';
import { MidnightPayrollEngine } from '../midnight/payrollSimulator';

interface AuditDisclosureProps {
  ledgerState: LedgerState;
}

export const AuditDisclosure: React.FC<AuditDisclosureProps> = ({ ledgerState }) => {
  const engine = MidnightPayrollEngine.getInstance();
  const [auditKey, setAuditKey] = useState('AUDIT-KEY-2026-COMPLIANCE');
  const [isVerifying, setIsVerifying] = useState(false);
  const [report, setReport] = useState<SelectiveDisclosureReport | null>(null);

  const handleGenerateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await engine.generateAuditReport(auditKey);
      setReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#131929] via-purple-950/20 to-[#131929]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30 text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Selective Disclosure & Privacy Verification
              </h2>
              <p className="text-sm text-gray-300 max-w-2xl mt-1">
                Midnight's selective disclosure model allows auditors to mathematically verify compliance claims (e.g., total budget conservation) without exposing sensitive employee identities or individual payout amounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix: What can be observed vs What remains private */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Observable Public Facts */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">What an Observer CAN Learn</h3>
          </div>

          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2 bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300">Total Payroll Budget:</strong> The total funds allocated to the batch ({ledgerState.totalBudget.toString()} tDUST).
              </div>
            </li>
            <li className="flex items-start gap-2 bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300">Budget Conservation Proof:</strong> Proof that <code className="text-purple-300 font-mono">sum(splits) == total_budget</code>.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300">Total Recipient Count:</strong> Number of committed splits ({ledgerState.allocatedCount}).
              </div>
            </li>
            <li className="flex items-start gap-2 bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300">Batch Status:</strong> Whether the batch is initialized, finalized, or claimed.
              </div>
            </li>
          </ul>
        </div>

        {/* Strictly Encrypted Private Facts */}
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">What an Observer CANNOT Learn</h3>
          </div>

          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2 bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300">Individual Salary Amounts:</strong> Observers cannot discover how much any specific employee was paid.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300">Employee Identities & Addresses:</strong> Recipient names and Bech32m wallet addresses are redacted.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300">Salary Split Ratios:</strong> The distribution ratio (e.g. 50/30/20 vs 40/40/20) remains undisclosed.
              </div>
            </li>
            <li className="flex items-start gap-2 bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300">Employee Secret Keys:</strong> Private witnesses never leave the employee's local environment.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Selective Disclosure Verification Tool */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          Auditor Selective Disclosure Generator
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Execute the `disclose_payroll_audit` circuit to generate a verifiable ZK proof for regulatory compliance without leaking employee salaries.
        </p>

        <form onSubmit={handleGenerateAudit} className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={auditKey}
            onChange={(e) => setAuditKey(e.target.value)}
            placeholder="Enter Audit Access Key"
            className="flex-1 bg-[#0B0E17] border border-gray-800 rounded-xl px-4 py-2.5 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isVerifying}
            className="purple-glow-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
          >
            {isVerifying ? 'Generating ZK Report...' : 'Generate Compliance Audit Proof'}
          </button>
        </form>

        {report && (
          <div className="bg-[#0B0E17] p-5 rounded-2xl border border-purple-500/30 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">Audit Verification Status:</span>
              <span className="bg-emerald-950 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                PASSED — ZERO LEAKAGE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 block text-[10px]">VERIFIER HASH</span>
                <span className="text-purple-300 break-all">{report.verifierHash}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">AUDIT TIMESTAMP</span>
                <span className="text-gray-300">{report.timestamp}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">TOTAL ALLOCATED BUDGET</span>
                <span className="text-cyan-400 font-bold">{report.totalAllocated.toString()} tDUST</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">INDIVIDUAL SALARIES EXPOSED</span>
                <span className="text-emerald-400 font-bold">FALSE (PROVEN IN ZK)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
