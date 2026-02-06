# Overview

AL MARE is a hotel website for a seaside Ultra All Inclusive resort. The primary goal is to drive direct bookings through a transparent, interactive pricing calculator. The site targets families and couples aged 30–55, with a light, marine-themed design (white, sand, light blue, turquoise). The interface is in Russian.

The core feature is an interactive cost calculator where guests select a room category, travel month, number of nights, and guest composition (adults, teens, children, toddlers) to get an instant price estimate. Completed calculations can be submitted as booking requests stored in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router). Single-page app with Home page and 404 fallback
- **State/Data**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS and CSS variables
- **Animations**: Framer Motion for scroll animations and transitions
- **Forms**: React Hook Form with Zod validation (via @hookform/resolvers)
- **Icons**: Lucide React
- **Typography**: Playfair Display (headings/display) and DM Sans (body) from Google Fonts
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via tsx)
- **Architecture**: Simple REST API with typed route definitions shared between client and server
- **API Pattern**: Routes are defined in `shared/routes.ts` with Zod schemas for input validation and response typing. This gives type-safe API contracts shared across the full stack
- **Development**: Vite dev server runs as middleware inside Express (see `server/vite.ts`) with HMR support
- **Production**: Client built by Vite to `dist/public`, server bundled by esbuild to `dist/index.cjs`

### Shared Layer (`shared/`)
- **Schema** (`shared/schema.ts`): Drizzle ORM table definitions and Zod schemas generated via `drizzle-zod`. Contains the `bookings` table, room categories, and months data
- **Routes** (`shared/routes.ts`): Typed API route definitions with method, path, input schema, and response schemas. Acts as a contract between frontend and backend

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Driver**: `pg` (node-postgres) with connection pool
- **Schema management**: `drizzle-kit push` for schema migrations (configured in `drizzle.config.ts`)
- **Tables**: Single `bookings` table with fields for room category, check-in/out dates, guest counts by age group, total price, contact info, and timestamp
- **Connection**: Requires `DATABASE_URL` environment variable

### Data Model
The `bookings` table stores:
- `roomCategory` (text) - Selected room type
- `checkIn`, `checkOut` (text) - Date strings
- `adults`, `teens`, `children`, `toddlers` (integer) - Guest counts
- `totalPrice` (integer) - Calculated total in rubles
- `contactName`, `contactPhone` (text, nullable) - Guest contact info
- `createdAt` (timestamp) - Auto-set on creation

### Pricing Logic
Room pricing and food rates are hardcoded in the client-side Calculator component (`ROOM_DATA` and `FOOD_RATES`). Prices vary by room category and month (June through September). Food rates differ by age group (adults/teens: 4500₽, children: 3000₽, toddlers: free).

### API Endpoints
- `POST /api/bookings` - Create a new booking request. Validates input with Zod, stores in database, returns the created booking

### Build System
- **Dev**: `tsx server/index.ts` runs the server with Vite middleware for HMR
- **Build**: Custom build script (`script/build.ts`) runs Vite for client and esbuild for server. Server dependencies on an allowlist are bundled; others are external
- **Start**: `node dist/index.cjs` serves the production build

## External Dependencies

- **PostgreSQL**: Required database, connected via `DATABASE_URL` environment variable
- **Google Fonts**: Playfair Display and DM Sans loaded via CSS import and HTML link tags
- **Unsplash**: Hero background image loaded from `images.unsplash.com`
- **No authentication**: The app currently has no auth system; booking submissions are open
- **Replit plugins**: Optional Vite plugins for development (`@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`) loaded conditionally in non-production environments