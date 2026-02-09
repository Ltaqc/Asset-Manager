# Overview

AL MARE is a one-page hotel website for a seaside Ultra All Inclusive resort. The primary goal is to drive direct bookings through a transparent, interactive pricing calculator. The site targets families and couples aged 30–55, with a light, marine-themed design (white, sand, light blue, turquoise). The interface is in Russian.

The site uses a one-page layout with anchor navigation. All content sections are on the home page (`/`) with smooth scrolling between them. The `/search` route is a separate page for search results. Booking requests are stored in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router). One-page layout with anchor navigation. Routes: `/` (main page with all sections), `/search` (search results)
- **Layout**: Shared Layout component (`client/src/components/Layout.tsx`) wraps all pages with fixed header nav and footer
- **State/Data**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS and CSS variables
- **Animations**: Framer Motion for scroll animations and transitions
- **Forms**: React Hook Form with Zod validation (via @hookform/resolvers)
- **Icons**: Lucide React
- **Typography**: Playfair Display (headings/display) and DM Sans (body) from Google Fonts
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Page Structure
- `/` (Home) — One-page layout with sections:
  1. Hero (hotel photo, 42vh, with AL MARE title + subtitle overlay)
  2. Calculator (dates + guests form → navigates to /search)
  3. About hotel
  4. Ultra All Inclusive (#uai) — checklist of what's included
  5. Food (по меню format, not buffet)
  6. Beach (with petanque and kubb games)
  7. Infrastructure (billiards, mini-golf, rest zones)
  8. Rooms (8 room categories with cards)
  9. Contacts (with Yandex Map)
- `/search` — Filters rooms by capacity, shows pricing cards with cross-month calculation, booking modal
### Shared Room Data (`client/src/lib/roomData.ts`)
Central module containing:
- `ROOM_DATA` — 8 room categories with capacity, accommodation prices by month, descriptions, images
- `FOOD_RATES` — Pricing per age group per night (adult: 4500, teen: 4500, child: 3000, toddler: 0)
- `calculateAccommodationCost(category, checkIn, checkOut)` — Room-only cost, cross-month aware
- `calculateFoodCost(adults, teens, children, nights)` — Food cost for all guests
- `calculateRoomTotalPrice(category, checkIn, checkOut, adults, teens, children)` — Single atomic function: accommodation + food = total
- `generateRecommendations()` — DFS room combo search with food cost included once per guest group
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
- Ultra All Inclusive model: EVERY price = accommodation + food, always combined, never shown separately
- ONE atomic function `calculateRoomTotalPrice(category, checkIn, checkOut, adults, teens, children)` is the single source of truth
- Accommodation pricing varies by room category and month (June through September)
- Food pricing: adult 4500/night, teen 4500/night, child 3000/night, toddler free
- Cross-month stays are calculated night-by-night using the rate for each night's month
- Single room: TotalPrice = accommodation + food (via atomic function)
- Multi-room: TotalPrice = sum(each room's accommodation) + food once for all guests
- Food cost is counted ONCE per guest group, NOT per room
- NO price breakdowns displayed: guest sees ONLY the total price
- Early booking discount (10%) applied at display level when check-in > 30 days away
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
