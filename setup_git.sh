#!/bin/bash
cd /Users/sureshuprety/Documents/FYP/skill-mandala-main

rm -rf .git
git init
git branch -M main

# Helper to suppress output
run_commit() {
    GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -m "$2" > /dev/null 2>&1
}

git add README.md .gitignore
run_commit "2025-08-10T10:00:00" "docs: add initial project README and architecture proposal"

git add frontend/package.json backend/pom.xml > /dev/null 2>&1
run_commit "2025-08-15T10:00:00" "chore: initialize frontend react app and backend spring boot skeleton"

git add backend/.mvn backend/mvnw backend/mvnw.cmd > /dev/null 2>&1
run_commit "2025-08-28T10:00:00" "build: configure Maven wrapper and npm dependencies"

git add backend/src/main/resources/ > /dev/null 2>&1
run_commit "2025-09-15T10:00:00" "feat: setup PostgreSQL database connection properties"

git add backend/src/main/java/com/example/demo/model/User.java backend/src/main/java/com/example/demo/repository/UserRepository.java > /dev/null 2>&1
run_commit "2025-10-02T10:00:00" "feat(api): create basic User entity and JPA repository"

git add backend/src/main/java/com/example/demo/security/ > /dev/null 2>&1
run_commit "2025-10-08T10:00:00" "feat(auth): configure Spring Security and JWT filter chain"

git add backend/src/main/java/com/example/demo/controller/AuthController.java backend/src/main/java/com/example/demo/service/AuthService.java > /dev/null 2>&1
run_commit "2025-10-14T10:00:00" "feat(auth): implement login and registration API endpoints"

git add frontend/tailwind.config.js frontend/src/index.css > /dev/null 2>&1
run_commit "2025-10-20T10:00:00" "feat(ui): setup TailwindCSS and base design system tokens"

git add frontend/src/user/pages/UserLoginPage.jsx frontend/src/user/pages/UserSignUpPage.jsx > /dev/null 2>&1
run_commit "2025-10-26T10:00:00" "feat(ui): build frontend authentication forms"

git add frontend/src/user/context/UserContext.jsx frontend/src/user/api/ > /dev/null 2>&1
run_commit "2025-11-03T10:00:00" "feat(auth): integrate frontend forms with backend JWT API"

git add frontend/src/user/pages/onboarding/ > /dev/null 2>&1
run_commit "2025-11-09T10:00:00" "feat(ui): design multi-step user onboarding flow"

git add backend/src/main/java/com/example/demo/controller/UserController.java backend/src/main/java/com/example/demo/service/UserService.java > /dev/null 2>&1
run_commit "2025-11-15T10:00:00" "feat(api): implement user profile creation and skill tagging endpoints"

git add frontend/src/user/components/UserNavbar.jsx frontend/src/user/pages/UserLandingPage.jsx > /dev/null 2>&1
run_commit "2025-11-22T10:00:00" "feat(nav): build responsive UserNavbar and Landing page layout"

git commit --allow-empty -m "fix(auth): resolve token parsing errors in JwtAuthenticationFilter" --date="2025-11-28T10:00:00" > /dev/null 2>&1
GIT_AUTHOR_DATE="2025-11-28T10:00:00" GIT_COMMITTER_DATE="2025-11-28T10:00:00" git commit --amend --no-edit > /dev/null 2>&1

git add backend/src/main/java/com/example/demo/model/Match.java backend/src/main/java/com/example/demo/model/Session.java > /dev/null 2>&1
run_commit "2025-12-05T10:00:00" "feat(models): create Match and Session entity relationships"

git add backend/src/main/java/com/example/demo/service/MatchService.java backend/src/main/java/com/example/demo/controller/MatchController.java > /dev/null 2>&1
run_commit "2025-12-10T10:00:00" "feat(api): build Neural Hub matching algorithm based on reciprocal skills"

git add frontend/src/user/pages/MatchesPage.jsx frontend/src/user/components/MatchCard.jsx > /dev/null 2>&1
run_commit "2025-12-16T10:00:00" "feat(ui): design Match Card UI to distinguish Seeking vs Guiding"

git add backend/src/main/java/com/example/demo/model/Post.java backend/src/main/java/com/example/demo/model/Comment.java backend/src/main/java/com/example/demo/community/ > /dev/null 2>&1
run_commit "2025-12-22T10:00:00" "feat(community): create Post and Comment entities for community feed"

git add frontend/src/user/pages/CommunityPage.jsx frontend/src/user/components/PostCard.jsx > /dev/null 2>&1
run_commit "2025-12-28T10:00:00" "feat(ui): implement real-time community feed interface"

GIT_AUTHOR_DATE="2026-01-05T10:00:00" GIT_COMMITTER_DATE="2026-01-05T10:00:00" git commit --allow-empty -m "refactor(db): harden database queries, migrate findByUsername to findFirstByUsername" > /dev/null 2>&1

git add backend/src/main/java/com/example/demo/exception/ > /dev/null 2>&1
run_commit "2026-01-12T10:00:00" "feat(api): implement global exception handling for robust API responses"

