# Product Proposal: Private Payroll & Splits on Midnight Network (1AM Preview)

## Executive Summary
**Private Payroll / Splits** is a zero-knowledge confidential fund distribution application designed for web3 organizations, DAOs, companies, and freelancers. Built on the **Midnight Network** (Preview Network) using the **Compact / Minokawa** smart contract language, it enables organizations to disburse funds and execute salary splits without exposing recipient wallet identities or individual compensation figures on a public blockchain ledger.

- 🌐 **Live Deployed App**: [private-splits.vercel.app](https://private-splits.vercel.app)
- 🎥 **Demo Video Walkthrough**: [Watch Video Demo on Google Drive](https://drive.google.com/file/d/1EtDqa7OfEIXpTFXmZ51Ci7fefmtJVmuZ/view?usp=sharing)
- 💻 **GitHub Repository**: [github.com/rahul7686/Private-Splits](https://github.com/rahul7686/Private-Splits)

### 📸 Application & Deployment Screenshots
![1AM Extension Browser Contract Deployment](docs/screenshots/browser_deploy_desktop.png)
![All Checks Passed - Vercel & CI/CD](docs/screenshots/ci_cd_vercel_checks.png)

---

## The Problem
Standard public blockchains (Ethereum, Solana, Cardano) publish all transaction data on-chain. When a company or DAO pays salaries or splits project revenue on-chain:
1. **Compromised Employee Privacy**: Competitors, colleagues, and public observers can inspect exact salary amounts.
2. **Security & Targeting Risks**: High earners become targets for phishing, social engineering, and extortion.
3. **Operational Friction**: Companies resort to centralized off-chain workarounds or complex custodian setups to preserve financial privacy.

---

## The Solution: Midnight ZK Privacy Model
**Private Payroll / Splits** leverages Midnight's dual-state architecture (Public Ledger + Local Private State) and zero-knowledge circuit execution:
- **Public Ledger**: Only records the total budget, batch hash commitment, and total recipient count.
- **Private State & Witnesses**: Individual recipient salaries, Bech32m addresses, and split ratios remain on the employee's local device.
- **Selective Disclosure**: Auditors can verify budget conservation (`sum(splits) == total_budget`) without revealing individual employee compensation.

---

## Technical Stack
- **Smart Contract**: Midnight Compact (Minokawa) DSL v0.23
- **DApp Connector**: 1AM / Lace Wallet API (`@midnight-ntwrk/dapp-connector-api`)
- **ZK Circuit Simulator**: Midnight.js Client Runtime & Simulator
- **Frontend**: React 18, Vite, TypeScript, TailwindCSS
- **Testing**: Vitest Suite (4 unit & privacy tests passing)
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)

---

## Product Features & User Flows

### 1. Employer Dashboard
- Initialize payroll batch with total budget in tNIGHT.
- Add private employee salary commitments.
- Real-time ZK budget conservation proof generation (`current_sum + split <= total_budget`).
- Batch finalization to lock commitments.

### 2. Employee Claim Portal
- View encrypted entitlement commitments.
- Generate local zero-knowledge proof of entitlement using employee secret key.
- Claim private payout directly into 1AM wallet without revealing salary amount to co-workers.

### 3. Auditor Selective Disclosure
- Execute compliance audit circuit (`disclose_payroll_audit`).
- Verify total budget equality without de-anonymizing recipient identities or amounts.

---

## Target Audience
- Web3 Native Companies & Ecosystem Foundations
- Decentralized Autonomous Organizations (DAOs)
- Freelance Agencies & Revenue Sharing Pools

---

## Roadmap & Preview Deployment
- **Preview Smart Contract**: `mn_contract_preview1q9x74a87c0v28e53l90qw82k49z6m31f82y01`
- **GraphQL Indexer**: `https://indexer.preview.midnight.network/api/v4/graphql`
- **Node RPC**: `https://rpc.preview.midnight.network`
- **Phase 1 (Complete)**: Compact contract, 1AM wallet connector, ZK simulator, full UI, Vitest suite, and GitHub CI/CD on Preview network.
- **Phase 2 (Future)**: Multi-token support (NATIVE + Custom ZK Assets), scheduled recurring payroll streams.
