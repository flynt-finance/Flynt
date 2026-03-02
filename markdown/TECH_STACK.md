# Flynt Finance - Technology Stack

## Frontend Stack

### Web Application

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Next.js** | 14.x | React framework | SSR, SEO, App Router, excellent DX |
| **React** | 18.x | UI library | Industry standard, large ecosystem |
| **TypeScript** | 5.x | Type safety | Catch errors early, better IDE support |
| **TailwindCSS** | 3.x | Styling | Utility-first, fast development, small bundle |
| **shadcn/ui** | Latest | UI components | Accessible, customizable, Radix primitives |
| **Zustand** | 4.x | State management | Lightweight, simple API, no boilerplate |
| **TanStack Query** | 5.x | Data fetching | Caching, optimistic updates, auto-refetch |
| **React Hook Form** | 7.x | Form handling | Performance, validation, minimal re-renders |
| **Zod** | 3.x | Schema validation | Type-safe, composable, great DX |
| **Recharts** | 2.x | Data visualization | React-native, responsive, customizable |
| **Lucide React** | Latest | Icons | Consistent, tree-shakeable, 1000+ icons |
| **date-fns** | 3.x | Date utilities | Lightweight, immutable, tree-shakeable |
| **clsx** | 2.x | Class names | Conditional classes, tiny bundle |

### Mobile Application

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **React Native** | 0.73.x | Mobile framework | Cross-platform, shared logic with web |
| **Expo** | 50.x | Development platform | Fast iteration, OTA updates, managed workflow |
| **TypeScript** | 5.x | Type safety | Shared types with backend |
| **React Navigation** | 6.x | Navigation | Native feel, customizable, well-maintained |
| **React Native Paper** | 5.x | UI components | Material Design, accessible, themeable |
| **Zustand** | 4.x | State management | Same as web for consistency |
| **TanStack Query** | 5.x | Data fetching | Same as web |
| **React Hook Form** | 7.x | Forms | Same as web |
| **Zod** | 3.x | Validation | Shared schemas with web/backend |
| **expo-local-authentication** | Latest | Biometrics | Face ID, Touch ID, fingerprint |
| **expo-secure-store** | Latest | Secure storage | Encrypted storage for tokens |
| **react-native-svg** | Latest | SVG support | Charts, icons, illustrations |

---

## Backend Stack

### API Services (Node.js)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Node.js** | 20 LTS | Runtime | Stable, mature, excellent for I/O |
| **Express.js** | 4.x | Web framework | Lightweight, flexible, huge ecosystem |
| **TypeScript** | 5.x | Type safety | Shared types across stack |
| **Zod** | 3.x | Validation | Runtime validation, type inference |
| **Prisma** | 5.x | ORM | Type-safe queries, migrations, great DX |
| **ioredis** | 5.x | Redis client | Cluster support, promises, TypeScript |
| **jsonwebtoken** | 9.x | JWT handling | Authentication tokens |
| **bcrypt** | 5.x | Password hashing | Industry standard, secure |
| **helmet** | 7.x | Security headers | XSS, CSP, HSTS protection |
| **cors** | 2.x | CORS handling | Cross-origin requests |
| **express-rate-limit** | 7.x | Rate limiting | DDoS protection, abuse prevention |
| **winston** | 3.x | Logging | Structured logs, multiple transports |
| **joi** | 17.x | Validation (alternative) | Complex validation rules |
| **axios** | 1.x | HTTP client | External API calls, interceptors |
| **bull** | 4.x | Job queue | Background jobs, Redis-backed |

