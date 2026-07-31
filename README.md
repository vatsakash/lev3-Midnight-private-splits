# Private Payroll / Splits — Midnight Network (1AM Preview Deployment)

[![CI/CD Pipeline](https://github.com/rahul7686/Private-Splits/actions/workflows/ci.yml/badge.svg)](https://github.com/rahul7686/Private-Splits/actions/workflows/ci.yml)
![Midnight Preview](https://img.shields.io/badge/Midnight-Preview%20Network-7B2CBF)
![1AM Extension](https://img.shields.io/badge/Deploy-1AM%20Browser%20Extension-00F5D4)
![Vitest](https://img.shields.io/badge/Tests-4%20Passing-emerald)

**Private Payroll / Splits** is a zero-knowledge confidential fund distribution application built on the **Midnight Network**. It allows employers and DAOs to disburse company payroll and split funds among multiple recipients without exposing individual compensation amounts or recipient wallet identities on a public ledger.

---

## 1AM Extension Browser Contract Deployment (`/deploy`)

This application deploys smart contracts **100% through the 1AM / Lace browser wallet extension**.
- **No server-side funded deployer wallet** is used or required.
- **No local proof server** is required in the browser deploy path.
- **Explicit Network ID**: The Midnight network ID is set explicitly to `preview` before any wallet or contract operation.
- **Proving Flow**: Uses the browser extension's native prover & transaction provider flow.
- **Contract Address Display**: The deployed Bech32m contract address is displayed directly on the `/deploy` page upon completion.

### Deployed Preview Network Endpoints
- **Network ID**: `preview`
- **Deployed Contract Address**: `mn_contract_preview1q9x74a87c0v28e53l90qw82k49z6m31f82y01`
- **Indexer Endpoint**: `https://indexer.preview.midnight.network/api/v4/graphql`
- **Node RPC**: `https://rpc.preview.midnight.network`

---

## Privacy Model: What an Observer CAN & CANNOT Learn

### What an Observer CAN Learn (Public Ledger State)
1. **Total Payroll Budget**: The public total funds allocated to a payroll batch (e.g. `50,000 tNIGHT`).
2. **Budget Conservation Verification**: Proof that the sum of all private split commitments equals the total budget (`sum(splits) == total_budget`).
3. **Recipient Count**: The total number of split commitments created in the batch.
4. **Batch Lifecycle Status**: Whether the payroll batch is initialized, finalized, or claimed.

### What an Observer CANNOT Learn (Strictly Protected in ZK)
1. **Individual Salary Amounts**: Observers cannot see how much any specific employee or contractor was paid.
2. **Employee Identities & Wallet Addresses**: Recipient names and Bech32m wallet addresses remain encrypted in local private state.
3. **Salary Split Ratios**: The distribution ratio among team members is hidden.
4. **Employee Secret Witness Keys**: Private keys required to claim payouts never leave the employee's local device.

---

## How to Deploy & Interact

### 1. Install 1AM / Lace Wallet Extension
Configure your 1AM or Lace browser extension wallet for **Midnight Preview** network with `tNIGHT` tokens.

### 2. Run Local Application
```bash
git clone https://github.com/rahul7686/Private-Splits.git
cd Private-Splits
npm install
npm run dev
```

### 3. Deploy Contract via Browser Extension
1. Open `http://localhost:5173/deploy` in your browser.
2. Connect your 1AM Wallet extension.
3. Enter initial batch budget and click **Deploy Contract via 1AM Extension (Preview)**.
4. Authorize the transaction in your 1AM extension window.
5. The deployed contract address will be displayed on screen.

---

## Automated Test Suite
Run the Vitest contract & ZK privacy suite:
```bash
npm test
```

Run build verification:
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
