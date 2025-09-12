# Database Setup Guide

This guide will help you set up the database for the student event platform step by step.

## Prerequisites

- Supabase project created
- Access to Supabase SQL editor
- Your user account created in Supabase Auth

## Step-by-Step Setup

### 1. Run the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `lib/database/schema-simple.sql`
4. Run the SQL script

**Note**: If you get permission errors, run the commands one by one instead of all at once.

### 2. Create Your First Admin User

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to **Authentication** > **Users**
2. Find your user account and note the **User ID** (UUID)
3. Go to **Table Editor** > **users**
4. Click **Insert** > **Insert row**
5. Fill in the following:
   - `id`: Your user ID from step 2
   - `email`: Your email address
   - `full_name`: Your display name
   - `role`: `admin`
6. Click **Save**

#### Option B: Via SQL

1. First, find your user ID:
```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@domain.com';
```

2. Then insert your admin record:
```sql
INSERT INTO public.users (id, email, full_name, role) 
VALUES (
  'your-user-id-here',
  'admin@yourdomain.com',
  'Admin User',
  'admin'
);
```

### 3. Set Up Row Level Security Policies

After creating the tables, you need to set up the security policies. Run these commands one by one:

#### Users Table Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Events Table Policies

```sql
-- Anyone can view active events
CREATE POLICY "Anyone can view active events" ON public.events
  FOR SELECT USING (status = 'active');

-- Admins can view all events
CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can create events
CREATE POLICY "Admins can create events" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update events
CREATE POLICY "Admins can update events" ON public.events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete events
CREATE POLICY "Admins can delete events" ON public.events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Event Registrations Table Policies

```sql
-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations" ON public.event_registrations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own registrations
CREATE POLICY "Users can create their own registrations" ON public.event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations
CREATE POLICY "Users can update their own registrations" ON public.event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations" ON public.event_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 4. Verify Setup

1. Sign in to your application
2. You should see:
   - "Admin" badge in the navigation
   - "Create Event" button in the dashboard
   - "User Management" option in the user menu

### 5. Test Admin Functions

1. Go to **User Menu** > **User Management**
2. You should see your user listed with "Admin" role
3. Try creating a new event from the dashboard
4. Verify you can edit events

## Troubleshooting

### Permission Errors

If you get "must be owner of table" errors:

1. **Run commands individually** instead of all at once
2. **Check your Supabase project permissions**
3. **Ensure you're using the correct database user**

### User Not Showing as Admin

1. **Check the users table**: Verify your user exists with `role = 'admin'`
2. **Verify user ID**: Make sure the ID matches your auth user ID
3. **Refresh the page**: Try logging out and back in
4. **Check browser console**: Look for any error messages

### Database Connection Issues

1. **Check environment variables**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. **Verify Supabase project**: Make sure the project is active
3. **Check network**: Ensure you can access Supabase from your application

### RLS Policy Issues

1. **Check policy names**: Ensure policy names are unique
2. **Verify table names**: Make sure table names match exactly
3. **Test policies**: Try running the policies individually

## Next Steps

After successful setup:

1. **Create additional admin users** through the admin interface
2. **Add sample events** to test the platform
3. **Configure additional settings** as needed
4. **Set up monitoring** for production use

## Security Notes

- **Never share admin credentials** in production
- **Regularly review user roles** and permissions
- **Monitor admin actions** through Supabase logs
- **Keep database backups** for important data
- **Use strong passwords** for all admin accounts
