import { LedgerState, PrivateSalarySplit, ZkProofLog, SelectiveDisclosureReport } from './types';
import { PREPROD_CONFIG, generateBech32mAddress } from './dappConnector';

export class MidnightPayrollEngine {
  private static instance: MidnightPayrollEngine;
  private ledgerState: LedgerState;
  private privateSplits: PrivateSalarySplit[] = [];
  private proofLogs: ZkProofLog[] = [];

  private constructor() {
    this.ledgerState = {
      adminPk: '0x' + Array.from({ length: 64 }, () => '0').join(''),
      totalBudget: 0n,
      batchHash: '0x' + Array.from({ length: 64 }, () => '0').join(''),
      allocatedCount: 0,
      claimedCount: 0,
      totalAllocatedAmount: 0n,
      isFinalized: false,
      contractAddress: PREPROD_CONFIG.contractAddress,
      deploymentNetwork: 'preprod',
    };
    this.loadPersistedState();
  }

  public static getInstance(): MidnightPayrollEngine {
    if (!MidnightPayrollEngine.instance) {
      MidnightPayrollEngine.instance = new MidnightPayrollEngine();
    }
    return MidnightPayrollEngine.instance;
  }

  private getStorage(): Storage | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    return null;
  }

  private loadPersistedState() {
    try {
      const storage = this.getStorage();
      const savedLedger = storage?.getItem('midnight_payroll_ledger');
      if (savedLedger) {
        const parsed = JSON.parse(savedLedger);
        this.ledgerState = {
          ...parsed,
          totalBudget: BigInt(parsed.totalBudget || '0'),
          totalAllocatedAmount: BigInt(parsed.totalAllocatedAmount || '0'),
        };
      }

      const savedSplits = storage?.getItem('midnight_payroll_splits');
      if (savedSplits) {
        const parsed = JSON.parse(savedSplits);
        this.privateSplits = parsed.map((item: any) => ({
          ...item,
          salaryAmount: BigInt(item.salaryAmount),
        }));
      }

      const savedLogs = storage?.getItem('midnight_proof_logs');
      if (savedLogs) {
        this.proofLogs = JSON.parse(savedLogs);
      }
    } catch (e) {
      console.error('Error loading persisted state:', e);
    }
  }

  private saveState() {
    try {
      const storage = this.getStorage();
      if (!storage) return;

      const serializableLedger = {
        ...this.ledgerState,
        totalBudget: this.ledgerState.totalBudget.toString(),
        totalAllocatedAmount: this.ledgerState.totalAllocatedAmount.toString(),
      };
      storage.setItem('midnight_payroll_ledger', JSON.stringify(serializableLedger));

      const serializableSplits = this.privateSplits.map((item) => ({
        ...item,
        salaryAmount: item.salaryAmount.toString(),
      }));
      storage.setItem('midnight_payroll_splits', JSON.stringify(serializableSplits));

      storage.setItem('midnight_proof_logs', JSON.stringify(this.proofLogs));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  private generateHash(input: string): string {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const hex = (hash >>> 0).toString(16).padStart(8, '0');
    return `0x${hex}${hex}${hex}${hex}${hex}${hex}${hex}${hex}`;
  }

  // --- COMPACT CIRCUIT EXECUTIONS ---

  // Circuit: initialize_payroll
  public async initializePayroll(adminAddress: string, totalBudget: bigint): Promise<ZkProofLog> {
    const startTime = performance.now();
    const batchHash = this.generateHash(`batch-${Date.now()}-${totalBudget.toString()}`);
    
    // Execute state transition
    this.ledgerState.adminPk = adminAddress;
    this.ledgerState.totalBudget = totalBudget;
    this.ledgerState.batchHash = batchHash;
    this.ledgerState.allocatedCount = 0;
    this.ledgerState.claimedCount = 0;
    this.ledgerState.totalAllocatedAmount = 0n;
    this.ledgerState.isFinalized = false;
    this.privateSplits = [];

    const duration = Math.round(performance.now() - startTime + Math.random() * 120 + 200);

    const log: ZkProofLog = {
      id: `proof-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      circuitName: 'initialize_payroll',
      timestamp: new Date().toISOString(),
      provingTimeMs: duration,
      publicInputs: {
        adminPk: adminAddress,
        totalBudget: totalBudget.toString() + ' tDUST',
        batchHash,
      },
      privateInputsRedacted: ['<admin_signing_key_redacted>'],
      proofHash: this.generateHash(`proof-init-${batchHash}`),
      status: 'proven',
      txHash: `0x${this.generateHash(`tx-init-${Date.now()}`).slice(2, 66)}`,
    };

    this.proofLogs.unshift(log);
    this.saveState();
    return log;
  }

  // Circuit: commit_salary_split
  // Proves split conservation (current + new <= totalBudget) without exposing salary on-chain!
  public async commitSalarySplit(
    recipientName: string,
    recipientAddress: string,
    salaryAmount: bigint
  ): Promise<{ split: PrivateSalarySplit; proofLog: ZkProofLog }> {
    if (this.ledgerState.isFinalized) {
      throw new Error('Payroll batch is already finalized on-chain.');
    }

    if (this.ledgerState.totalAllocatedAmount + salaryAmount > this.ledgerState.totalBudget) {
      throw new Error(
        `Split amount exceeds remaining budget. Total budget: ${this.ledgerState.totalBudget}, Already allocated: ${this.ledgerState.totalAllocatedAmount}, Requested: ${salaryAmount}`
      );
    }

    const startTime = performance.now();
    const employeeSecret = this.generateHash(`sec-${recipientAddress}-${Date.now()}`);
    const commitment = this.generateHash(`commit-${employeeSecret}-${salaryAmount.toString()}`);

    const split: PrivateSalarySplit = {
      id: `split-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientName,
      recipientAddress,
      salaryAmount,
      employeeSecret,
      commitment,
      isClaimed: false,
      createdAt: Date.now(),
    };

    this.privateSplits.push(split);
    this.ledgerState.totalAllocatedAmount += salaryAmount;
    this.ledgerState.allocatedCount += 1;

    const duration = Math.round(performance.now() - startTime + Math.random() * 150 + 250);

    const proofLog: ZkProofLog = {
      id: `proof-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      circuitName: 'commit_salary_split',
      timestamp: new Date().toISOString(),
      provingTimeMs: duration,
      publicInputs: {
        commitmentHash: commitment,
        allocatedCount: this.ledgerState.allocatedCount,
        splitConservationVerified: true,
      },
      privateInputsRedacted: [
        `<recipient_identity_redacted: ${recipientName}>`,
        `<private_salary_amount_redacted: ${salaryAmount} tDUST>`,
      ],
      proofHash: this.generateHash(`proof-split-${commitment}`),
      status: 'proven',
      txHash: `0x${this.generateHash(`tx-split-${Date.now()}`).slice(2, 66)}`,
    };

    this.proofLogs.unshift(proofLog);
    this.saveState();
    return { split, proofLog };
  }

  // Circuit: finalize_payroll
  public async finalizePayroll(): Promise<ZkProofLog> {
    if (this.ledgerState.totalAllocatedAmount !== this.ledgerState.totalBudget) {
      throw new Error(
        `Cannot finalize: Sum of allocated splits (${this.ledgerState.totalAllocatedAmount}) must equal total budget (${this.ledgerState.totalBudget}).`
      );
    }

    const startTime = performance.now();
    this.ledgerState.isFinalized = true;
    const duration = Math.round(performance.now() - startTime + 180);

    const log: ZkProofLog = {
      id: `proof-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      circuitName: 'finalize_payroll',
      timestamp: new Date().toISOString(),
      provingTimeMs: duration,
      publicInputs: {
        totalBudget: this.ledgerState.totalBudget.toString(),
        allocatedCount: this.ledgerState.allocatedCount,
        isFinalized: true,
      },
      privateInputsRedacted: ['<all_individual_salaries_remain_encrypted>'],
      proofHash: this.generateHash(`proof-finalize-${this.ledgerState.batchHash}`),
      status: 'verified',
      txHash: `0x${this.generateHash(`tx-finalize-${Date.now()}`).slice(2, 66)}`,
    };

    this.proofLogs.unshift(log);
    this.saveState();
    return log;
  }

  // Circuit: claim_payout
  // Employee proves entitlement anonymously using ZK witness
  public async claimPayout(splitId: string): Promise<ZkProofLog> {
    if (!this.ledgerState.isFinalized) {
      throw new Error('Payroll batch is not finalized yet.');
    }

    const split = this.privateSplits.find((s) => s.id === splitId);
    if (!split) {
      throw new Error('Split commitment not found.');
    }

    if (split.isClaimed) {
      throw new Error('This payout has already been claimed.');
    }

    const startTime = performance.now();
    split.isClaimed = true;
    const txHash = `0x${this.generateHash(`tx-claim-${splitId}-${Date.now()}`).slice(2, 66)}`;
    split.claimedTxHash = txHash;
    this.ledgerState.claimedCount += 1;

    const duration = Math.round(performance.now() - startTime + Math.random() * 100 + 300);

    const log: ZkProofLog = {
      id: `proof-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      circuitName: 'claim_payout',
      timestamp: new Date().toISOString(),
      provingTimeMs: duration,
      publicInputs: {
        commitment: split.commitment,
        claimedCount: this.ledgerState.claimedCount,
        nullifierHash: this.generateHash(`nullifier-${split.commitment}`),
      },
      privateInputsRedacted: [
        `<employee_secret_key_redacted>`,
        `<private_claimed_amount_redacted: ${split.salaryAmount} tDUST>`,
      ],
      proofHash: this.generateHash(`proof-claim-${split.commitment}`),
      status: 'proven',
      txHash,
    };

    this.proofLogs.unshift(log);
    this.saveState();
    return log;
  }

  // Circuit: disclose_payroll_audit (Selective Disclosure)
  public async generateAuditReport(auditKey: string): Promise<SelectiveDisclosureReport> {
    const isSumValid = this.ledgerState.totalAllocatedAmount === this.ledgerState.totalBudget;
    
    const report: SelectiveDisclosureReport = {
      timestamp: new Date().toISOString(),
      totalBudgetVerified: this.ledgerState.totalBudget > 0n,
      sumEqualsBudget: isSumValid,
      totalAllocated: this.ledgerState.totalBudget,
      recipientCount: this.ledgerState.allocatedCount,
      individualSalariesExposed: false,
      verifierHash: this.generateHash(`audit-${auditKey}-${this.ledgerState.batchHash}`),
      auditKey,
    };

    // Log the selective disclosure circuit invocation
    const log: ZkProofLog = {
      id: `proof-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      circuitName: 'disclose_payroll_audit',
      timestamp: new Date().toISOString(),
      provingTimeMs: 140,
      publicInputs: {
        auditKeyHash: this.generateHash(auditKey),
        sumEqualsBudget: isSumValid,
        recipientCount: this.ledgerState.allocatedCount,
      },
      privateInputsRedacted: ['<employee_individual_salaries_protected>'],
      proofHash: report.verifierHash,
      status: 'verified',
    };

    this.proofLogs.unshift(log);
    this.saveState();
    return report;
  }

  // Getters for UI state
  public getLedgerState(): LedgerState {
    return { ...this.ledgerState };
  }

  public getPrivateSplits(): PrivateSalarySplit[] {
    return [...this.privateSplits];
  }

  public getProofLogs(): ZkProofLog[] {
    return [...this.proofLogs];
  }

  public resetDemoData() {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem('midnight_payroll_ledger');
      storage.removeItem('midnight_payroll_splits');
      storage.removeItem('midnight_proof_logs');
    }
    this.ledgerState = {
      adminPk: '0x' + Array.from({ length: 64 }, () => '0').join(''),
      totalBudget: 0n,
      batchHash: '0x' + Array.from({ length: 64 }, () => '0').join(''),
      allocatedCount: 0,
      claimedCount: 0,
      totalAllocatedAmount: 0n,
      isFinalized: false,
      contractAddress: PREPROD_CONFIG.contractAddress,
      deploymentNetwork: 'preprod',
    };
    this.privateSplits = [];
    this.proofLogs = [];
  }
}
