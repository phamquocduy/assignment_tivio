# Movie Discovery App - Summary

## Features Implemented

### Core Features

| Feature | Description |
|---------|-------------|
| **Genre Filter** | Multi-select dropdown with all TMDB genres |
| **Year Range Filter** | Dual input for start/end year (1900-current) |
| **Rating Filter** | Slider from 0-10 with 0.5 step increments |
| **Movie Grid** | Responsive grid displaying poster, title, year, rating |
| **Pagination** | Page navigation with total pages indicator |
| **Sorting** | 6 options: popularity, rating, release date (asc/desc) |
| **Movie Detail Modal** | Full movie info: overview, genres, runtime, release date |
| **Similar Movies** | Horizontal scrollable list within modal |
| **Discovery Timer** | 20-second auto-rotation with visual countdown |
| **Timer Pause/Resume** | Pauses when modal opens, resumes on close |

### Bonus Features

| Feature | Description |
|---------|-------------|
| **Responsive Design** | Mobile-first (320px+), tablet, desktop breakpoints |
| **Error Handling** | Error boundaries, user-friendly messages, retry buttons |
| **API Caching** | 3-layer caching: server ISR, Cache-Control headers, client in-memory |
| **Request Deduplication** | Prevents duplicate simultaneous API calls |
| **Shareable URLs** | Filter state and movie ID persisted in URL query params |
| **Loading States** | Skeleton loaders and spinners throughout |

---

## Process & Decision Making

### Architecture Decisions

1. **Next.js App Router** - Chose over Pages Router for modern patterns, better caching with ISR, and cleaner API routes structure.

2. **Zustand with Slices** - Split state into focused slices (filters, pagination, modal, discovery, sort) for maintainability. Avoided Redux for simplicity given app size.

3. **API Route Proxy** - All TMDB calls go through `/api/*` routes to hide API key from client and enable server-side caching.

4. **3-Layer Caching Strategy**:
   - Server: Next.js ISR with `revalidate` for TMDB responses
   - HTTP: Cache-Control headers for browser/CDN caching
   - Client: In-memory cache with URL-based TTL for instant navigation

5. **URL State Sync** - Bidirectional sync between Zustand store and URL params enables shareable links without breaking back/forward navigation.

### Code Organization

```
src/
├── app/           # Next.js App Router pages and API routes
├── components/    # React components (filters in subfolder)
├── hooks/         # Custom hooks (useFetch, useUrlSync, useDiscoveryTimer)
├── stores/        # Zustand store with slice pattern
├── libs/          # TMDB API integration
├── types/         # TypeScript interfaces
├── constants/     # App-wide constants
└── utils/         # Helper functions
```

---

## Libraries & Justification

| Library | Why |
|---------|-----|
| **Next.js 15, React 19** | Required |
| **Zustand** | Lightweight state management (~1KB), simple API, minimum boilerplate |
| **Tailwind CSS** | Rapid UI development, built-in responsive utilities, small production bundle |
| **Headless UI** | Accessible, unstyled components that integrate well with Tailwind |
| **Axios** | Better error handling, request cancellation, and interceptors compared to fetch |
| **react-error-boundary** | Declarative error boundaries with fallback UI and retry functionality |

---

## Future Improvements

Given more time, I would add:

| Improvement | Reason |
|-------------|--------|
| **i18n Translations** | Replace hardcoded text with translation keys for multi-language support |
| **Enhanced Pagination** | Add page size selector, jump-to-page input, and keyboard navigation |
| **Route Groups** | Use Next.js route groups for flexible layouts (e.g., different headers for auth pages) |
| **Icon Library** | Replace inline SVGs with a proper icon library (e.g., Heroicons) |
| **Unit Testing** | React Testing Library for hook and functions tests |
| **E2E Testing** | Playwright or Cypress for critical user flows (filtering, modal, discovery mode) |

---
