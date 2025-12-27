# Template Roadmap

## ☁️ Cloudflare Platform Status

### Currently Using ✅
- **Workers** - API backend (Hono)
- **Pages** - Frontend (React + Vite)
- **D1** - SQLite database
- **KV** - Session storage

### Planned Integrations 🎯
- **R2** - Object storage (#5)
- **Queues** - Background jobs (#8)
- **Cron Triggers** - Scheduled tasks (#8)
- **Workflows** - Multi-step orchestration (#8)
- **Email Routing** - Transactional emails (#1)
- **Turnstile** - Bot protection (#3)
- **Rate Limiting API** - Advanced rate limits (#3)
- **Images** - Image optimization (#5)
- **Analytics Engine** - Custom metrics (#7)
- **Durable Objects** - Real-time features (#24)
- **Workers AI** - LLM inference (#19)
- **Vectorize** - Vector database (#20)
- **Browser Rendering** - Screenshots/PDFs (#21)

---



## 🚨 Critical (Production Blockers)

- [X] CRITICAL - No custom backend call from url (we do service bindings) we will always use rpc calls, or workers.ts to route to the correct endpoint. add instructions to CLAUDE.md CLAUDE.md

### 1. Email Setup
- [X] Choose provider: Resend (easy) OR Cloudflare Email Routing (free, needs domain) (We went with resend)
- [X] Email verification flow for Better Auth
- [X] Welcome email on signup
- [X] Password reset emails (OTP-based via better-auth emailOTP plugin)
- [X] Email templates (React Email) - OTP, Magic Link, Verification, Welcome, Password Reset
- [X] Email environment variables in `.env.example`
- [X] Magic link login (better-auth magicLink plugin)

### 2. Testing Infrastructure
- [ ] Add Vitest for unit/integration tests
- [ ] API route testing examples
- [ ] React component testing setup (Testing Library)
- [ ] E2E testing framework (Playwright?)
- [ ] Test database setup/teardown utilities
- [ ] CI/CD pipeline (GitHub Actions)

### 3. Environment & Security
- [ ] Create `.env.example` with all required vars
- [ ] Document secret management (Cloudflare secrets)
- [ ] CORS middleware configuration
- [ ] Security headers (Helmet for Hono)
- [ ] Cloudflare Turnstile (bot protection for signup/login)
- [ ] Rate limiting for general API endpoints (Cloudflare Rate Limiting API)
- [ ] API key/token management system

### 4. Social Authentication
- [ ] Google OAuth integration
- [ ] GitHub OAuth integration
- [ ] OAuth provider configuration docs
- [ ] Better Auth social provider setup
- [ ] Social account linking

---

## 🎯 High Priority (Core Features)

### 5. Storage (Cloudflare R2)
- [ ] R2 bucket setup with Alchemy
- [ ] File upload API endpoint
- [ ] Cloudflare Images integration (on-the-fly optimization, resize, WebP conversion)
- [ ] Avatar upload functionality
- [ ] Signed URL generation (pre-signed uploads/downloads)
- [ ] File type validation & size limits
- [ ] Multipart upload for large files

### 6. Payments (Stripe)
- [ ] Stripe integration
- [ ] Subscription plans setup
- [ ] Checkout flow
- [ ] Webhook handling
- [ ] Customer portal integration
- [ ] Payment status in user dashboard

### 7. Monitoring & Observability
- [ ] Error tracking (Sentry/Cloudflare Workers Analytics)
- [ ] Structured logging
- [ ] Performance monitoring
- [ ] Database query logging
- [ ] Cloudflare Analytics Engine (custom metrics, user events, privacy-friendly)
- [ ] Alerting setup

### 8. Background Jobs
- [ ] Cloudflare Queues integration
- [ ] Cron triggers setup
- [ ] Email queue worker
- [ ] Cleanup jobs (old sessions, etc.)
- [ ] Job retry logic with exponential backoff
- [ ] Cloudflare Workflows (orchestration for multi-step processes)

---

## 📦 Medium Priority (Enhanced Features)

### 9. SEO & Marketing
- [ ] Meta tags component
- [ ] Open Graph images
- [ ] Sitemap generation
- [ ] robots.txt
- [ ] RSS feed (if blog/content)
- [ ] Analytics integration (Plausible/Fathom)

### 10. Waitlist System
- [ ] Waitlist signup API
- [ ] Waitlist database schema
- [ ] Email confirmation for waitlist
- [ ] Admin panel to manage waitlist
- [ ] Invite code generation

### 11. Multi-tenancy/Teams
- [ ] Organizations/teams schema
- [ ] Team member invitations
- [ ] Role-based access control (RBAC)
- [ ] Team settings & billing
- [ ] Switch between teams UI

### 12. Admin Panel
- [ ] User management interface
- [ ] View/edit user profiles
- [ ] Impersonation (for support)
- [ ] Feature flags per user
- [ ] Analytics dashboard

### 13. API Documentation
- [ ] OpenAPI/Swagger setup
- [ ] Auto-generate API docs from Zod schemas
- [ ] Interactive API explorer
- [ ] Rate limit documentation
- [ ] Authentication guide

---

## ☁️ Cloudflare AI & Advanced Features

### 19. Cloudflare Workers AI
- [ ] Workers AI setup with Alchemy
- [ ] Text generation (LLMs for content, support, etc.)
- [ ] Content moderation
- [ ] Sentiment analysis
- [ ] Text summarization
- [ ] Image classification
- [ ] Translation support

### 20. Cloudflare Vectorize
- [ ] Vectorize setup (vector database)
- [ ] Semantic search
- [ ] RAG (Retrieval-Augmented Generation)
- [ ] Content recommendations
- [ ] Similarity search
- [ ] AI-powered knowledge base

### 21. Other Cloudflare Platform Features
- [ ] Browser Rendering (screenshots, PDFs via Puppeteer)
- [ ] Cloudflare Stream (video hosting, if needed)
- [ ] Hyperdrive (Postgres pooling, if migrating from D1)

---

## 💡 Nice to Have (Future Enhancements)

### 22. Notifications System
- [ ] In-app notifications database schema
- [ ] Real-time notifications (WebSockets/SSE)
- [ ] Email notification preferences
- [ ] Notification center UI
- [ ] Mark as read functionality

### 23. Advanced Features
- [ ] Full-text search (D1 FTS or external)
- [ ] Multi-language support (i18n)
- [ ] Dark/light mode persistence
- [ ] User preferences system
- [ ] Activity log/audit trail

### 24. Real-time Features
- [ ] WebSocket support (Durable Objects)
- [ ] Presence system (online/offline)
- [ ] Live collaboration
- [ ] Real-time chat

### 25. Developer Experience
- [ ] Storybook for components
- [ ] Component documentation
- [ ] Migration guides
- [ ] Video tutorials
- [ ] Template showcase site

### 26. Projects Showcase
- [ ] Create showcase page/site for projects built with this template
- [ ] Submission form for community projects
- [ ] Project categories (SaaS, Content, E-commerce, etc.)
- [ ] Case studies from successful projects
- [ ] Featured projects section
- [ ] Community gallery with screenshots
- [ ] Link to live demos
- [ ] GitHub repo links for open source projects

---

## 📝 Documentation Needs

- [ ] Deployment guide (step-by-step)
- [ ] Environment setup tutorial
- [ ] Database migration workflow
- [ ] Adding new features guide
- [ ] Troubleshooting common issues
- [ ] Performance optimization guide
- [ ] Security best practices
- [ ] Contributing guidelines

---

## 🐛 Current Issues to Fix

- [ ] Web worker not deleted with `adopt: true` flag
- [ ] Clarify Alchemy adopt vs create behavior in docs
- [ ] Add error handling examples in API routes
- [ ] Better loading states in dashboard
- [ ] Mobile responsive improvements

---

## 🎨 UI/UX Polish

- [ ] Loading skeletons for all data fetching
- [ ] Error boundaries with friendly messages
- [ ] Empty states for lists
- [ ] Success/error toast notifications
- [ ] Form validation error messages
- [ ] Accessibility audit (WCAG compliance)
- [ ] Keyboard navigation improvements

---

## Priority for Different Use Cases

### Building a SaaS Product:
1. Email setup
2. Social auth
3. Payments
4. Testing
5. Monitoring

### Content Platform:
1. Storage (R2)
2. SEO
3. Email setup
4. Search
5. Social auth

### Pre-launch/Waitlist:
1. Waitlist system
2. Email setup
3. SEO
4. Social auth
5. Analytics

### MVP/Prototype:
1. Email setup
2. Social auth
3. Testing
4. Monitoring
5. Storage
