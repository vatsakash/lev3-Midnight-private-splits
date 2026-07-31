import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ContractDeploy } from './components/ContractDeploy';
import { AdminPayroll } from './components/AdminPayroll';
import { EmployeeClaim } from './components/EmployeeClaim';
import { AuditDisclosure } from './components/AuditDisclosure';
import { PreprodExplorer } from './components/PreprodExplorer';
import { CircuitLogsModal } from './components/CircuitLogsModal';
import { MidnightDAppConnector } from './midnight/dappConnector';
import { MidnightPayrollEngine } from './midnight/payrollSimulator';
import { LaceWalletState, LedgerState, PrivateSalarySplit, ZkProofLog } from './midnight/types';

export function App() {
  const connector = MidnightDAppConnector.getInstance();
  const engine = MidnightPayrollEngine.getInstance();

  const [walletState, setWalletState] = useState<LaceWalletState>(connector.getState());
  const [ledgerState, setLedgerState] = useState<LedgerState>(engine.getLedgerState());
  const [privateSplits, setPrivateSplits] = useState<PrivateSalarySplit[]>(engine.getPrivateSplits());
  const [proofLogs, setProofLogs] = useState<ZkProofLog[]>(engine.getProofLogs());

  // Derive initial tab from URL path
  const getInitialTab = (): 'deploy' | 'admin' | 'employee' | 'audit' | 'explorer' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('deploy')) return 'deploy';
      if (path.includes('employee')) return 'employee';
      if (path.includes('audit')) return 'audit';
      if (path.includes('explorer')) return 'explorer';
    }
    return 'deploy'; // Default route is /deploy for contract deployment
  };

  const [activeTab, setActiveTab] = useState<'deploy' | 'admin' | 'employee' | 'audit' | 'explorer'>(getInitialTab());
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  const refreshData = () => {
    setLedgerState(engine.getLedgerState());
    setPrivateSplits(engine.getPrivateSplits());
    setProofLogs(engine.getProofLogs());
  };

  useEffect(() => {
    refreshData();
    // Explicitly set network ID to preview
    connector.setNetworkIdExplicitly('preview');

    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleConnectWallet = async () => {
    const state = await connector.connect();
    setWalletState(state);
  };

  const handleDisconnectWallet = async () => {
    const state = await connector.disconnect();
    setWalletState(state);
  };

  const handleResetDemo = () => {
    engine.resetDemoData();
    refreshData();
  };

  const handleDeploySuccess = (deployedAddress: string) => {
    refreshData();
  };

  return (
    <div className="min-h-screen bg-[#0B0E17] text-gray-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        walletState={walletState}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        onToggleLogs={() => setIsLogsModalOpen(true)}
        onResetDemo={handleResetDemo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        proofLogsCount={proofLogs.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {activeTab === 'deploy' && (
          <ContractDeploy
            walletState={walletState}
            onConnectWallet={handleConnectWallet}
            onDeploySuccess={handleDeploySuccess}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPayroll
            ledgerState={ledgerState}
            privateSplits={privateSplits}
            walletState={walletState}
            onRefresh={refreshData}
          />
        )}

        {activeTab === 'employee' && (
          <EmployeeClaim
            ledgerState={ledgerState}
            privateSplits={privateSplits}
            walletState={walletState}
            onRefresh={refreshData}
          />
        )}

        {activeTab === 'audit' && (
          <AuditDisclosure ledgerState={ledgerState} />
        )}

        {activeTab === 'explorer' && (
          <PreprodExplorer ledgerState={ledgerState} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-gray-800/80 py-6 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            Built with <span className="text-purple-400">1AM &amp; Midnight Network</span> — Compact Minokawa Circuits
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>1AM Preview Deployment</span>
            <span className="text-emerald-400">● 1AM Preview Connected</span>
          </div>
        </div>
      </footer>

      {/* Circuit Proof Logs Modal */}
      <CircuitLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        logs={proofLogs}
      />
    </div>
  );
}

export default App;
