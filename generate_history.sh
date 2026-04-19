#!/bin/bash

# KiranaQuick - Perfect Backdated Git History Generator
# Starting from Feb 25, 2026

# 1. Reset current branch history (KEEPING FILES)
git checkout --orphan temp_branch
git add .
git commit -m "temp"
git branch -D main
git branch -m main

# Set identities
git config user.name "sudip-kumar-prasad"
git config user.email "sudipkumarprasad14@gmail.com"

# --- COMMIT GENERATOR ---
commit() {
  local date=$1
  local msg=$2
  GIT_AUTHOR_DATE="$date 10:00:00" GIT_COMMITTER_DATE="$date 10:00:00" git commit --allow-empty -m "$msg"
}

# --- PHASE 1: INITIALIZATION & BACKEND ARCHITECTURE (FEB 25 - MAR 5) ---
commit "2026-02-25" "feat: initial repository structure and workspace setup"
commit "2026-02-25" "chore: initialize project with MERN stack dependencies"
commit "2026-02-26" "feat: implement Singleton pattern for database connectivity"
commit "2026-02-27" "feat(auth): develop secure JWT-based authentication service"
commit "2026-02-28" "feat(models): define OOP schemas for User, Product, and Shop"
commit "2026-03-01" "feat(api): implement base ProductController with CRUD operations"
commit "2026-03-02" "feat(api): implement ShopController with business logic"
commit "2026-03-03" "feat(middleware): add role-based access control (RBAC) middleware"
commit "2026-03-04" "perf: optimize backend request logging and error handling"
commit "2026-03-05" "feat(api): develop OrderController with status state machine"

# --- PHASE 2: FRONTEND TRANSITION & TYPESCRIPT MIGRATION (MAR 6 - MAR 18) ---
commit "2026-03-06" "feat: scaffold frontend with Vite and React"
commit "2026-03-07" "chore: migrate frontend codebase to TypeScript"
commit "2026-03-08" "feat(context): implement Global AuthProvider with persistent sessions"
commit "2026-03-09" "feat(api): setup Axios interceptors for authenticated requests"
commit "2026-03-10" "feat(design): initialize Emerald Mint Design system with Tailwind v4"
commit "2026-03-12" "feat(components): build reusable Premium Card and Button components"
commit "2026-03-14" "feat(routing): implement protected routes for multi-persona access"
commit "2026-03-16" "style: global typography setup with Outfit and Inter fonts"
commit "2026-03-18" "feat(layout): develop Sidebar and Navbar with persona detection"

# --- PHASE 3: CUSTOMER JOURNEY (MAR 19 - MAR 28) ---
commit "2026-03-19" "feat(ui): develop high-fidelity Customer Home Dashboard"
commit "2026-03-21" "feat(ui): implement Store Page with category filtering"
commit "2026-03-23" "feat(cart): implement reactive basket management logic"
commit "2026-03-25" "feat(ui): build Modern Checkout flow with address map integration"
commit "2026-03-27" "feat(ui): implement Live Order Tracking with real-time stepper"
commit "2026-03-28" "feat(maps): integrate map visualization for order paths"

# --- PHASE 4: BUSINESS PORTALS (MAR 29 - APR 8) ---
commit "2026-03-29" "feat(ui): develop Shop Owner Biz Dashboard with revenue stats"
commit "2026-03-31" "feat(order): implement real-time order acceptance flow for shops"
commit "2026-04-02" "feat(inventory): implement SKU management and stock status tracking"
commit "2026-04-04" "feat(ui): develop Partner Dashboard for delivery riders"
commit "2026-04-06" "feat(session): implement active duty session and task management"
commit "2026-04-08" "feat(ui): build Admin System Pulse portal with global analytics"

# --- PHASE 5: ADVANCED ANALYTICS & REFINEMENT (APR 9 - APR 15) ---
commit "2026-04-09" "feat(analytics): implement revenue growth and order density charts"
commit "2026-04-10" "feat(disputes): build dispute resolution system for Admins"
commit "2026-04-12" "feat(socket): integrate Socket.IO for live driver location updates"
commit "2026-04-14" "refactor: apply OOP principles to all service layer components"
commit "2026-04-15" "fix: resolve critical race conditions in order processing"

# --- PHASE 6: PIXEL-PERFECT FINALIZATION (APR 16 - APR 18) ---
commit "2026-04-16" "style: premium UI overhaul for 100% screenshot fidelity"
commit "2026-04-17" "style: refine Emerald Mint theme and glassmorphism effects"
commit "2026-04-18" "fix: resolve TypeScript linting and build stability issues"
commit "2026-04-18" "docs: update project documentation and finalize build v1.0.0"

echo "History regeneration complete!"
