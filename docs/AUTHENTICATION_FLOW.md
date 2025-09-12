# Authentication Flow Documentation

## Overview
The application uses Supabase Auth with Next.js middleware for session management. All authentication flows are protected by client-side validation and server-side verification.

## New User Registration Flow

### 1. **Sign-up Page Access**
- User navigates to `/auth/sign-up`
- Split-screen layout displays sign-up form
- Form includes: email, password, confirm password fields

### 2. **Form Validation**
- **Client-side**: Zod schema validation with real-time feedback
- **Email**: Valid format, sanitized, converted to lowercase
- **Password**: Min 8 chars, uppercase, lowercase, number required
- **Confirm Password**: Must match password
- **Input Sanitization**: XSS protection via `sanitizeString()`

### 3. **Account Creation**
```typescript
supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`
  }
})
```

### 4. **Email Confirmation**
- Supabase sends confirmation email
- User clicks link → `/auth/confirm` route
- OTP verification via `supabase.auth.verifyOtp()`
- Success → redirects to `/dashboard`
- Failure → redirects to `/auth/error`

### 5. **Post-Registration**
- User redirected to `/auth/sign-up-success`
- Confirmation email sent automatically
- Account remains inactive until email verified

## Returning User Sign-in Flow

### 1. **Login Page Access**
- User navigates to `/auth/login`
- Split-screen layout with login form
- Form includes: email, password, "Remember me" checkbox

### 2. **Form Validation**
- **Client-side**: Zod schema validation
- **Email**: Valid format, sanitized
- **Password**: Min 8 chars, max 128 chars
- **Real-time validation**: Form enables submit only when valid

### 3. **Authentication**
```typescript
supabase.auth.signInWithPassword({
  email: data.email,
  password: data.password
})
```

### 4. **Error Handling**
- **Invalid credentials**: Field-level error on both email/password
- **Email not confirmed**: Specific error message
- **Generic errors**: Displayed as toast notification

### 5. **Success Redirect**
- Valid credentials → redirect to `/dashboard`
- Session established via Supabase cookies

## Signed-in User Access Flow

### 1. **Root Path Access** (`/`)
```typescript
// app/page.tsx
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  redirect("/dashboard");
}
redirect("/auth/login");
```

### 2. **Protected Route Access**
- User navigates to any protected route (`/dashboard`, `/subscriptions`, `/settings`)
- **Middleware check**: `middleware.ts` → `updateSession()`
- **Session validation**: `supabase.auth.getClaims()`
- **Valid session**: Access granted
- **Invalid/expired session**: Redirect to `/auth/login`

### 3. **App Layout Protection**
```typescript
// app/(app)/layout.tsx
const { data, error } = await supabase.auth.getClaims();
if (error || !data?.claims) {
  redirect("/auth/login");
}
```

### 4. **Session Persistence**
- **Cookies**: Supabase manages auth cookies automatically
- **Middleware**: Refreshes session on each request
- **Client-side**: Session state maintained across page refreshes

## Password Reset Flow

### 1. **Forgot Password Access**
- User clicks "Forgot password?" on login page
- Navigates to `/auth/forgot-password`
- Single email input field

### 2. **Reset Request**
```typescript
supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/update-password`
})
```

### 3. **Email Processing**
- Reset email sent to user
- Contains secure token and redirect URL
- Token expires after 1 hour (Supabase default)

### 4. **Password Update**
- User clicks email link → `/auth/update-password`
- New password form with validation
- Password updated via Supabase
- User redirected to dashboard

## Security Features

### 1. **Input Validation**
- **Client-side**: Zod schemas with real-time validation
- **Server-side**: Supabase handles validation
- **Sanitization**: XSS protection on all text inputs

### 2. **Session Management**
- **Secure cookies**: HttpOnly, Secure, SameSite
- **Token refresh**: Automatic via middleware
- **Session timeout**: Handled by Supabase (configurable)

### 3. **Error Handling**
- **Field-level errors**: Specific validation messages
- **Global errors**: Toast notifications
- **Network errors**: Retry logic with exponential backoff

### 4. **Access Control**
- **Middleware protection**: All routes except auth pages
- **Server-side verification**: Double-check on protected layouts
- **Automatic redirects**: Seamless user experience

## Technical Implementation

### 1. **Supabase Configuration**
- **Client**: Browser-side auth operations
- **Server**: Server-side session verification
- **Middleware**: Request-level session management

### 2. **Next.js Integration**
- **App Router**: Server components for auth checks
- **Middleware**: Route protection and session refresh
- **Redirects**: Programmatic navigation based on auth state

### 3. **Form Management**
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation and type safety
- **Real-time feedback**: Immediate validation on input

## Error Scenarios

### 1. **Registration Errors**
- Email already exists
- Weak password
- Network failure
- Email delivery failure

### 2. **Login Errors**
- Invalid credentials
- Unconfirmed email
- Account locked (after failed attempts)
- Network timeout

### 3. **Session Errors**
- Expired session
- Invalid token
- Cookie corruption
- Network connectivity

## User Experience

### 1. **Visual Feedback**
- Loading states during auth operations
- Clear error messages
- Success confirmations
- Form validation indicators

### 2. **Navigation Flow**
- Seamless redirects based on auth state
- Preserved intended destination
- No broken back button behavior
- Consistent UI across auth pages

### 3. **Accessibility**
- ARIA labels on form fields
- Keyboard navigation support
- Screen reader compatibility
- High contrast error states
