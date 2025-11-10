# Task Manager - Next.js Application

A full-featured task management application built with modern web technologies. Built with clean architecture principles, and testing

## 📋 Quick Start

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- Docker & Docker Compose (optional)

### Option 1: Local Development

```bash
# 1. Clone repository
git clone https://github.com/hamdankun/task-manager-nextjs.git
cd task-manager-nextjs

# 2. Install dependencies
yarn install

# 3. Setup database
# Copy .env.example to .env.local and configure DATABASE_URL
cp .env.example .env.local

# 4. Run migrations and make sure database already connected
yarn migrate:apply

# 5. Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Docker (Recommended)

```bash
# One command to start everything
docker-compose up -d

# App running at http://localhost:3000
# MySQL running at localhost:3306
```

See [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) for more details.

## 🏗️ Project Structure

```
task-manager-nextjs/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Authentication routes
│   │   ├── login/page.tsx        # Login page
│   │   ├── signup/page.tsx       # Signup page
│   │   └── layout.tsx            # Auth layout
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── page.tsx              # Dashboard home
│   │   ├── tasks/page.tsx        # Task management
│   │   ├── profile/page.tsx      # User profile
│   │   ├── settings/page.tsx     # Account settings
│   │   └── layout.tsx            # Dashboard layout
│   ├── api/                       # API routes (if needed)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── src/                           # Application source code
│   ├── domain/                    # Clean Architecture - Domain Layer
│   │   ├── entities/             # Business objects (immutable)
│   │   │   ├── User.ts           # User entity with methods
│   │   │   ├── Task.ts           # Task entity with status enum
│   │   │   ├── Project.ts        # Project entity
│   │   │   └── Notification.ts   # Notification entity
│   │   ├── usecases/             # Business logic (use cases)
│   │   │   ├── auth/
│   │   │   │   ├── SignupUseCase.ts
│   │   │   │   └── LoginUseCase.ts
│   │   │   ├── task/
│   │   │   │   ├── CreateTaskUseCase.ts
│   │   │   │   ├── UpdateTaskUseCase.ts
│   │   │   │   ├── DeleteTaskUseCase.ts
│   │   │   │   ├── GetTasksUseCase.ts
│   │   │   │   └── FilterTasksByStatusUseCase.ts
│   │   │   ├── project/
│   │   │   │   ├── CreateProjectUseCase.ts
│   │   │   │   ├── GetProjectsUseCase.ts
│   │   │   │   ├── UpdateProjectUseCase.ts
│   │   │   │   └── DeleteProjectUseCase.ts
│   │   │   └── notification/
│   │   │       ├── CreateNotificationUseCase.ts
│   │   │       ├── GetNotificationsUseCase.ts
│   │   │       └── MarkNotificationAsReadUseCase.ts
│   │   ├── repositories/         # Repository interfaces
│   │   │   ├── IUserRepository.ts
│   │   │   ├── ITaskRepository.ts
│   │   │   ├── IProjectRepository.ts
│   │   │   └── INotificationRepository.ts
│   │   ├── errors/               # Custom error types
│   │   │   ├── ValidationError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   └── AuthenticationError.ts
│   │   └── services/             # Domain services
│   │       └── PasswordService.ts
│   │
│   ├── data/                      # Clean Architecture - Data Layer
│   │   ├── repositories/         # Repository implementations
│   │   │   ├── UserRepository.ts
│   │   │   ├── TaskRepository.ts
│   │   │   ├── ProjectRepository.ts
│   │   │   └── NotificationRepository.ts
│   │   ├── mappers/              # Entity ↔ Persistence mapping
│   │   │   ├── UserMapper.ts
│   │   │   ├── TaskMapper.ts
│   │   │   ├── ProjectMapper.ts
│   │   │   └── NotificationMapper.ts
│   │   └── services/
│   │       └── BcryptPasswordService.ts
│   │
│   ├── presentation/              # Clean Architecture - Presentation Layer
│   │   ├── components/           # React components
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── SignupForm.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardNavbar.tsx
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   └── Statistics.tsx
│   │   │   └── common/
│   │   │       ├── PasswordInput.tsx
│   │   │       └── Button.tsx
│   │   └── actions/              # Server actions
│   │       ├── auth/
│   │       │   ├── signupAction.ts
│   │       │   ├── loginAction.ts
│   │       │   └── logoutAction.ts
│   │       ├── task/
│   │       │   ├── createTaskAction.ts
│   │       │   ├── updateTaskAction.ts
│   │       │   ├── deleteTaskAction.ts
│   │       │   └── getTasksAction.ts
│   │       ├── project/
│   │       │   ├── createProjectAction.ts
│   │       │   ├── getProjectsAction.ts
│   │       │   ├── updateProjectAction.ts
│   │       │   └── deleteProjectAction.ts
│   │       └── notification/
│   │           ├── getNotificationsAction.ts
│   │           ├── markNotificationAsReadAction.ts
│   │           └── deleteNotificationAction.ts
│   │
│   ├── config/                    # Configuration
│   │   ├── auth.ts               # Auth config
│   │   ├── database.ts           # Database config
│   │   └── constants.ts          # App constants
│   │
│   └── lib/                       # Utilities
│       ├── validation.ts         # Input validation
│       ├── errors.ts             # Error handling
│       └── utils.ts              # Helper functions
│
├── tests/                         # Unit tests (Jest)
│   └── domain/
│       └── usecases/
│           ├── auth/
│           │   ├── SignupUseCase.test.ts (15 tests)
│           │   └── LoginUseCase.test.ts (17 tests)
│           └── task/
│               ├── UpdateTaskUseCase.test.ts (25 tests)
│               ├── DeleteTaskUseCase.test.ts (15 tests)
│               ├── GetTasksUseCase.test.ts (20 tests)
│               └── FilterTasksByStatusUseCase.test.ts (23 tests)
│
├── prisma/                        # Database schema
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Database migrations
│
├── public/                        # Static assets
│   └── icons/                     # App icons
│
├── docs/                          # Documentation
│   └── PRD.md                     # Product Requirements
│
├── Dockerfile                     # Docker build configuration
├── docker-compose.yml            # Docker Compose setup
├── .dockerignore                 # Docker ignore patterns
├── .env.example                  # Environment variables template
├── .eslintrc.json               # ESLint configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.test.json           # TypeScript test configuration
├── jest.config.js               # Jest configuration
├── package.json                 # Dependencies and scripts
│
└── README.md                    # This file
```

## 🔧 Technical Stack

### Frontend
- **Next.js 16.0.1**: React framework with App Router
- **React 19.2.0**: UI library with Server Components
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS with dark mode
- **React Hook Form**: Performant forms with validation
- **lucide-react**: Modern icon library

### Backend & Database
- **Prisma 6.19.0**: Type-safe ORM with migrations
- **MySQL 8.0**: Relational database
- **Node.js 20**: JavaScript runtime

### Testing
- **Jest 29.7.0**: Unit testing framework
- **@testing-library/jest-dom**: DOM matchers
- **TypeScript**: Type-safe test writing

### Architecture & Design Patterns
- **Clean Architecture**: Separation of concerns (Domain, Data, Presentation)
- **Domain-Driven Design**: Business logic isolated in domain layer
- **Repository Pattern**: Database abstraction
- **Use Cases Pattern**: Business logic encapsulation
- **Dependency Injection**: Loosely coupled components

### DevOps & Deployment
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Multi-stage builds**: Optimized production images

## 💡 Technical Choices & Rationale

### Why Next.js?
- Built-in React Server Components for zero-JS pages
- API routes and server actions for backend logic
- Automatic code splitting and optimization
- Excellent developer experience with hot reload
- Production-ready with built-in analytics

### Why Clean Architecture?
- **Testability**: Domain logic independent of frameworks
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features
- **Flexibility**: Swap implementations (e.g., database)
- **Business Logic Protection**: Core logic never touches framework code

### Why Prisma?
- Type-safe database client generated from schema
- Automatic migrations with conflict detection
- Excellent developer experience with Prisma Studio
- Native TypeScript support
- Schema validation at compile time

### Why MySQL?
- Mature, widely-used relational database
- ACID transactions for data integrity
- Strong ecosystem and support
- Cost-effective self-hosting options
- Docker-friendly

### Why Docker?
- Consistent development/production environments
- Easy deployment and scaling
- Dependency isolation
- Cloud-native applications support

### Why TypeScript?
- Compile-time type checking catches bugs early
- Better IDE support and autocompletion
- Self-documenting code with types
- Refactoring confidence
- Enterprise-grade tooling

## 🔐 Security Features

- **HTTP-only Cookies**: Secure authentication tokens
- **Password Hashing**: bcrypt with 10 rounds
- **CSRF Protection**: Via cookies (secure tokens)
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Protection**: React's built-in escaping
- **User Ownership Verification**: Only users can access their data
- **Non-root Docker User**: Container security
- **Input Validation**: Server-side validation on all inputs

## 🧪 Testing

### Test Coverage: 115+ Tests
- **Auth Tests**: 32 tests (SignupUseCase: 15, LoginUseCase: 17)
- **Task Tests**: 83 tests (4 use cases with comprehensive scenarios)
- **Coverage Areas**: Validation, error handling, edge cases, security

### Run Tests
```bash
# All tests
yarn test

