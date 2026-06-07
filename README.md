# Advista Client

React and Vite frontend for Advista — a competitive intelligence and ad research assistant. Handles Firebase auth, chat-driven research intake, live SSE streaming, and report rendering.

The api has seprate repo: [Advista API](https://github.com/ayushjrathod/Advista_api)

---

## What is this project?

Advista_client is the browser-facing half of the Advista product. It presents the marketing pages, handles Firebase authentication in the browser, guides the user through a conversational intake chatbot that builds a research brief, triggers research generation via the API, and renders the completed competitive intelligence report.

This project is the user experience layer. All orchestration, data collection, and report synthesis happen in Advista_api — this client's job is to make that pipeline feel fast, responsive, and intuitive.

---

## Purpose

The client was built to demonstrate a production-quality React application with Firebase-powered auth including sign-up, sign-in, anonymous access, email verification, and password reset. It also demonstrates a real-time streaming UX using SSE for both the chatbot intake and research progress, a polished design system built on Tailwind CSS 4 with Framer Motion animations and Three.js 3D elements, SPA routing on Vercel with proper fallback rewrites, and lazy-loaded page bundles for a fast initial load.

---

## Tech Stack

The application is written in JavaScript using ES modules. The UI framework is React 19, built and served in development with Vite 7. Routing is handled by React Router 7. Authentication in the browser uses the Firebase Web SDK. Styling is done with Tailwind CSS 4. Animations and transitions use Framer Motion. Unstyled accessible UI primitives come from Radix UI. Standard HTTP requests go through Axios. The landing page hero element is built with Three.js via React Three Fiber. The package manager is Bun, though npm also works. The app deploys to Vercel as a single-page application using the rewrite rules in `vercel.json`. Linting uses ESLint.

---

## Application Structure

The entry point is `src/App.jsx`, which registers all routes and lazy-loads their page components. The `src/pages/` directory holds every route-level screen: the landing page, about page, auth screens (sign-in, sign-up, verify, forgot password, reset password), the research intake chatbot, the completed report view, the saved research history, and the cube-recorder development utility. The `src/components/` directory holds reusable pieces grouped by feature area: `auth/` for auth form components, `landing/` for marketing page sections, `research-report/` for the report sidebar and section renderers, and `ui/` for shared design system primitives. The `src/contexts/` directory has `AuthContext.jsx` managing Firebase auth state and the `use-auth.js` hook for consuming it. The `src/lib/` directory has `api.js` for the Axios client setup and `firebase.js` for Firebase app initialization and token helpers. The `src/schemas/` directory holds client-side form validation schemas. The `public/` directory holds static assets. The `scripts/` directory has `export-cube-video.mjs` for exporting the Three.js cube animation as a video file.

---

## Routes

The root path `/` renders the public landing page. `/about` renders the about page. `/sign-in` and `/sign-up` render the Firebase-powered auth screens. `/verify/:email` is a helper page that guides the user through the email verification step after sign-up. `/forgot-password` and `/reset-password/:email` handle the Firebase password reset flow. `/chat` is the research intake chatbot and is accessible to anonymous Firebase users. `/research-report` shows a completed report and requires a verified account. `/history` shows saved research sessions and also requires a verified account. `/cube-recorder` is a development utility page for exporting the 3D cube animation asset.

---

## Auth Behavior

Firebase handles all identity operations in the browser. The client initializes the Firebase Web SDK from the `VITE_FIREBASE_*` environment variables, listens to `onAuthStateChanged` via `AuthContext`, and attaches Firebase ID tokens automatically to every Axios request as an `Authorization: Bearer` header. Anonymous Firebase sign-in is used for visitors who want to try the product without creating an account. Verified email is required for routes that access saved history or owned reports.

If the Firebase config environment variables are missing, auth screens show a clear configuration warning and disable auth-dependent buttons rather than crashing the application.

---

## API Communication

`src/lib/api.js` builds an Axios client from `VITE_API_URL`. Firebase ID tokens are injected automatically. Lambda-wrapped API responses — which have an extra `body` envelope — are transparently unwrapped client-side so pages consume a normal payload shape. The chatbot page uses native `fetch` with manual SSE stream parsing for `POST /api/v1/chat/stream` because Axios does not support streaming responses in the browser out of the box. The Vite dev server proxies all `/api/*` requests to `VITE_API_URL`, which eliminates CORS issues during local development.

---

## Setup

### Prerequisites

You need Node.js 20 or newer, or Bun. You also need a running Advista_api instance and Firebase Web app credentials from your Firebase project settings.

### Install dependencies

```bash
# With Bun
bun install

# With npm
npm install
```

### Configure environment

Create `.env` in `Advista_client/`:

```env
VITE_API_URL=http://localhost:8000

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
```

`VITE_API_URL` defaults to `http://localhost:8000` if omitted. Firebase auth is only enabled when all five `VITE_FIREBASE_*` keys are present.

### Start the dev server

```bash
bun run dev
# or
npm run dev
```

The Vite dev server runs on `http://localhost:5173`.

---

## Available Scripts

`dev` starts the local development server with hot module replacement. `build` produces a production build in the `dist/` directory. `preview` serves the production build locally for inspection before deployment. `lint` runs ESLint across the source tree. `export:cube-video` runs the `scripts/export-cube-video.mjs` utility to export the Three.js cube animation as a video file.

---

## Deployment

The app deploys as a single-page application. `vercel.json` rewrites all routes to `index.html` so React Router handles navigation on the client side. Production builds are generated with `vite build`. All `VITE_*` environment variables must be set in the Vercel project settings before deploying.

---

## Design Tradeoffs

### Tailwind CSS 4 over vanilla CSS

Tailwind 4 was chosen for the utility-first approach, which allows rapid iteration on design without context-switching to a separate stylesheet, and keeps style decisions co-located with markup. Highly custom or animated elements — the Three.js cube, SSE stream animations, and complex hover states — still require custom CSS or inline styles when Tailwind's utility vocabulary runs out. That boundary is acceptable for this design scope.

### Framer Motion for animations

Framer Motion handles the declarative animation layer — page transitions, component mount animations, and interactive micro-effects. The alternative was CSS animations and `useEffect` timing hacks. Framer Motion's `AnimatePresence` and layout animations are genuinely difficult to replicate cleanly in pure CSS for dynamic list changes and route transitions. The cost is bundle size. Framer Motion is not small, but for a product where the landing page needs to make an immediate visual impression, the bundle cost was considered acceptable.

### Three.js for the hero 3D element

The landing page uses a Three.js scene via React Three Fiber for a rotating 3D cube that serves as the brand hero element. This is deliberate visual differentiation — most competitor landing pages use static images or Lottie animations. The tradeoff is setup complexity and a non-trivial render loop running on the main page load. The `cube-recorder` route and `export-cube-video.mjs` script provide an escape hatch: the animation can be exported as a video file for use in contexts where WebGL is not available, such as email or OG images.

### Anonymous Firebase auth for unauthenticated visitors

Rather than gating the product entirely behind auth, anonymous Firebase sign-in lets visitors try the chatbot intake flow without creating an account. This reduces friction for new users evaluating the product. The tradeoff is that anonymous sessions are ephemeral — if a user closes the browser before signing up, their session is lost, and merging an anonymous session into a real account post-signup requires additional backend logic that is not currently implemented.

### Lazy loading for all page routes

Every page route is lazy-loaded via `React.lazy()` and `Suspense`. This keeps the initial bundle small and defers page code until navigation. The tradeoff is a brief loading flash on first navigation to each page. A loading skeleton or transition could smooth this, but it was considered low-priority for the current scope.

### Axios for standard HTTP, native fetch for SSE

Axios handles all standard HTTP requests cleanly with interceptors for auth token injection and response unwrapping. SSE streaming requires native `fetch` and a manual `ReadableStream` reader because Axios does not support streaming browser responses. Using two different HTTP mechanisms adds cognitive overhead, but building a custom SSE-aware Axios adapter was not worth the complexity for a single streaming endpoint.

---

## What I'd Do Differently

Adding TypeScript would be the highest-leverage change. The codebase uses `jsconfig.json` for path aliases and IDE support, but it is plain JavaScript. TypeScript would catch API shape mismatches between the client and API responses at compile time, which is particularly valuable in the SSE parsing code where the event shape is implicit and errors surface at runtime.

Implementing proper SSE error recovery is the next priority. The current SSE client disconnects if the stream ends unexpectedly and shows a generic error. A reconnect-with-exponential-backoff strategy and a visible connection status indicator would make the chatbot feel more resilient on flaky networks.

Merging anonymous sessions post-signup would convert users who tried the product before signing up into users with a complete history. Firebase has mechanisms for anonymous-to-permanent account upgrade — wiring this up on both the client and backend would close the retention gap.

Progressive enhancement for the Three.js element would help on low-end devices and with crawlers. The hero cube requires WebGL. On devices where WebGL is unavailable or too slow, the current fallback renders nothing. A static image fallback using the exported video would handle these cases gracefully.

Route-level auth guards with better UX would reduce confusion for users who land on protected pages via deep links. Currently protected routes redirect without clear messaging. A proper auth gate component with a visible call to action would communicate the requirement clearly.

Adding bundle analysis to the build pipeline would make it easy to identify and lazy-load or replace components that are disproportionately large. Three.js, Framer Motion, and Radix UI are all non-trivial in size, and a `rollup-plugin-visualizer` step in the build would keep the bundle accountable over time.

---

## Troubleshooting

If auth buttons are disabled, check that all five `VITE_FIREBASE_*` environment variables are present and correct. If API calls fail in development, confirm that `VITE_API_URL` points to the running backend and that the API allows `http://localhost:5173` in its CORS configuration. If report or history pages are empty, verify the backend has completed research sessions for the authenticated user. If navigation fails on a full-page refresh in production, check that the Vercel SPA rewrite from `vercel.json` is applied in the project settings. If the 3D cube does not render, check the browser console for WebGL renderer errors — not all devices support WebGL.
