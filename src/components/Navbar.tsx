import React from 'react';
import { Shield, Wallet, Cpu, Rocket } from 'lucide-react';
import { LaceWalletState } from '../midnight/types';

interface NavbarProps {
  walletState: LaceWalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleLogs: () => void;
  onResetDemo: () => void;
  activeTab: 'deploy' | 'admin' | 'employee' | 'audit' | 'explorer';
  setActiveTab: (tab: 'deploy' | 'admin' | 'employee' | 'audit' | 'explorer') => void;
  proofLogsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletState,
  onConnect,
  onDisconnect,
  onToggleLogs,
  onResetDemo,
  activeTab,
  setActiveTab,
  proofLogsCount,
}) => {
  const formatAddr = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 12)}...${addr.slice(-6)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0B0E17] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 animate-shield-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">Private Splits</h1>
              <span className="bg-purple-900/60 text-purple-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-500/30">
                1AM Preview
              </span>
            </div>
            <p className="text-xs text-gray-400">Zero-Knowledge Confidential Payroll Engine</p>
          </div>
        </div>

        {/* Navigation Tabs including /deploy */}
        <nav className="flex items-center gap-1 bg-[#131929] p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => {
              setActiveTab('deploy');
              window.history.pushState({}, '', '/deploy');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeTab === 'deploy'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            Deploy (/deploy)
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              window.history.pushState({}, '', '/admin');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Employer Batch
          </button>
          <button
            onClick={() => {
              setActiveTab('employee');
              window.history.pushState({}, '', '/employee');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'employee'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Employee Claim
          </button>
          <button
            onClick={() => {
              setActiveTab('audit');
              window.history.pushState({}, '', '/audit');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Selective Disclosure
          </button>
          <button
            onClick={() => {
              setActiveTab('explorer');
              window.history.pushState({}, '', '/explorer');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'explorer'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Preview Explorer
          </button>
        </nav>

        {/* Wallet & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-xs font-mono text-cyan-400 border border-cyan-500/20 transition"
            title="View ZK Proof Logs"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Proofs ({proofLogsCount})</span>
          </button>

          {walletState.isConnected ? (
            <div className="flex items-center gap-2 bg-[#131929] p-1 pl-3 rounded-xl border border-purple-500/30">
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  1AM Preview Connected
                </span>
                <span className="text-xs font-mono text-purple-300 font-semibold">
                  {formatAddr(walletState.address!)}
                </span>
              </div>
              <button
                onClick={onDisconnect}
                className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium rounded-lg border border-red-800/50 transition"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="purple-glow-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white tracking-wide"
            >
              <Wallet className="w-4 h-4" />
              Connect 1AM Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
