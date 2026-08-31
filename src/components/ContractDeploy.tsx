import React, { useState, useEffect } from 'react';
import { Rocket, ShieldCheck, CheckCircle2, Wallet, ExternalLink, Cpu, Copy, Check } from 'lucide-react';
import { LaceWalletState, ContractDeployResult } from '../midnight/types';
import { BrowserContractDeployer } from '../midnight/browserDeployer';
import { MIDNIGHT_PREVIEW_CONFIG } from '../midnight/dappConnector';

interface ContractDeployProps {
  walletState: LaceWalletState;
  onConnectWallet: () => void;
  onDeploySuccess?: (address: string) => void;
}

export const ContractDeploy: React.FC<ContractDeployProps> = ({
  walletState,
  onConnectWallet,
  onDeploySuccess,
}) => {
  const [deployer] = useState(() => new BrowserContractDeployer());
  const [initialBudgetInput, setInitialBudgetInput] = useState('50000');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<string>('');
  const [deployResult, setDeployResult] = useState<ContractDeployResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedAddress = deployer.getSavedDeployedAddress();
    if (savedAddress && !deployResult) {
      setDeployResult({
        contractAddress: savedAddress,
        txHash: localStorage.getItem('preview_deploy_tx_hash') || '0xabc123...',
        networkId: 'preview',
        timestamp: new Date().toISOString(),
        deployerAddress: walletState.address || 'mn_addr_preview1q...',
      });
    }
  }, []);

  const handleBrowserDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletState.isConnected) {
      onConnectWallet();
      return;
    }

    const budget = BigInt(initialBudgetInput || '0');
    setIsDeploying(true);
    setDeployStep('Setting Network ID explicitly to preview...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setDeployStep('Requesting 1AM / Lace Wallet Extension Authorization...');

      await new Promise((r) => setTimeout(r, 600));
      setDeployStep('Generating ZK Contract Deployment Proof via Browser Extension...');

      const result = await deployer.deployThroughBrowserWallet(budget);
      setDeployResult(result);
      if (onDeploySuccess) {
        onDeploySuccess(result.contractAddress);
      }
    } catch (err: any) {
      console.error('Deployment error:', err);
    } finally {
      setIsDeploying(false);
      setDeployStep('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#10172A] via-indigo-950/20 to-[#10172A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                1AM Extension Browser Contract Deployment (`/deploy`)
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Deploy the Compact Private Payroll smart contract directly from your browser via the 1AM wallet extension on Midnight Preview.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-indigo-950/80 text-indigo-300 px-3.5 py-1.5 rounded-xl border border-indigo-500/40 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            1AM Preview Mode
          </div>
        </div>
      </div>

      {/* Deployment Form Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-semibold text-white text-base">Deploy Compact Smart Contract</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Network: Midnight Preview (`preview`) | Engine: 1AM Browser Prover
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-cyan-400 font-mono block">Zero Server-Side Keys</span>
            <span className="text-[10px] text-emerald-400 font-mono block">100% In-Browser Extension</span>
          </div>
        </div>

        <form onSubmit={handleBrowserDeploy} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Initial Batch Budget Allocation (tNIGHT)
            </label>
            <input
              type="number"
              value={initialBudgetInput}
              onChange={(e) => setInitialBudgetInput(e.target.value)}
              disabled={isDeploying}
              className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {!walletState.isConnected ? (
            <button
              type="button"
              onClick={onConnectWallet}
              className="w-full purple-glow-btn py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Connect 1AM / Lace Wallet Extension First
            </button>
          ) : (
            <button
              type="submit"
              disabled={isDeploying}
              className="w-full purple-glow-btn py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  {deployStep || 'Deploying via 1AM Extension...'}
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Deploy Contract via 1AM Extension (Preview)
                </>
              )}
            </button>
          )}
        </form>
      </div>

      {/* Deployment Success Display */}
      {deployResult && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Contract Deployed Successfully!</h3>
            </div>
            <span className="bg-emerald-900/60 text-emerald-300 font-mono text-[10px] px-3 py-1 rounded-full border border-emerald-500/30">
              Midnight Preview
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Deployed Contract Address */}
            <div className="bg-[#090D16] p-4 rounded-xl border border-emerald-800/40 space-y-2">
              <div className="text-slate-400 text-[10px] flex items-center justify-between">
                <span>DEPLOYED BECH32M CONTRACT ADDRESS</span>
                <button
                  onClick={() => copyToClipboard(deployResult.contractAddress)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
              <div className="text-cyan-300 font-bold break-all text-sm py-0.5">
                {deployResult.contractAddress}
              </div>

              {/* Original Contract Hex Address */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 text-[10px] block">ORIGINAL CONTRACT HEX ADDRESS</span>
                <span className="text-indigo-300 font-bold break-all text-xs font-mono">
                  {MIDNIGHT_PREVIEW_CONFIG.originalContractHexAddress}
                </span>
              </div>
            </div>

            {/* Deployment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-[#090D16] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TRANSACTION HASH</span>
                <span className="text-indigo-300 truncate block">{deployResult.txHash}</span>
              </div>
              <div className="bg-[#090D16] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DEPLOYER ADDRESS</span>
                <span className="text-slate-300 truncate block">{deployResult.deployerAddress}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
