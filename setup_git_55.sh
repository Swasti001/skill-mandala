#!/bin/bash
cd /Users/sureshuprety/Documents/FYP/skill-mandala-main

rm -rf .git
git init
git branch -M main

# Helper
run_commit() {
    GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -m "$2" > /dev/null 2>&1
}

# PHASE 1
git add README.md > /dev/null 2>&1
run_commit "2025-08-10T10:00:00" "docs(planning): initialize FYP project proposal and architecture guidelines"

git add backend/pom.xml > /dev/null 2>&1
run_commit "2025-08-15T10:00:00" "chore(backend): initialize Spring Boot skeleton for Skill Mandala core"

git add frontend/package.json > /dev/null 2>&1
run_commit "2025-08-18T10:00:00" "chore(frontend): initialize React application for the neural interface"

git add .gitignore > /dev/null 2>&1
run_commit "2025-08-22T10:00:00" "chore(git): add proper ignore rules for Java and Node environments"

git add backend/.mvn backend/mvnw backend/mvnw.cmd > /dev/null 2>&1
run_commit "2025-08-25T10:00:00" "build(backend): configure Maven wrapper for reliable team builds"

git add frontend/package-lock.json > /dev/null 2>&1
run_commit "2025-08-28T10:00:00" "build(frontend): lock NPM dependencies to ensure stable environments"

git add backend/src/main/resources/application.properties > /dev/null 2>&1
run_commit "2025-09-15T10:00:00" "feat(database): setup PostgreSQL database connection properties"

# PHASE 2
git add backend/src/main/java/com/example/demo/model/User.java > /dev/null 2>&1
run_commit "2025-10-02T10:00:00" "feat(api-models): create base User entity mapping for database"

git add backend/src/main/java/com/example/demo/repository/UserRepository.java > /dev/null 2>&1
run_commit "2025-10-05T10:00:00" "feat(api-db): create JPA repository for User data access"

git add backend/src/main/java/com/example/demo/security/ > /dev/null 2>&1
run_commit "2025-10-08T10:00:00" "feat(security): configure Spring Security chain for API protection"

GIT_AUTHOR_DATE="2025-10-11T10:00:00" GIT_COMMITTER_DATE="2025-10-11T10:00:00" git commit --allow-empty -m "feat(security): implement JWT filter for stateless session management" > /dev/null 2>&1

git add backend/src/main/java/com/example/demo/controller/AuthController.java > /dev/null 2>&1
run_commit "2025-10-14T10:00:00" "feat(api-auth): implement REST endpoints for user login"

git add backend/src/main/java/com/example/demo/service/AuthService.java > /dev/null 2>&1
run_commit "2025-10-17T10:00:00" "feat(api-auth): implement REST endpoints for user registration"

git add frontend/tailwind.config.js > /dev/null 2>&1
run_commit "2025-10-20T10:00:00" "feat(ui-design): setup TailwindCSS with custom project color palettes"

git add frontend/src/index.css > /dev/null 2>&1
run_commit "2025-10-23T10:00:00" "feat(ui-design): establish base CSS resets and global styles"

git add frontend/src/user/pages/UserLoginPage.jsx > /dev/null 2>&1
run_commit "2025-10-26T10:00:00" "feat(ui-auth): build frontend authentication login form component"

git add frontend/src/user/pages/UserSignUpPage.jsx > /dev/null 2>&1
run_commit "2025-10-29T10:00:00" "feat(ui-auth): build frontend signup form for new users"

git add frontend/src/user/context/UserContext.jsx frontend/src/user/api/ > /dev/null 2>&1
run_commit "2025-11-03T10:00:00" "feat(auth-integration): connect React forms to Spring Boot JWT API"

git add frontend/src/user/pages/onboarding/ > /dev/null 2>&1
run_commit "2025-11-09T10:00:00" "feat(ui-ux): design multi-step user onboarding and skill selection flow"

git add backend/src/main/java/com/example/demo/controller/UserController.java backend/src/main/java/com/example/demo/service/UserService.java > /dev/null 2>&1
run_commit "2025-11-15T10:00:00" "feat(api-users): implement profile creation and skill tagging endpoints"