### AI/ML Service (Python)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Python** | 3.11 | Runtime | ML ecosystem, fast development |
| **FastAPI** | 0.109.x | Web framework | Fast, async, auto-docs, type hints |
| **Pydantic** | 2.x | Data validation | Type safety, JSON schema generation |
| **scikit-learn** | 1.4.x | ML library | Classification, regression, clustering |
| **pandas** | 2.2.x | Data manipulation | DataFrames, time-series, CSV/JSON |
| **numpy** | 1.26.x | Numerical computing | Array operations, linear algebra |
| **TensorFlow Lite** | 2.15.x | Model serving | Lightweight, fast inference |
| **joblib** | 1.3.x | Model serialization | Save/load models efficiently |
| **uvicorn** | 0.27.x | ASGI server | Production-ready, fast |
| **redis-py** | 5.x | Redis client | Caching, pub/sub |
| **psycopg2** | 2.9.x | PostgreSQL client | Database access |
| **python-dotenv** | 1.x | Environment variables | Configuration management |

---

## Database Stack

### Primary Database

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **PostgreSQL** | 15.x | Relational database | ACID, complex queries, JSON support |
| **TimescaleDB** | 2.13.x | Time-series extension | Optimized for transaction analytics |
| **pgvector** | 0.5.x | Vector similarity | ML embeddings, semantic search |

### Cache & Queue

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Redis** | 7.x | In-memory cache | Sub-ms latency, pub/sub, streams |
| **Redis Cluster** | 7.x | Distributed cache | High availability, horizontal scaling |

### Document Store

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **MongoDB** | 7.x | Document database | Flexible schema, JSON-native |

### Object Storage

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **AWS S3** | - | Object storage | Scalable, durable, cheap |
| **Cloudflare R2** | - | S3-compatible storage | No egress fees, fast CDN |

---

## Infrastructure Stack

### Cloud Provider

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **AWS** | Primary cloud | Comprehensive services, fintech-ready |
| **Cloudflare** | CDN, DDoS protection | Fast, global, affordable |

### Compute

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **ECS Fargate** | Container orchestration | Serverless containers, auto-scaling |
| **AWS Lambda** | Serverless functions | Event-driven, pay-per-use |
| **EC2** | Virtual machines | ML training, batch jobs |

### Networking

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **ALB** | Load balancing | Layer 7, path-based routing |
| **CloudFront** | CDN | Global edge locations, low latency |
| **Route 53** | DNS | Reliable, health checks, geo-routing |
| **VPC** | Network isolation | Security, private subnets |

### Security

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **AWS WAF** | Web firewall | SQL injection, XSS protection |
| **AWS Secrets Manager** | Secret storage | Automatic rotation, encryption |
| **AWS KMS** | Key management | Encryption keys, FIPS 140-2 |
| **AWS Shield** | DDoS protection | Always-on, automatic mitigation |
| **AWS Certificate Manager** | SSL/TLS certificates | Free, auto-renewal |

### Monitoring & Observability

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **DataDog** | APM, logs, metrics | Unified observability, great UX |
| **Sentry** | Error tracking | Real-time alerts, stack traces |
| **PagerDuty** | Incident management | On-call rotation, escalation |
| **CloudWatch** | AWS metrics | Native integration, alarms |

### CI/CD

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **GitHub Actions** | CI/CD pipeline | Native to GitHub, free for private repos |
| **Docker** | Containerization | Consistent environments, portability |
| **Terraform** | Infrastructure as Code | Declarative, version-controlled infra |
| **AWS CodeDeploy** | Deployment | Blue-green, canary deployments |

---

## Third-Party Services

### Financial Infrastructure

| Service | Purpose | Pricing Model | Rationale |
|---------|---------|---------------|-----------|
| **Okra** | Bank connectivity | Per user/month | Best Nigerian bank coverage |
| **Mono** | Bank connectivity (backup) | Per user/month | Redundancy, failover |
| **Paystack Issuing** | Virtual cards | Per card + interchange | Mature API, reliable |
| **Flutterwave Barter** | Virtual cards (backup) | Per card + interchange | Competitive pricing |
| **Flutterwave** | Payments | Transaction fee | Card funding, withdrawals |

### Communications

| Service | Purpose | Pricing Model | Rationale |
|---------|---------|---------------|-----------|
| **Termii** | SMS (OTP) | Per SMS | Nigerian-focused, reliable |
| **SendGrid** | Transactional email | Per email | Deliverability, templates |
| **Firebase Cloud Messaging** | Push notifications | Free | Cross-platform, reliable |
| **Twilio** | SMS (backup) | Per SMS | Global coverage, fallback |

