import React from 'react';
import { Database, Network, Server, Code } from 'lucide-react';
import { LedgerState } from '../midnight/types';
import { MIDNIGHT_PREVIEW_CONFIG } from '../midnight/dappConnector';

interface PreviewExplorerProps {
  ledgerState: LedgerState;
}

export const PreviewExplorer: React.FC<PreviewExplorerProps> = ({ ledgerState }) => {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#131929] via-cyan-950/20 to-[#131929]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Midnight Preview Network Inspector
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                Verifiable on-chain smart contract deployment and network indexing endpoints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            1AM Preview Network Active
          </div>
        </div>
      </div>

      {/* Contract & Endpoints Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deployed Contract Address */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            Deployed Smart Contract Address
          </h3>

          <div className="bg-[#0B0E17] p-4 rounded-xl border border-gray-800 space-y-2 font-mono text-xs">
            <div className="text-gray-400 text-[11px]">Bech32m Contract Address:</div>
            <div className="text-purple-300 font-bold break-all bg-purple-950/30 p-2.5 rounded border border-purple-800/40">
              {MIDNIGHT_PREVIEW_CONFIG.contractAddress}
            </div>
            <div className="text-gray-400 text-[11px] pt-1">Original Contract Hex Address:</div>
            <div className="text-cyan-300 font-bold break-all bg-cyan-950/30 p-2 rounded border border-cyan-800/40 text-[11px]">
              {MIDNIGHT_PREVIEW_CONFIG.originalContractHexAddress}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-gray-400">Network:</span>
              <span className="text-cyan-400 font-semibold">Midnight Preview Network (`preview`)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400">Compiler:</span>
              <span className="text-cyan-400 font-semibold">Compact v0.23 / Minokawa</span>
            </div>
          </div>
        </div>

        {/* Network Infrastructure Service Endpoints */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            Service Endpoints
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <div className="text-gray-400 text-[10px]">INDEXER GRAPHQL ENDPOINT</div>
              <div className="text-cyan-300 truncate mt-0.5">{MIDNIGHT_PREVIEW_CONFIG.indexerUri}</div>
            </div>

            <div className="bg-[#0B0E17] p-3 rounded-xl border border-gray-800">
              <div className="text-gray-400 text-[10px]">NODE RPC ENDPOINT</div>
              <div className="text-purple-300 truncate mt-0.5">{MIDNIGHT_PREVIEW_CONFIG.nodeRpcUri}</div>
            </div>
          </div>
        </div>
      </div>

      {/* On-Chain Ledger State Inspector */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
        <h3 className="font-semibold text-white text-base flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-400" />
          Live On-Chain Public Ledger State
        </h3>

        <div className="bg-[#0B0E17] p-5 rounded-2xl border border-gray-800 font-mono text-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-500 block text-[10px]">ADMIN PUBLIC KEY</span>
              <span className="text-purple-300 truncate block">{ledgerState.adminPk}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">TOTAL PUBLIC BUDGET</span>
              <span className="text-cyan-400 font-bold">{ledgerState.totalBudget.toString()} tNIGHT</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">BATCH HASH COMMITMENT</span>
              <span className="text-gray-300 truncate block">{ledgerState.batchHash}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">ALLOCATED COUNT</span>
              <span className="text-white font-bold">{ledgerState.allocatedCount}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">CLAIMED COUNT</span>
              <span className="text-emerald-400 font-bold">{ledgerState.claimedCount}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">IS FINALIZED</span>
              <span className="text-amber-400 font-bold">{ledgerState.isFinalized ? 'TRUE' : 'FALSE'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