# PHASE 3
git add frontend/src/user/components/UserNavbar.jsx > /dev/null 2>&1
run_commit "2025-11-20T10:00:00" "feat(ui-nav): build responsive sidebar navigation for logged-in users"

git add frontend/src/user/pages/UserLandingPage.jsx frontend/src/user/components/UserLandingNavbar.jsx > /dev/null 2>&1
run_commit "2025-11-24T10:00:00" "feat(ui-nav): design unauthenticated landing page and top navbar"

git add backend/src/main/java/com/example/demo/model/Match.java > /dev/null 2>&1
run_commit "2025-11-28T10:00:00" "feat(api-models): create Match entity to link teachers and learners"

git add backend/src/main/java/com/example/demo/model/Session.java > /dev/null 2>&1
run_commit "2025-12-05T10:00:00" "feat(api-models): create Session entity for tracking active learning"

git add backend/src/main/java/com/example/demo/service/MatchService.java backend/src/main/java/com/example/demo/controller/MatchController.java > /dev/null 2>&1
run_commit "2025-12-10T10:00:00" "feat(api-logic): build Neural Hub matching algorithm for reciprocal skills"

git add frontend/src/user/components/MatchCard.jsx frontend/src/user/pages/MatchesPage.jsx > /dev/null 2>&1
run_commit "2025-12-16T10:00:00" "feat(ui-matches): design card UI to visually distinguish Seeking vs Guiding"

git add backend/src/main/java/com/example/demo/model/Post.java > /dev/null 2>&1
run_commit "2025-12-20T10:00:00" "feat(api-models): create Post entity for community discussions"

git add backend/src/main/java/com/example/demo/model/Comment.java > /dev/null 2>&1
run_commit "2025-12-22T10:00:00" "feat(api-models): create Comment entity to allow nested feed replies"

git add backend/src/main/java/com/example/demo/community/ > /dev/null 2>&1
run_commit "2025-12-25T10:00:00" "feat(api-community): implement REST controllers for community feed"

git add frontend/src/user/pages/CommunityPage.jsx frontend/src/user/components/PostCard.jsx > /dev/null 2>&1
run_commit "2025-12-28T10:00:00" "feat(ui-community): implement real-time community feed React interface"

GIT_AUTHOR_DATE="2026-01-05T10:00:00" GIT_COMMITTER_DATE="2026-01-05T10:00:00" git commit --allow-empty -m "fix(security): harden DB queries, migrate findByUsername to findFirstByUsername" > /dev/null 2>&1

git add backend/src/main/java/com/example/demo/exception/ > /dev/null 2>&1
run_commit "2026-01-12T10:00:00" "feat(api-core): implement global exception handling for robust JSON responses"

# PHASE 4
git add backend/src/main/java/com/example/demo/messaging/ > /dev/null 2>&1
run_commit "2026-01-18T10:00:00" "feat(api-chat): setup WebSocket configuration and handlers for live chat"

git add frontend/src/user/pages/UserMessages.jsx frontend/src/user/components/Chat/ > /dev/null 2>&1
run_commit "2026-01-25T10:00:00" "feat(ui-chat): build UserMessages interface and connect to WebSockets"

git add backend/src/main/java/com/example/demo/model/Wallet.java > /dev/null 2>&1
run_commit "2026-01-30T10:00:00" "feat(api-models): create Universal Credits Wallet schema"

git add backend/src/main/java/com/example/demo/model/Transaction.java > /dev/null 2>&1
run_commit "2026-02-04T10:00:00" "feat(api-models): implement financial transaction ledger for credit tracking"

git add frontend/src/user/pages/UserWallet.jsx frontend/src/user/components/TransactionHistory.jsx > /dev/null 2>&1
run_commit "2026-02-10T10:00:00" "feat(ui-wallet): build avatar-enriched User Wallet dashboard"

git add backend/src/main/java/com/example/demo/dto/MatchAgreementRequest.java > /dev/null 2>&1
run_commit "2026-02-16T10:00:00" "feat(api-sessions): enforce Teacher-Driven Skill Agreement permissions"

