# ANTEREON WEB

Official frontend for Antereon, a cybersecurity intelligence platform for IOC analysis. Built with Vue 3 and Vite.

## Quick Start

### Prerequisites

- Node.js v22.17.0
- Antereon API running on `http://localhost:3000`

### Installation

```bash
# 1. Configure Environment Variables
cp .env.example .env.development

# 2. Install Dependencies
yarn install --frozen-lockfile

# 3. Run Development Server
yarn serve
```

The application will be available at `http://localhost:5173`.

## Production Deployment

```bash
# 1. Configure Production Environment
cp .env.example .env.production
# Edit .env.production with your production API URL

# 2. Build for Production
yarn build

# 3. Preview Production Build
yarn preview
```

## Testing

```bash
# Unit Tests (Vitest)
yarn test:unit

# E2E Tests (Headless)
# Note: Requires a production build first
yarn build
yarn test:e2e

# E2E Tests (With interface)
yarn test:e2e:dev
```

## Tech Stack

- Vue 3 + Vite
- TypeScript
- Pinia (State Management)
- Vuetify (UI Component Framework)
- Cypress & Vitest
