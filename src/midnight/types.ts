export interface LedgerState {
  adminPk: string;
  totalBudget: bigint;
  batchHash: string;
  allocatedCount: number;
  claimedCount: number;
  totalAllocatedAmount: bigint;
  isFinalized: boolean;
  contractAddress: string;
  deploymentNetwork: 'preview' | 'preprod' | 'localnet';
}

export interface PrivateSalarySplit {
  id: string;
  recipientName: string;
  recipientAddress: string;
  salaryAmount: bigint;
  employeeSecret: string;
  commitment: string;
  isClaimed: boolean;
  claimedTxHash?: string;
  createdAt: number;
}

export interface ZkProofLog {
  id: string;
  circuitName: 'initialize_payroll' | 'commit_salary_split' | 'finalize_payroll' | 'claim_payout' | 'disclose_payroll_audit';
  timestamp: string;
  provingTimeMs: number;
  publicInputs: Record<string, any>;
  privateInputsRedacted: string[];
  proofHash: string;
  status: 'proven' | 'verified' | 'failed';
  txHash?: string;
}

export interface LaceWalletState {
  isConnected: boolean;
  address: string | null; // Bech32m format e.g. mn_addr_preview1...
  coinPublicKey: string | null;
  encryptionPublicKey: string | null;
  networkId: 'preview' | 'preprod' | 'localnet';
  balance: bigint;
}

export interface SelectiveDisclosureReport {
  timestamp: string;
  totalBudgetVerified: boolean;
  sumEqualsBudget: boolean;
  totalAllocated: bigint;
  recipientCount: number;
  individualSalariesExposed: false; // Always false to prove privacy!
  verifierHash: string;
  auditKey: string;
}

export interface ContractDeployResult {
  contractAddress: string;
  txHash: string;
  networkId: 'preview';
  timestamp: string;
  deployerAddress: string;
}
