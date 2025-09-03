# Project Structure

This document outlines the improved project structure for the Campus Events Platform.

## 📁 Directory Structure

```
student-event-platform/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with auth provider
│   ├── loading.tsx              # Loading component
│   └── page.tsx                 # Main events page
├── components/                   # React components
│   ├── features/                # Feature-specific components
│   │   └── auth/                # Authentication components
│   │       ├── auth-form.tsx    # Login/signup form
│   │       ├── auth-guard.tsx   # Route protection
│   │       ├── user-menu.tsx    # User dropdown menu
│   │       ├── user-profile.tsx # User profile display
│   │       └── index.ts         # Auth components exports
│   ├── layout/                  # Layout components
│   │   ├── theme-provider.tsx   # Theme context provider
│   │   └── index.ts             # Layout components exports
│   ├── ui/                      # Reusable UI components
│   │   ├── avatar.tsx           # Avatar component
│   │   ├── badge.tsx            # Badge component
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card components
│   │   ├── dialog.tsx           # Dialog components
│   │   ├── dropdown-menu.tsx    # Dropdown menu
│   │   ├── input.tsx            # Input component
│   │   └── select.tsx           # Select component
│   └── index.ts                 # All components exports
├── lib/                         # Utility libraries
│   ├── auth/                    # Authentication utilities
│   │   └── auth-context.tsx     # Auth context provider
│   ├── constants/               # Application constants
│   │   ├── events.ts            # Event data and categories
│   │   └── index.ts             # Constants exports
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts          # Authentication hooks
│   │   ├── use-events.ts        # Events management hooks
│   │   └── index.ts             # Hooks exports
│   ├── supabase/                # Supabase configuration
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server client
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts              # Authentication types
│   │   ├── events.ts            # Event-related types
│   │   └── index.ts             # Types exports
│   ├── utils.ts                 # Utility functions
│   └── index.ts                 # Library exports
├── public/                      # Static assets
├── middleware.ts                # Next.js middleware
├── .env.local                   # Environment variables
├── SETUP.md                     # Setup instructions
└── PROJECT_STRUCTURE.md         # This file
```

## 🏗️ Architecture Benefits

### **Separation of Concerns**
- **Components**: Organized by feature and purpose
- **Lib**: Separated by functionality (auth, types, hooks, constants)
- **Clear boundaries**: Each directory has a specific responsibility

### **Scalability**
- **Feature-based organization**: Easy to add new features
- **Modular structure**: Components can be easily moved or refactored
- **Type safety**: Centralized type definitions

### **Maintainability**
- **Index files**: Clean imports with barrel exports
- **Custom hooks**: Reusable logic separated from components
- **Constants**: Centralized data and configuration

### **Developer Experience**
- **IntelliSense**: Better autocomplete with organized imports
- **Easy navigation**: Clear file structure
- **Consistent patterns**: Similar organization across features

## 🔧 Key Improvements

### **1. Centralized Types**
```typescript
// Before: Types scattered across files
// After: All types in lib/types/
import type { Event, AuthContextType } from '@/lib/types'
```

### **2. Custom Hooks**
```typescript
// Before: Logic mixed in components
// After: Reusable hooks
import { useEvents, useAuth } from '@/lib/hooks'
```

### **3. Constants Management**
```typescript
// Before: Data hardcoded in components
// After: Centralized constants
import { MOCK_EVENTS, EVENT_CATEGORIES } from '@/lib/constants'
```

### **4. Component Organization**
```typescript
// Before: All components in one directory
// After: Organized by feature and purpose
import { AuthGuard, UserMenu } from '@/components/features/auth'
import { Button, Card } from '@/components/ui'
```

### **5. Clean Imports**
```typescript
// Barrel exports for clean imports
export * from './auth'
export * from './events'
export * from './ui'
```

## 🚀 Usage Examples

### **Adding a New Feature**
1. Create feature directory: `components/features/new-feature/`
2. Add components and index file
3. Export from `components/features/index.ts`
4. Import: `import { NewComponent } from '@/components/features'`

### **Adding New Types**
1. Create type file: `lib/types/new-feature.ts`
2. Export from `lib/types/index.ts`
3. Import: `import type { NewType } from '@/lib/types'`

### **Adding Custom Hooks**
1. Create hook file: `lib/hooks/use-new-feature.ts`
2. Export from `lib/hooks/index.ts`
3. Import: `import { useNewFeature } from '@/lib/hooks'`

## 📋 Best Practices

1. **Always use index files** for clean imports
2. **Keep components focused** on single responsibility
3. **Extract reusable logic** into custom hooks
4. **Define types** before implementing features
5. **Use consistent naming** conventions
6. **Group related functionality** together

This structure provides a solid foundation for scaling the application while maintaining code quality and developer productivity.
