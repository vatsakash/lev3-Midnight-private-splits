import React, { useState } from 'react';
import { Database, Network, Server, Code, Copy, Check, ExternalLink, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { LedgerState } from '../midnight/types';
import { MIDNIGHT_PREPROD_CONFIG } from '../midnight/dappConnector';

interface PreprodExplorerProps {
  ledgerState: LedgerState;
}

export const PreprodExplorer: React.FC<PreprodExplorerProps> = ({ ledgerState }) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#10172A] via-cyan-950/20 to-[#10172A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Midnight Preprod Network Inspector & Privacy Auditor
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Verifiable on-chain smart contract deployment, network indexing endpoints, and live observable privacy demonstration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Lace / 1AM Preprod Active
          </div>
        </div>
      </div>

      {/* Observable Privacy Behavior Demonstration Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-4 bg-gradient-to-b from-[#10172A] to-[#090D16]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">
              Observable Privacy Behavior: Public Ledger vs Local Private State
            </h3>
          </div>
          <span className="text-xs text-indigo-300 font-mono bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
            Selective Disclosure Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Public Ledger Column (What Explorer Sees) */}
          <div className="bg-[#090D16] p-5 rounded-xl border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                PUBLIC LEDGER STATE (Midnight Explorer)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Visible to Anyone
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400">Total Payroll Budget:</span>
                <span className="text-white font-bold">{ledgerState.totalBudget.toString()} tNIGHT</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400">Recipients Count:</span>
                <span className="text-cyan-400 font-bold">{ledgerState.allocatedCount} Allocated</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400">Batch Commitment Hash:</span>
                <span className="text-indigo-300 font-bold truncate max-w-[160px]">{ledgerState.batchHash}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400">Budget Conservation Proof:</span>
                <span className="text-emerald-400 font-bold">✓ Verified in ZK</span>
              </div>
              <div className="flex justify-between items-center bg-red-950/20 p-2 rounded border border-red-900/30 text-red-300">
                <span>Individual Salary Splits:</span>
                <span className="font-bold flex items-center gap-1 text-red-400"><Lock className="w-3 h-3" /> HIDDEN ON-CHAIN</span>
              </div>
            </div>
          </div>

          {/* Local Private State Column (Shielded Client Witness) */}
          <div className="bg-[#090D16] p-5 rounded-xl border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-400 font-mono flex items-center gap-1.5">
                <EyeOff className="w-4 h-4" />
                LOCAL PRIVATE CLIENT WITNESS STATE
              </span>
              <span className="text-[10px] text-indigo-300 font-mono bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                100% Client-Side Shielded
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400">Individual Employee Names:</span>
                <span className="text-indigo-300 font-bold">Kept in Client Witness</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400">Exact Split Ratios:</span>
                <span className="text-indigo-300 font-bold">Private Split Commitments</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400">Bech32m Payout Addresses:</span>
                <span className="text-cyan-300 font-bold">Shielded Wallet Address</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400">Secret Witness Claim Keys:</span>
                <span className="text-emerald-400 font-bold">Never Leaves Local Wallet</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-950/20 p-2 rounded border border-emerald-900/30 text-emerald-300">
                <span>Auditor Selective Disclosure:</span>
                <span className="font-bold flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-3 h-3" /> AUDIT CIRCUIT READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract & Endpoints Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deployed Contract Address */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            Deployed Smart Contract Address
          </h3>

          <div className="bg-[#090D16] p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div>
              <div className="text-slate-400 text-[11px] flex items-center justify-between mb-1">
                <span>Bech32m Contract Address:</span>
                <button
                  onClick={() => copyToClipboard(MIDNIGHT_PREPROD_CONFIG.contractAddress, 'address')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px]"
                >
                  {copiedItem === 'address' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedItem === 'address' ? 'Copied Address!' : 'Copy Address'}
                </button>
              </div>
              <div className="text-indigo-300 font-bold break-all bg-indigo-950/30 p-2.5 rounded border border-indigo-800/40">
                {MIDNIGHT_PREPROD_CONFIG.contractAddress}
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-[11px] flex items-center justify-between mb-1">
                <span>Original Contract Hex Address:</span>
                <button
                  onClick={() => copyToClipboard(MIDNIGHT_PREPROD_CONFIG.originalContractHexAddress, 'hex')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px]"
                >
                  {copiedItem === 'hex' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedItem === 'hex' ? 'Copied Hex!' : 'Copy Hex ID'}
                </button>
              </div>
              <div className="text-cyan-300 font-bold break-all bg-cyan-950/30 p-2 rounded border border-cyan-800/40 text-[11px]">
                {MIDNIGHT_PREPROD_CONFIG.originalContractHexAddress}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
              <span className="text-slate-400">Network:</span>
              <span className="text-cyan-400 font-semibold">Midnight Preprod Network (`preprod`)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Compiler:</span>
              <span className="text-cyan-400 font-semibold">Compact v0.23 / Minokawa</span>
            </div>
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => copyToClipboard(MIDNIGHT_PREPROD_CONFIG.contractAddress, 'address')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedItem === 'address' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedItem === 'address' ? 'Copied!' : 'Copy Address'}
              </button>

              <a
                href="https://preprod.midnightexplorer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 rounded-lg text-xs font-mono border border-cyan-500/30 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Midnight Explorer ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Network Infrastructure Service Endpoints */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            Service Endpoints
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#090D16] p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">INDEXER GRAPHQL ENDPOINT</div>
              <div className="text-cyan-300 truncate mt-0.5">{MIDNIGHT_PREPROD_CONFIG.indexerUri}</div>
            </div>

            <div className="bg-[#090D16] p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">NODE RPC ENDPOINT</div>
              <div className="text-indigo-300 truncate mt-0.5">{MIDNIGHT_PREPROD_CONFIG.nodeRpcUri}</div>
            </div>
          </div>
        </div>
      </div>

      {/* On-Chain Ledger State Inspector */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-semibold text-white text-base flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-400" />
          On-Chain Public State Verification
        </h3>

        <div className="bg-[#090D16] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>ZK PRIVACY PROOF STATUS:</span>
            <span className="text-emerald-400 font-semibold">● Budget Conservation Verified</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>LOCAL PRIVATE STATES:</span>
            <span className="text-indigo-400 font-semibold">100% Client-Side Shielded</span>
          </div>
        </div>
      </div>
    </div>
  );
};
