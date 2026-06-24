# Adyen Dog Connect 🐾

An internal wellbeing platform that connects Amsterdam-based Adyeners who own dogs with
teammates who'd love to spend time with a furry friend. Styled in the Adyen green brand palette.

## Why
Spending a few minutes around a dog lowers stress, boosts mood, encourages movement and builds
connection across teams. Adyen Dog Connect makes those moments easy to find and book at the office.

## Two roles, two interfaces
- **Dog Owner** — Adds a dog profile (upload photos from your device or paste a URL, description,
  traits) and a weekly availability schedule, then approves, reschedules or declines incoming
  booking requests from a dedicated owner dashboard.
- **Dog Supporter** — Browses the dog catalogue, picks a dog, and books a specific date & time.
  Tracks request status and accepts proposed times from a supporter dashboard.

Every signed-in member can **switch between the Owner and Supporter interfaces** at any time using
the toggle in the top navigation — handy for people who are both.

## Features
- Marketing landing page covering the mental-health benefits of dogs + how it works.
- Searchable/filterable dog catalogue with detail pages.
- Role-based sign up & login (role selection during onboarding).
- Booking lifecycle: `pending → approved / declined / proposed → accepted`.
- All data persists in the browser via `localStorage` (no backend required).

## Tech stack
- React 18 + Vite
- React Router
- Tailwind CSS
- lucide-react icons

## Getting started
```bash
npm install
npm run dev
```
Then open the URL Vite prints (default http://localhost:5173).

### Demo accounts (password: `demo`)
| Email | Role |
| --- | --- |
| sanne@adyen.com | Dog Owner |
| maya@adyen.com | Dog Supporter |

> Data (including uploaded photos, stored as data URLs) persists in the browser. To reset, clear
> the site's `localStorage` (keys prefixed with `paws_`).

## Project structure
```
src/
  components/   Navbar, Footer, DogCard, DogForm, ProtectedRoute
  context/      AppContext — state + localStorage persistence
  data/         seed.js — initial users, dogs, bookings
  lib/          utils.js — date & status helpers
  pages/        Home, Catalogue, DogDetail, Signup, Login,
                OwnerDashboard, SupporterDashboard, NotFound
```