### Identity & Compliance

| Service | Purpose | Pricing Model | Rationale |
|---------|---------|---------------|-----------|
| **Smile Identity** | KYC verification | Per verification | Nigerian BVN, ID cards |
| **Youverify** | BVN verification | Per check | Backup provider |
| **Onfido** | Document verification | Per check | Global standard, ML-powered |

### Analytics & Marketing

| Service | Purpose | Pricing Model | Rationale |
|---------|---------|---------------|-----------|
| **Mixpanel** | Product analytics | Per event | User behavior, funnels, retention |
| **Segment** | Customer data platform | Per MTU | Unified data pipeline |
| **Google Analytics 4** | Web analytics | Free | Traffic, conversions |
| **Amplitude** | Product analytics (alternative) | Per MTU | Advanced cohort analysis |

### Developer Tools

| Service | Purpose | Pricing Model | Rationale |
|---------|---------|---------------|-----------|
| **Postman** | API testing | Free/Team | Collaboration, documentation |
| **Figma** | Design | Per editor | Design system, prototyping |
| **Linear** | Project management | Per user | Fast, keyboard-first, integrations |
| **Notion** | Documentation | Per user | Wiki, knowledge base |
| **Slack** | Team communication | Per user | Integrations, searchable history |

---

## Development Tools

### Code Quality

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **ESLint** | JavaScript linting | Airbnb style guide + custom rules |
| **Prettier** | Code formatting | 2 spaces, single quotes, trailing commas |
| **Husky** | Git hooks | Pre-commit linting, pre-push tests |
| **lint-staged** | Staged file linting | Only lint changed files |
| **TypeScript** | Type checking | Strict mode enabled |

### Testing

| Tool | Purpose | Use Case |
|------|---------|----------|
| **Jest** | Unit testing | Business logic, utilities |
| **Supertest** | API testing | HTTP endpoint testing |
| **React Testing Library** | Component testing | UI components |
| **Playwright** | E2E testing | User flows, critical paths |
| **k6** | Load testing | Performance, scalability |
| **Postman** | Manual API testing | Development, debugging |

### Documentation

| Tool | Purpose | Output |
|------|---------|--------|
| **Swagger UI** | API docs | Interactive REST API docs |
| **TypeDoc** | TypeScript docs | Generated from code comments |
| **Storybook** | Component docs | UI component library |
| **Docusaurus** | Static site | Developer documentation |

---

## Package Managers

| Tool | Use Case | Rationale |
|------|----------|-----------|
| **npm** | Node.js packages | Default, widely supported |
| **pnpm** | Monorepo (alternative) | Faster, disk-efficient |
| **pip** | Python packages | Standard for Python |
| **poetry** | Python (alternative) | Better dependency resolution |

---

## Version Control

| Tool | Purpose | Workflow |
|------|---------|----------|
| **Git** | Version control | Feature branches, PRs |
| **GitHub** | Code hosting | Private repos, Actions, Issues |
| **Conventional Commits** | Commit format | Semantic versioning, changelogs |

---

## Design Tools

| Tool | Purpose | Deliverables |
|------|---------|--------------|
| **Figma** | UI/UX design | Mockups, prototypes, design system |
| **FigJam** | Whiteboarding | User flows, brainstorming |
| **Excalidraw** | Diagrams | Architecture diagrams |
| **Miro** | Collaboration | Workshops, retrospectives |

---

## Browser & Device Support

### Web Browsers

| Browser | Minimum Version | Market Share |
|---------|----------------|--------------|
| Chrome | 90+ | 65% |
| Safari | 14+ | 20% |
| Firefox | 88+ | 5% |
| Edge | 90+ | 5% |

### Mobile Devices

| Platform | Minimum Version | Market Share |
|----------|----------------|--------------|
| iOS | 14+ | 40% |
| Android | 10+ | 60% |

