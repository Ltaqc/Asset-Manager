# Overview

AL MARE is a multi-page hotel website for a seaside Ultra All Inclusive resort. The primary goal is to drive direct bookings through a transparent, interactive pricing calculator. The site targets families and couples aged 30–55, with a light, marine-themed design (white, sand, light blue, turquoise). The interface is in Russian.

The core feature is an interactive room search: guests enter dates and guest composition on the home page, then navigate to /search where all suitable rooms are displayed with calculated prices. Booking requests are stored in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router). Multi-page app with 7 pages: /, /search, /rooms, /food, /beach, /infrastructure, /contacts
- **Layout**: Shared Layout component (`client/src/components/Layout.tsx`) wraps all pages with fixed header nav and footer
- **State/Data**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS and CSS variables
- **Animations**: Framer Motion for scroll animations and transitions
- **Forms**: React Hook Form with Zod validation (via @hookform/resolvers)
- **Icons**: Lucide React
- **Typography**: Playfair Display (headings/display) and DM Sans (body) from Google Fonts
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Page Structure
- `/` (Home) — Hero, about hotel, search form (dates + guests) → navigates to /search
- `/search` — Filters rooms by capacity, shows pricing cards with cross-month calculation, booking modal
- `/rooms` — All 8 room categories with descriptions, photos, capacity, link to calculator
- `/food` — Ultra All Inclusive content (breakfast/lunch/dinner, snacks, BBQ)
- `/beach` — Beach description with markers and gallery
- `/infrastructure` — Amenities grid (parking, mini-golf, pool, etc.) with adults/kids sections
- `/contacts` — Phone, email, Telegram, address cards

### Shared Room Data (`client/src/lib/roomData.ts`)
Central module containing:
- `ROOM_DATA` — 8 room categories with capacity, prices by month, descriptions, images
- `FOOD_RATES` — Pricing per age group per night
- `calculateStay()` — Cross-month aware pricing calculation
- `isRoomSuitable()` — Capacity filtering with crib rules (max 1 toddler)
- `formatPrice()`, `nightsLabel()`, helper functions

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via tsx)
- **Architecture**: Simple REST API with typed route definitions shared between client and server
- **API Pattern**: Routes are defined in `shared/routes.ts` with Zod schemas for input validation and response typing
- **Development**: Vite dev server runs as middleware inside Express (see `server/vite.ts`) with HMR support
- **Production**: Client built by Vite to `dist/public`, server bundled by esbuild to `dist/index.cjs`

### Shared Layer (`shared/`)
- **Schema** (`shared/schema.ts`): Drizzle ORM table definitions and Zod schemas generated via `drizzle-zod`. Contains the `bookings` table, room categories, and months data
- **Routes** (`shared/routes.ts`): Typed API route definitions with method, path, input schema, and response schemas

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
- Room pricing varies by room category and month (June through September)
- Cross-month stays are calculated night-by-night using the rate for each night's month
- Food rates: adults/teens 4500₽/night, children 3000₽/night, toddlers free
- Capacity: adults + teens + children must fit room cap; max 1 toddler (crib)

### API Endpoints
- `POST /api/bookings` - Create a new booking request

### Build System
- **Dev**: `tsx server/index.ts` runs the server with Vite middleware for HMR
- **Build**: Custom build script (`script/build.ts`) runs Vite for client and esbuild for server
- **Start**: `node dist/index.cjs` serves the production build

## External Dependencies

- **PostgreSQL**: Required database, connected via `DATABASE_URL` environment variable
- **Google Fonts**: Playfair Display and DM Sans loaded via CSS import and HTML link tags
- **Unsplash**: Room and beach images loaded from `images.unsplash.com`
- **No authentication**: The app currently has no auth system; booking submissions are open
