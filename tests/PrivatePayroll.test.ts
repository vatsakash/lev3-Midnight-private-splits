import { describe, it, expect, beforeEach } from 'vitest';
import { MidnightPayrollEngine } from '../src/midnight/payrollSimulator';
import { MidnightDAppConnector } from '../src/midnight/dappConnector';

describe('Private Payroll & Splits Compact Contract Suite', () => {
  let engine: MidnightPayrollEngine;
  let connector: MidnightDAppConnector;

  beforeEach(() => {
    engine = MidnightPayrollEngine.getInstance();
    connector = MidnightDAppConnector.getInstance();
    engine.resetDemoData();
  });

  it('Test 1: initialize_payroll circuit sets public budget and batch hash', async () => {
    const adminAddress = 'mn_addr_test1q9x74a87c0v28e53l90qw82k49z6m31f82y01';
    const totalBudget = 50000n;

    const proofLog = await engine.initializePayroll(adminAddress, totalBudget);

    const ledger = engine.getLedgerState();
    expect(ledger.adminPk).toBe(adminAddress);
    expect(ledger.totalBudget).toBe(totalBudget);
    expect(ledger.allocatedCount).toBe(0);
    expect(ledger.isFinalized).toBe(false);
    expect(proofLog.circuitName).toBe('initialize_payroll');
    expect(proofLog.status).toBe('proven');
  });

  it('Test 2: commit_salary_split circuit enforces budget conservation without leaking salary', async () => {
    const adminAddress = 'mn_addr_test1q9x74a87c0v28e53l90qw82k49z6m31f82y01';
    const totalBudget = 10000n;

    await engine.initializePayroll(adminAddress, totalBudget);

    // Commit 1st split: 6000 tDUST
    const { split: split1, proofLog: proof1 } = await engine.commitSalarySplit(
      'Alice',
      'mn_addr_test1qalice',
      6000n
    );
    expect(split1.salaryAmount).toBe(6000n);
    expect(split1.commitment).toContain('0x');
    expect(proof1.publicInputs.splitConservationVerified).toBe(true);

    // Commit 2nd split: 4000 tDUST
    await engine.commitSalarySplit('Bob', 'mn_addr_test1qbob', 4000n);

    const ledger = engine.getLedgerState();
    expect(ledger.totalAllocatedAmount).toBe(10000n);
    expect(ledger.allocatedCount).toBe(2);

    // Attempting to over-allocate should throw error in ZK circuit constraint
    await expect(
      engine.commitSalarySplit('Charlie', 'mn_addr_test1qcharlie', 2000n)
    ).rejects.toThrow('Split amount exceeds remaining budget');
  });

  it('Test 3: claim_payout circuit enables private entitlement claim with ZK witness proof', async () => {
    const adminAddress = 'mn_addr_test1q9x74a87c0v28e53l90qw82k49z6m31f82y01';
    await engine.initializePayroll(adminAddress, 20000n);
    const { split } = await engine.commitSalarySplit('Alice', 'mn_addr_test1qalice', 20000n);

    // Finalize batch
    await engine.finalizePayroll();
    expect(engine.getLedgerState().isFinalized).toBe(true);

    // Claim payout
    const claimLog = await engine.claimPayout(split.id);
    expect(claimLog.circuitName).toBe('claim_payout');
    expect(claimLog.status).toBe('proven');
    expect(claimLog.txHash).toBeDefined();

    // Verify split is marked claimed
    const splits = engine.getPrivateSplits();
    expect(splits[0].isClaimed).toBe(true);

    // Double claim attempt must fail
    await expect(engine.claimPayout(split.id)).rejects.toThrow('already been claimed');
  });

  it('Test 4: disclose_payroll_audit provides selective disclosure without exposing individual salaries', async () => {
    const adminAddress = 'mn_addr_test1q9x74a87c0v28e53l90qw82k49z6m31f82y01';
    await engine.initializePayroll(adminAddress, 30000n);
    await engine.commitSalarySplit('Dev 1', 'mn_addr_dev1', 18000n);
    await engine.commitSalarySplit('Dev 2', 'mn_addr_dev2', 12000n);

    const auditReport = await engine.generateAuditReport('AUDIT-KEY-999');

    expect(auditReport.totalBudgetVerified).toBe(true);
    expect(auditReport.sumEqualsBudget).toBe(true);
    expect(auditReport.recipientCount).toBe(2);
    expect(auditReport.individualSalariesExposed).toBe(false);
    expect(auditReport.verifierHash).toContain('0x');
  });
});