---

## Performance Budgets

### Web Application

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Total Bundle Size | < 200KB (gzipped) | webpack-bundle-analyzer |

### Mobile Application

| Metric | Target | Tool |
|--------|--------|------|
| App Size | < 50MB | Expo build |
| Startup Time | < 2s | React Native Profiler |
| JS Bundle Size | < 5MB | Metro bundler |
| Memory Usage | < 150MB | Xcode Instruments |

### API Services

| Metric | Target | Tool |
|--------|--------|------|
| Response Time (p95) | < 200ms | DataDog |
| Response Time (p99) | < 500ms | DataDog |
| Throughput | 10k req/sec | k6 |
| Error Rate | < 0.1% | Sentry |

---

## Security Tools

| Tool | Purpose | Integration |
|------|---------|-------------|
| **Snyk** | Dependency scanning | GitHub Actions |
| **Dependabot** | Automated updates | GitHub |
| **OWASP ZAP** | Security testing | CI/CD pipeline |
| **SonarQube** | Code quality | Pre-merge checks |
| **Trivy** | Container scanning | Docker builds |

---

## Cost Optimization

### Estimated Monthly Costs (10k MAU)

| Category | Service | Cost |
|----------|---------|------|
| **Compute** | ECS Fargate | $800 |
| **Database** | RDS PostgreSQL | $500 |
| **Cache** | ElastiCache Redis | $200 |
| **Storage** | S3 | $50 |
| **CDN** | CloudFront | $100 |
| **Monitoring** | DataDog | $300 |
| **Bank API** | Okra | $1,000 |
| **Card Issuing** | Paystack | $20,000 |
| **SMS** | Termii | $600 |
| **Total** | | **~$23,550** |

### Cost Optimization Strategies

1. **Reserved Instances:** 40% savings on EC2/RDS
2. **Spot Instances:** 70% savings for batch jobs
3. **S3 Lifecycle Policies:** Move old data to Glacier
4. **CloudFront Caching:** Reduce origin requests
5. **Lambda for Spiky Workloads:** Pay-per-use
6. **Database Connection Pooling:** Reduce RDS costs
7. **Redis Clustering:** Right-size instances

---

## Alternatives Considered

### Why Not X?

**Vue.js / Angular instead of React?**
- React has larger ecosystem, better mobile story (React Native)
- More developers familiar with React

**GraphQL instead of REST?**
- REST is simpler for MVP
- GraphQL adds complexity (caching, N+1 queries)
- Can migrate later if needed

**Kubernetes instead of ECS?**
- K8s is overkill for MVP
- ECS is simpler, AWS-native
- Can migrate to K8s at scale

**MySQL instead of PostgreSQL?**
- PostgreSQL has better JSON support
- More advanced features (CTEs, window functions)
- Better for analytics

**DynamoDB instead of PostgreSQL?**
- Financial data needs ACID guarantees
- Complex queries difficult in DynamoDB
- PostgreSQL more familiar to developers

**Microservices from Day 1?**
- Monolith is faster to build
- Can split services later (auth, cards already separate)
- Avoid premature optimization

---

## Technology Radar

### Adopt (Use Now)

- Next.js 14 App Router
- TypeScript strict mode
- TailwindCSS
- Prisma ORM
- FastAPI
- ECS Fargate

### Trial (Experiment)

- Bun (faster Node.js runtime)
- Turbopack (faster bundler)
- Drizzle ORM (lighter than Prisma)
- Hono (faster Express alternative)

### Assess (Watch)

- React Server Components (production-ready?)
- Deno (Node.js alternative)
- HTMX (less JavaScript)
- EdgeDB (PostgreSQL alternative)

### Hold (Avoid)

- Create React App (deprecated)
- Redux (too much boilerplate)
- Webpack (slower than alternatives)
- MongoDB for financial data (no ACID)

---

**Last Updated:** January 31, 2026  
**Maintained By:** Engineering Team