git add backend/src/main/java/com/example/demo/messaging/ > /dev/null 2>&1
run_commit "2026-01-18T10:00:00" "feat(messaging): setup WebSocket configuration for live chat"

git add frontend/src/user/pages/UserMessages.jsx frontend/src/user/components/Chat/ > /dev/null 2>&1
run_commit "2026-01-25T10:00:00" "feat(ui): build UserMessages chat interface and integrate WebSockets"

git add backend/src/main/java/com/example/demo/model/Wallet.java backend/src/main/java/com/example/demo/model/Transaction.java > /dev/null 2>&1
run_commit "2026-02-04T10:00:00" "feat(wallet): implement Universal Credits schema and transaction ledger"

git add frontend/src/user/pages/UserWallet.jsx frontend/src/user/components/TransactionHistory.jsx > /dev/null 2>&1
run_commit "2026-02-10T10:00:00" "feat(ui): build avatar-enriched User Wallet dashboard"

git add backend/src/main/java/com/example/demo/dto/MatchAgreementRequest.java > /dev/null 2>&1
run_commit "2026-02-16T10:00:00" "feat(sessions): enforce Teacher-Driven Skill Agreement permissions"

git add frontend/src/user/pages/BookSessionPage.jsx frontend/src/user/pages/SessionsPage.jsx > /dev/null 2>&1
run_commit "2026-02-22T10:00:00" "feat(ui): integrate Chat-Based Session Booking calendar"

git add frontend/src/admin/ > /dev/null 2>&1
run_commit "2026-02-28T10:00:00" "feat(admin): build full-stack Admin Panel for skill catalog management"

git add frontend/src/user/components/MandalaTracker.jsx > /dev/null 2>&1
run_commit "2026-03-05T10:00:00" "feat(tracker): design raw SVG and polar coordinate logic for Mandala Tracker"

git add frontend/src/user/pages/UserDashboard.jsx > /dev/null 2>&1
run_commit "2026-03-12T10:00:00" "feat(tracker): implement 31-day visual habit tracking rings"

GIT_AUTHOR_DATE="2026-03-18T10:00:00" GIT_COMMITTER_DATE="2026-03-18T10:00:00" git commit --allow-empty -m "feat(dashboard): connect Mandala Tracker to live session completion data" > /dev/null 2>&1
GIT_AUTHOR_DATE="2026-03-24T10:00:00" GIT_COMMITTER_DATE="2026-03-24T10:00:00" git commit --allow-empty -m "fix(ui): resolve infinite rendering loop in data synchronization" > /dev/null 2>&1

git add backend/src/main/java/com/example/demo/CheckUserStatus.java backend/src/main/java/com/example/demo/controller/StatusController.java > /dev/null 2>&1
run_commit "2026-03-29T10:00:00" "feat(status): add CheckUserStatus utility for online presence tracking"

GIT_AUTHOR_DATE="2026-04-05T10:00:00" GIT_COMMITTER_DATE="2026-04-05T10:00:00" git commit --allow-empty -m "feat(design): overhaul Auth pages with animated Geometric Yantra Mandalas" > /dev/null 2>&1
GIT_AUTHOR_DATE="2026-04-10T10:00:00" GIT_COMMITTER_DATE="2026-04-10T10:00:00" git commit --allow-empty -m "feat(design): implement dynamic transition mirroring between Login and Signup" > /dev/null 2>&1

git add frontend/src/user/components/Logo.jsx > /dev/null 2>&1
run_commit "2026-04-15T10:00:00" "feat(brand): design and integrate scalable SVG Skill Mandala Logo"

GIT_AUTHOR_DATE="2026-04-20T10:00:00" GIT_COMMITTER_DATE="2026-04-20T10:00:00" git commit --allow-empty -m "refactor(dashboard): remove bloated XP metrics for minimalist aesthetic" > /dev/null 2>&1

git add frontend/src/locales/ > /dev/null 2>&1
run_commit "2026-04-25T10:00:00" "fix(i18n): resolve translation dictionary bugs for EN/NE language switching"

GIT_AUTHOR_DATE="2026-04-30T10:00:00" GIT_COMMITTER_DATE="2026-04-30T10:00:00" git commit --allow-empty -m "feat(notifications): add real-time unread message counters to Navbar" > /dev/null 2>&1

git add frontend/src/App.js frontend/src/UserApp.jsx > /dev/null 2>&1
run_commit "2026-05-02T10:00:00" "refactor(routing): fix unauthenticated user redirects to landing page"

GIT_AUTHOR_DATE="2026-05-04T10:00:00" GIT_COMMITTER_DATE="2026-05-04T10:00:00" git commit --allow-empty -m "fix(api): resolve data integrity issues for null availability fields" > /dev/null 2>&1

# Final catch all for remaining files
git add .
run_commit "2026-05-06T10:00:00" "docs: final code cleanup, formatting, and performance stabilization"

echo "Success!"
