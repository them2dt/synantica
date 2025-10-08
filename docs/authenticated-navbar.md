# Authenticated Navigation Bar

## Overview
A floating navigation bar that appears at the top of authenticated pages, providing quick access to key features and settings.

## Features

### 1. **Logo & Navigation Links**
- **Logo** - Links back to home page
- **Home** - Navigate to landing page
- **Dashboard** - Navigate to main dashboard

### 2. **Theme Toggle**
- **Sun/Moon Icon** - Toggle between light and dark mode
- Smooth transition between themes
- Persists user preference

### 3. **User Menu Dropdown**
- **User Avatar** - Shows user initial or avatar
- **Username** - Displays first part of email
- **Dropdown Menu** includes:
  - Profile - Navigate to user profile
  - Settings - Navigate to settings page
  - Log out - Sign out and redirect to login

## Design

### Visual Style
- **Floating** - Fixed at top with spacing from edges
- **Backdrop blur** - Semi-transparent with blur effect
- **Rounded corners** - Modern 2xl border radius
- **Shadow** - Subtle shadow for depth
- **Responsive** - Adapts to mobile and desktop

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Logo    Home    Dashboard    [Theme] [User Menu]      │
└─────────────────────────────────────────────────────────┘
```

### Spacing
- Top margin: 1rem (from viewport top)
- Width: 95% of viewport (max 1280px)
- Padding: 1.5rem horizontal, 0.75rem vertical

## Implementation

### Component Location
`components/layout/authenticated-navbar.tsx`

### Integration
- Added to `app/(main)/layout.tsx`
- Only shows when user is authenticated
- Hidden on auth pages (`/auth/*`)

### Spacing Adjustments
Pages have been adjusted with top spacing (80px) to account for the floating navbar:
- Dashboard layout
- Profile page
- Authenticated home view

## Usage

The navbar automatically appears on all authenticated pages. No manual integration needed for new pages within the `(main)` layout group.

### Customization
To modify the navbar behavior, edit:
- `components/layout/authenticated-navbar.tsx` - Main component
- `app/(main)/layout.tsx` - Integration logic

## Accessibility
- Proper ARIA labels on interactive elements
- Keyboard navigation support via dropdown menus
- Focus management for dropdown interactions

