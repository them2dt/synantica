# Campus Events Platform - Supabase Authentication Setup

This guide will help you set up Supabase authentication for your student event platform.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `campus-events-platform`
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual values from Step 2.

## Step 4: Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

### Site URL
- Set **Site URL** to: `http://localhost:3000` (for development)
- For production, set it to your actual domain

### Email Templates (Optional)
- Customize the email templates under **Authentication** → **Email Templates**
- You can modify the confirmation email, password reset email, etc.

### Auth Providers
- **Email** is enabled by default
- You can enable additional providers like Google, GitHub, etc. under **Authentication** → **Providers**

## Step 5: Install Dependencies and Run

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 6: Test Authentication

1. You should see the login/signup form
2. Try creating a new account with your email
3. Check your email for the confirmation link
4. Click the confirmation link to verify your account
5. Sign in with your credentials

## Features Included

✅ **Email/Password Authentication**
- User registration with email confirmation
- Secure login/logout
- Password reset functionality

✅ **Protected Routes**
- All pages require authentication
- Automatic redirect to login if not authenticated

✅ **User Management**
- User profile display
- Account information
- User menu with sign out option

✅ **Modern UI**
- Responsive design with Geist Mono font
- Clean authentication forms
- Loading states and error handling

## Database Schema (Optional)

If you want to store additional user data, you can create custom tables in Supabase:

1. Go to **Table Editor** in your Supabase dashboard
2. Create tables for events, user profiles, etc.
3. Set up Row Level Security (RLS) policies

## Production Deployment

When deploying to production:

1. Update the **Site URL** in Supabase to your production domain
2. Set up proper environment variables in your hosting platform
3. Consider enabling additional security features in Supabase

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Check that your environment variables are correct
   - Ensure there are no extra spaces in your `.env.local` file

2. **Email confirmation not working**
   - Check your spam folder
   - Verify the Site URL is set correctly in Supabase
   - Check the email templates in Supabase dashboard

3. **Authentication not persisting**
   - Ensure middleware is properly configured
   - Check browser console for any errors

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- Check the browser console for detailed error messages

## Security Notes

- Never commit your `.env.local` file to version control
- The `anon` key is safe to use in client-side code
- For server-side operations, consider using the service role key (server-side only)
- Enable Row Level Security (RLS) on your database tables

---

Your campus events platform is now ready with secure authentication! 🎉
