/**
 * Components Barrel Export
 *
 * Architecture: Presentation Layer
 * Provides unified access to all UI components across the application
 *
 * Structure:
 * - auth/*      → Authentication components (LoginForm, SignupForm, AuthLayout)
 * - shared/*    → Reusable shared components (Button, Card, Modal, etc.)
 * - task/*      → Task management components (TaskList, TaskCard, etc.)
 */

// Auth Components
export { LoginForm, SignupForm, AuthLayout } from './auth'

// Shared Components
export {} from './shared'

// Task Components
export {} from './task'