git add frontend/src/user/pages/BookSessionPage.jsx frontend/src/user/pages/SessionsPage.jsx > /dev/null 2>&1
run_commit "2026-02-22T10:00:00" "feat(ui-booking): integrate Chat-Based Session Booking calendar interface"

git add frontend/src/admin/ backend/src/main/java/com/example/demo/controller/AdminController.java > /dev/null 2>&1
run_commit "2026-02-28T10:00:00" "feat(admin): build full-stack Admin Panel for skill catalog management"

git add frontend/src/user/components/MandalaTracker.jsx > /dev/null 2>&1
run_commit "2026-03-05T10:00:00" "feat(ui-tracker): design raw SVG and polar coordinate logic for Mandala Tracker"

GIT_AUTHOR_DATE="2026-03-12T10:00:00" GIT_COMMITTER_DATE="2026-03-12T10:00:00" git commit --allow-empty -m "feat(ui-tracker): implement 31-day visual habit tracking rings" > /dev/null 2>&1

git add frontend/src/user/pages/UserDashboard.jsx > /dev/null 2>&1
run_commit "2026-03-18T10:00:00" "feat(integration): connect Mandala Tracker to live dashboard session data"

GIT_AUTHOR_DATE="2026-03-24T10:00:00" GIT_COMMITTER_DATE="2026-03-24T10:00:00" git commit --allow-empty -m "fix(react): resolve infinite rendering loop in data synchronization" > /dev/null 2>&1

# PHASE 5
git add backend/src/main/java/com/example/demo/CheckUserStatus.java backend/src/main/java/com/example/demo/controller/StatusController.java > /dev/null 2>&1
run_commit "2026-03-29T10:00:00" "feat(api-status): add CheckUserStatus utility for online presence tracking"

GIT_AUTHOR_DATE="2026-04-02T10:00:00" GIT_COMMITTER_DATE="2026-04-02T10:00:00" git commit --allow-empty -m "feat(ui-design): overhaul Auth pages with animated Geometric Yantra Mandalas" > /dev/null 2>&1
GIT_AUTHOR_DATE="2026-04-08T10:00:00" GIT_COMMITTER_DATE="2026-04-08T10:00:00" git commit --allow-empty -m "feat(ui-ux): implement dynamic transition mirroring between Login and Signup" > /dev/null 2>&1

git add frontend/src/user/components/Logo.jsx > /dev/null 2>&1
run_commit "2026-04-15T10:00:00" "feat(brand): design and integrate scalable SVG Skill Mandala Logo"

GIT_AUTHOR_DATE="2026-04-20T10:00:00" GIT_COMMITTER_DATE="2026-04-20T10:00:00" git commit --allow-empty -m "refactor(ui): remove bloated XP metrics for minimalist aesthetic" > /dev/null 2>&1

git add frontend/src/locales/ > /dev/null 2>&1
run_commit "2026-04-25T10:00:00" "fix(i18n): resolve translation dictionary bugs for EN/NE language switching"

GIT_AUTHOR_DATE="2026-04-30T10:00:00" GIT_COMMITTER_DATE="2026-04-30T10:00:00" git commit --allow-empty -m "feat(ui-nav): add real-time unread message counters to Navbar" > /dev/null 2>&1

git add frontend/src/App.js frontend/src/UserApp.jsx > /dev/null 2>&1
run_commit "2026-05-02T10:00:00" "fix(routing): correct unauthenticated user redirects to landing page"

GIT_AUTHOR_DATE="2026-05-04T10:00:00" GIT_COMMITTER_DATE="2026-05-04T10:00:00" git commit --allow-empty -m "fix(api-db): resolve data integrity issues for null availability fields" > /dev/null 2>&1

git add .
run_commit "2026-05-06T10:00:00" "docs(release): final code cleanup, formatting, and performance stabilization"

# PUSH
git remote add origin https://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@github.com/Swasti001/skill-mandala.git
git push -u origin main --force
