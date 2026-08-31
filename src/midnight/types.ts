export interface LedgerState {
  adminPk: string;
  totalBudget: bigint;
  batchHash: string;
  allocatedCount: number;
  claimedCount: number;
  totalAllocatedAmount: bigint;
  isFinalized: boolean;
  contractAddress: string;
  deploymentNetwork: 'preprod' | 'localnet';
}

export interface PrivateSalarySplit {
  id: string;
  recipientName: string;
  employeeName?: string;
  recipientAddress: string;
  bech32Address?: string;
  salaryAmount: bigint;
  employeeSecret: string;
  secretWitnessKey?: string;
  commitment: string;
  employeeCommitment?: string;
  isClaimed: boolean;
  claimedTxHash?: string;
  createdAt: number;
  timestamp?: string;
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
  privateWitnessCount?: number;
}

export interface LaceWalletState {
  isConnected: boolean;
  address: string | null; // Bech32m format e.g. mn_addr_preprod1...
  coinPublicKey: string | null;
  encryptionPublicKey: string | null;
  networkId: 'preprod' | 'localnet';
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
  isTotalBudgetValid?: boolean;
  publicTotalBudget?: bigint;
  verifiedRecipientsCount?: number;
  complianceStatus?: string;
  disclosedByAuditKey?: string;
  txHash?: string;
}

export interface ContractDeployResult {
  contractAddress: string;
  txHash: string;
  networkId: 'preprod';
  timestamp: string;
  deployerAddress: string;
}