# Watch mode
yarn test -- --watch

# Coverage report
yarn test:coverage

# Specific test file
yarn test UpdateTaskUseCase.test.ts
```

## 📦 Available Scripts

```bash
# Development
yarn dev              # Start development server (localhost:3000)
yarn build           # Build for production
yarn start               # Start production server

# Database
yarn migrate:apply # Create and apply migrations

# Testing
yarn test               # Run all tests
yarn test -- --watch  # Watch mode
yarn test:coverage # Generate coverage report

# Linting
yarn lint          # Run ESLint
yarn lint -- --fix # Fix linting errors
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables

Create `.env.local` with:
```
DATABASE_URL=mysql://user:password@host:port/database
NEXT_PUBLIC_APP_URL=https://your-app-url.com
```

## 📚 Documentation
- **[docs/PRD.md](docs/PRD.md)** - Product requirements

## 🎯 Features

### Current Features
✅ User authentication (signup/login)
✅ Task management (CRUD operations)
✅ Task filtering by status
✅ User profile management
✅ Password change with auto-redirect
✅ Dark mode UI
✅ Responsive design
✅ Project domain layer (ready for UI)
✅ Notification domain layer (ready for UI)
✅ Comprehensive test suite

### Upcoming Features
🔄 Project UI components
🔄 Notification system UI
🔄 Task-project association
🔄 Advanced filtering and search
🔄 Activity logging
🔄 User roles and permissions

## 📊 Database Schema

### Users Table
- `id`: String (primary key)
- `email`: String (unique)
- `password`: String (hashed)
- `firstName`: String
- `lastName`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Tasks Table
- `id`: String (primary key)
- `title`: String
- `description`: String (optional)
- `status`: Enum (TODO, IN_PROGRESS, DONE)
- `userId`: String (foreign key)
- `projectId`: String (foreign key, optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
