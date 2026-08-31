import React from 'react';
import { X, Cpu, CheckCircle2, ShieldAlert, Clock, ArrowUpRight } from 'lucide-react';
import { ZkProofLog } from '../midnight/types';

interface CircuitLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ZkProofLog[];
}

export const CircuitLogsModal: React.FC<CircuitLogsModalProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl max-h-[85vh] rounded-3xl border border-indigo-500/30 flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#10172A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Midnight ZK Proof Execution Logs</h3>
              <p className="text-xs text-slate-400">
                Real-time zero-knowledge circuit prover logs & proof verification audit trail.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-gray-800/50 hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No proof executions recorded yet. Execute a circuit from the dashboard to see ZK proof logs.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-[#090D16] p-4 rounded-2xl border border-slate-800 space-y-3 hover:border-indigo-500/30 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-950 text-indigo-300 font-bold px-2.5 py-0.5 rounded-md border border-indigo-800/50">
                      circuit::{log.circuitName}()
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.provingTimeMs} ms
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {log.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Public Inputs */}
                  <div>
                    <span className="text-cyan-400 text-[10px] block mb-1">PUBLIC INPUTS (ON-CHAIN):</span>
                    <pre className="bg-[#10172A] p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(log.publicInputs, null, 2)}
                    </pre>
                  </div>

                  {/* Redacted Private Inputs */}
                  <div>
                    <span className="text-indigo-400 text-[10px] block mb-1">REDACTED PRIVATE INPUTS (ZK WITNESS):</span>
                    <div className="bg-[#10172A] p-2.5 rounded-xl border border-slate-800 text-[11px] text-indigo-300 space-y-1">
                      {log.privateInputsRedacted.map((priv, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <ShieldAlert className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>{priv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hashes */}
                <div className="pt-2 border-t border-slate-800/40 text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <span>PROOF HASH: </span>
                    <span className="text-indigo-300">{log.proofHash.slice(0, 32)}...</span>
                  </div>
                  {log.txHash && (
                    <div>
                      <span>TX HASH: </span>
                      <span className="text-cyan-300">{log.txHash.slice(0, 32)}...</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
