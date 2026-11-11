# Supply Chain Management - TraceChain

TraceChain is a Vue 3 frontend for auditing cold-chain shipment records. It displays sensor readings, temperature excursions, blockchain hash verification, packet history, GPS locations, and fleet-level container summaries.

The dashboard consumes the backend endpoint:

```text
GET /product-data?containerID=<container-id>
```

It does not modify the backend or write data to the ledger.

## Features

- Cold-chain temperature monitoring with the `-18 °C` safety threshold
- Blockchain hash verification and data-integrity verdicts
- Packet-by-packet audit history
- Temperature chart and latest reading summary
- GPS location map links
- Fleet overview for configured containers
- Searchable, shareable audit URLs:
  `/audit/<container-id>`
- Packet filtering, sorting, tamper-demo mode, and CSV/JSON export
- Pinata IPFS and Sepolia Etherscan links
- In-memory caching to avoid repeated requests during a page session
- No automatic polling; retry or submitting the current container explicitly requests fresh data

## Requirements

- Node.js 18 or newer
- npm
- A running or deployed TraceChain backend

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

On macOS/Linux, use `cp .env.example .env.local` instead of `copy`.

The development server is normally available at `http://localhost:5173`.

## Configuration

Set these variables in `.env.local`:

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend origin, for example `https://qr-blockchain-api.vercel.app` |
| `VITE_IPFS_GATEWAY` | Pinata IPFS gateway used to resolve CIDs |
| `VITE_DEFAULT_CONTAINER` | Optional container opened on the home page |
| `VITE_CONTAINERS` | Optional comma-separated container IDs shown in the fleet overview |
| `VITE_CONTRACT_ADDRESS` | Optional Sepolia contract address used for explorer links |
| `VITE_GOOGLE_MAPS_API_KEY` | Optional key for embedded Google Maps |

Keep the API variable as the backend origin only. The frontend appends `/product-data` and the `containerID` query parameter itself.

## Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`. Environment variables are embedded at build time, so rebuild after changing `.env.local`.

## Project structure

```text
src/
├── components/
│   ├── audit/       Audit charts, tables, cards, maps, and status panels
│   ├── layout/      Global application header
│   └── ui/          Reusable empty, error, loading, and link components
├── composables/     Reusable Vue behavior
├── config/          Environment values and external links
├── router/          Vue Router configuration
├── services/        HTTP, ledger, and fleet API services
├── stores/          Pinia audit and fleet state
├── utils/           Formatting, export, geolocation, and hash helpers
└── views/           Main audit dashboard
```

## Data flow

```text
AuditView
  -> Pinia stores
  -> service functions
  -> HTTP wrapper
  -> TraceChain backend
```

`ledgerService.js` normalizes backend records before they enter the audit store. Derived values such as verification status, compliance, filters, sorting, and summary KPIs are calculated in the store.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
