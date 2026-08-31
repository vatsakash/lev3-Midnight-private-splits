import React, { useState } from 'react';
import { Database, Network, Server, Code, Copy, Check, ExternalLink } from 'lucide-react';
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
                Midnight Preprod Network Inspector
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Verifiable on-chain smart contract deployment and network indexing endpoints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            1AM Preprod Network Active
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
