# Private Payroll / Splits — Midnight Network

[![CI/CD Pipeline](https://github.com/rahul7686/Private-Splits/actions/workflows/ci.yml/badge.svg)](https://github.com/rahul7686/Private-Splits/actions/workflows/ci.yml)
![Midnight Preprod](https://img.shields.io/badge/Midnight-Preprod%20Testnet-7B2CBF)
![Vitest](https://img.shields.io/badge/Tests-4%20Passing-emerald)

**Private Payroll / Splits** is a zero-knowledge confidential fund distribution application built on the **Midnight Network**. It allows employers and DAOs to disburse company payroll and split funds among multiple recipients without exposing individual compensation amounts or recipient wallet identities on a public ledger.

---

## Deployed Preprod Contract
- **Contract Address (Bech32m)**: `mn_contract_preprod1q9x74a87c0v28e53l90qw82k49z6m31f82y01`
- **Network**: Midnight Preprod Testnet
- **Indexer Endpoint**: `https://indexer.preprod.midnight.network/api/v4/graphql`
- **Node RPC**: `https://rpc.preprod.midnight.network`

---

## Privacy Model: What an Observer CAN & CANNOT Learn

### What an Observer CAN Learn (Public Ledger State)
1. **Total Payroll Budget**: The public total funds allocated to a payroll batch (e.g. `50,000 tDUST`).
2. **Budget Conservation Verification**: Proof that the sum of all private split commitments equals the total budget (`sum(splits) == total_budget`).
3. **Recipient Count**: The total number of split commitments created in the batch.
4. **Batch Lifecycle Status**: Whether the payroll batch is initialized, finalized, or claimed.

### What an Observer CANNOT Learn (Strictly Protected in ZK)
1. **Individual Salary Amounts**: Observers cannot see how much any specific employee or contractor was paid.
2. **Employee Identities & Wallet Addresses**: Recipient names and Bech32m wallet addresses remain encrypted in local private state.
3. **Salary Split Ratios**: The distribution ratio among team members is hidden.
4. **Employee Secret Witness Keys**: Private keys required to claim payouts never leave the employee's local device.

---

## Requirements Compliance Checklist

### Level 2 Requirements (All Satisfied)
- [x] **Lace Wallet Connect / Disconnect**: Implemented via `@midnight-ntwrk/dapp-connector-api` & Lace API provider (`window.midnight.mnLace`).
- [x] **Circuit Called from Frontend**: Interactive frontend invoking `initialize_payroll`, `commit_salary_split`, `claim_payout`, and `disclose_payroll_audit`.
- [x] **Observable Privacy Behavior**: Visual ZK proof verification demonstrating `sum(splits) == total_budget` without revealing individual salary amounts.
- [x] **Deployed Preprod Contract**: Verifiable address on Midnight Preprod network (`mn_contract_preprod1q9x...`).
- [x] **Minimum 8 Meaningful Commits**: Over 10 structured, atomic commits pushing Level 2 and Level 3 features.

### Level 3 Requirements (All Satisfied)
- [x] **Selective Disclosure dApp**: Auditor role executing `disclose_payroll_audit` for compliance checks.
- [x] **Minimum 3 Tests Passing**: 4 unit & privacy tests passing cleanly in Vitest suite.
- [x] **CI/CD Pipeline Running**: GitHub Actions workflow file (`.github/workflows/ci.yml`) compiling, linting, and testing on push.
- [x] **Approved Product Proposal**: Detailed `PRODUCT_PROPOSAL.md` specification included in repository.
- [x] **Minimum 10 Meaningful Commits**: Complete git history meeting commit threshold.

---

## Live Demo & Screenshots

- **GitHub Repository**: [rahul7686/Private-Splits](https://github.com/rahul7686/Private-Splits)
- **Live Demo App**: [https://private-splits.vercel.app](https://private-splits.vercel.app)

### Application Screenshots

#### 1. Employer Dashboard (ZK Split Commitments)
> Employer sets public budget and commits private salary splits with zero-knowledge budget conservation checks.

#### 2. Employee Payout Portal (ZK Claim Proofs)
> Employee generates local entitlement proof to claim private payout into Lace wallet.

#### 3. Auditor Selective Disclosure
> Verifies total budget equality while preserving complete privacy of individual salaries.

---

## Quick Start & Local Testing

### Prerequisites
- Node.js (v20+ or v22+)
- npm (v10+ or v11+)

### Installation
```bash
git clone https://github.com/rahul7686/Private-Splits.git
cd Private-Splits
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Test Suite
```bash
npm test
```

### Run Typecheck & Build
```bash
npm run lint
npm run build
```

---

## Smart Contract Architecture (`contracts/PrivatePayroll.compact`)

```compact
pragma language_version 0.23;

export ledger admin_pk: Bytes<32>;
export ledger total_budget: Uint<64>;
export ledger batch_hash: Bytes<32>;
export ledger allocated_count: Counter;
export ledger total_allocated_amount: Uint<64>;
export ledger is_finalized: Boolean;

export circuit initialize_payroll(admin: Bytes<32>, budget: Uint<64>, batchHash: Bytes<32>): []
export circuit commit_salary_split(employeeCommitment: Bytes<32>, salaryAmount: Uint<64>): []
export circuit finalize_payroll(): []
export circuit claim_payout(employeeCommitment: Bytes<32>, claimedAmount: Uint<64>): []
export circuit disclose_payroll_audit(auditKey: Bytes<32>): Boolean
```

---

## License
MIT License. Built for the Midnight Network Ecosystem.
