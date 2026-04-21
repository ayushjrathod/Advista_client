# Advista Client

React + Vite frontend for Advista. This app provides the landing experience, Firebase-powered authentication, chat-based research intake, report viewing, and saved research history.

## What this project is

`Advista_client` is the frontend half of the Advista product.

Its job is to:

- present the marketing and product UI
- handle Firebase authentication in the browser
- guide the user through the chat-based intake flow
- trigger research generation on the API
- render completed reports and saved research history

In short: this project is the user-facing application, while `Advista_api` handles persistence, orchestration, and research generation behind the scenes.

## What this app does

- Renders the public marketing and product pages
- Uses Firebase Auth for sign-up, sign-in, verification, password reset, and anonymous access
- Starts a chat session and streams research brief generation from the API
- Triggers report generation and displays the final research report
- Shows a signed-in user's saved research history

## Stack

- React 19
- Vite 7
- React Router 7
- Firebase Web SDK
- Tailwind CSS 4
- Framer Motion
- Radix UI primitives
- Axios for API requests
- Three.js / React Three Fiber for 3D UI elements

## Project layout

```text
.
├── src/App.jsx                 # Route registration
├── src/pages/                  # Landing, auth, chat, history, report pages
├── src/components/             # UI and feature components
├── src/contexts/               # Auth context
├── src/lib/api.js              # Axios instance + auth headers
├── src/lib/firebase.js         # Firebase bootstrapping and token helpers
├── scripts/export-cube-video.mjs
└── vercel.json                 # SPA rewrites
```

## Where things are

If you are new to the frontend, these are the main places to look:

- `src/App.jsx` — top-level router and lazy-loaded page registration
- `src/pages/` — route-level screens such as landing, auth, chat, history, and report views
- `src/components/` — reusable UI pieces and feature-specific components
- `src/components/auth/` — auth-related form components
- `src/components/landing/` — landing page sections and shared marketing UI
- `src/components/research-report/` — report sidebar, sections, and resources tab
- `src/components/ui/` — shared design-system style primitives
- `src/contexts/` — auth context and hooks
- `src/lib/api.js` — Axios setup and API request configuration
- `src/lib/firebase.js` — Firebase app initialization and token helpers
- `src/schemas/` — client-side validation schemas
- `public/` — static assets served directly
- `scripts/export-cube-video.mjs` — utility for exporting the cube animation/video asset

### Frontend flow by area

- **Routing** starts in `src/App.jsx`
- **Auth state** is managed in `src/contexts/AuthContext.jsx` and consumed via `src/contexts/use-auth.js`
- **API calls** go through `src/lib/api.js`
- **Firebase browser auth** is set up in `src/lib/firebase.js`
- **Chat experience** lives primarily in `src/pages/chatbot.jsx`
- **Report rendering** lives in `src/pages/research-report.jsx` plus `src/components/research-report/`
- **Saved history** lives in `src/pages/history.jsx`
- **Landing and public pages** live across `src/pages/` and `src/components/landing/`

### Important routes and where they render from

- `/` → `src/pages/landingPage`
- `/about` → `src/pages/about`
- `/sign-in` and `/sign-up` → `src/pages/auth/`
- `/chat` → `src/pages/chatbot.jsx`
- `/research-report` → `src/pages/research-report.jsx`
- `/history` → `src/pages/history.jsx`
- `/cube-recorder` → `src/pages/cube-recorder`

## Prerequisites

- Node.js 20+ or Bun
- A running Advista API instance
- Firebase Web app credentials

This repo includes `bun.lockb`, so Bun is the easiest path, but npm works too.

## Environment variables

Create `.env` in `Advista_client/`.

```env
VITE_API_URL=http://localhost:8000

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
```

### Notes

- `VITE_API_URL` defaults to `http://localhost:8000` if omitted
- Firebase auth is considered enabled only when the required `VITE_FIREBASE_*` keys are present
- Without Firebase config, auth screens stay disabled and the app shows a helpful configuration warning

## Local development

### Install dependencies

With Bun:

```bash
bun install
```

With npm:

```bash
npm install
```

### Start the dev server

With Bun:

```bash
bun run dev
```

With npm:

```bash
npm run dev
```

The Vite server runs on `http://localhost:5173` and proxies `/api/*` requests to `VITE_API_URL`.

## Available scripts

- `bun run dev` / `npm run dev` — start local development server
- `bun run build` / `npm run build` — production build
- `bun run preview` / `npm run preview` — preview the production build
- `bun run lint` / `npm run lint` — run ESLint
- `bun run export:cube-video` / `npm run export:cube-video` — export the cube animation asset

## Main routes

- `/` — landing page
- `/about` — product/about page
- `/sign-in` — Firebase sign-in
- `/sign-up` — Firebase sign-up
- `/verify/:email` — email verification helper page
- `/forgot-password` — Firebase password reset request
- `/reset-password/:email` — Firebase password reset flow page
- `/chat` — research intake chatbot
- `/research-report` — generated report view
- `/history` — saved research sessions
- `/cube-recorder` — recording/export tooling page

## How the app talks to the API

- `src/lib/api.js` builds an Axios client from `VITE_API_URL`
- Firebase ID tokens are attached automatically as `Authorization: Bearer ...`
- Lambda-style wrapped responses are unwrapped in the client so pages can consume a normal payload shape
- The chatbot page also uses fetch-based streaming for `POST /api/v1/chat/stream`

## Auth behavior

- Anonymous Firebase sign-in is used when needed so visitors can still try the product flow
- Verified Firebase users get persisted identity on the backend and can access saved research history
- Auth-related UI surfaces a clear error if the client is missing Firebase config

## Deployment

This app is set up for SPA hosting.

- `vercel.json` rewrites all routes to `index.html`
- Production builds are generated with `vite build`
- Set the same `VITE_*` variables in your hosting provider before deploying

## Recommended local workflow

1. Start the API from `Advista_api/`
2. Set `VITE_API_URL` to that backend
3. Add Firebase web credentials to `.env`
4. Run the client with `bun run dev`
5. Open `http://localhost:5173`

## Troubleshooting

- If auth buttons are disabled, check the `VITE_FIREBASE_*` values first
- If API calls fail in dev, confirm `VITE_API_URL` points to the backend and that the API allows `http://localhost:5173`
- If report/history pages are empty, verify the backend has a valid Firebase token and completed research sessions for that user
- If navigation fails on refresh in production, make sure your host keeps the SPA rewrite from `vercel.json`
