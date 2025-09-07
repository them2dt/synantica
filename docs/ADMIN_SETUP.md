# Admin Setup Guide

This guide explains how to set up admin users in your Supabase database.

## Database Setup

### 1. Run the Database Schema

First, run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of lib/database/schema.sql
-- This will create all necessary tables and policies
```

### 2. Create Your First Admin User

After running the schema, you need to manually create your first admin user:

#### Option A: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Create a new user or use an existing one
4. Note the user's ID (UUID)

5. Go to **Table Editor** > **users**
6. Insert a new row with:
   - `id`: The user's UUID from step 4
   - `email`: The user's email
   - `full_name`: User's display name
   - `role`: `admin`

#### Option B: Via SQL

```sql
-- Replace with your actual user ID and email
INSERT INTO public.users (id, email, full_name, role) 
VALUES (
  'your-user-id-here',
  'admin@yourdomain.com',
  'Admin User',
  'admin'
);
```

### 3. Verify Admin Access

1. Sign in with your admin account
2. You should see:
   - "Admin" badge in the navigation
   - "Create Event" button in the dashboard
   - "User Management" option in the user menu
   - "Edit Event" buttons on event pages

## Managing Admin Users

### Promoting Users to Admin

1. Sign in as an existing admin
2. Go to **User Menu** > **User Management**
3. Find the user you want to promote
4. Change their role from "Student" to "Admin"
5. Click to save the changes

### Demoting Admins

1. Follow the same steps as promoting
2. Change their role from "Admin" to "Student"

## Database Tables

The system creates these main tables:

- **users**: User profiles and roles
- **events**: Event information
- **event_registrations**: User registrations for events

## Row Level Security (RLS)

The system uses RLS policies to ensure:

- Users can only see their own data
- Admins can see and manage all data
- Students can only view events and register
- All operations are properly secured

## Troubleshooting

### User Not Showing as Admin

1. Check if the user exists in the `users` table
2. Verify the `role` field is set to `admin`
3. Check if the user ID matches the auth user ID
4. Try refreshing the page or logging out/in

### Permission Denied Errors

1. Ensure RLS policies are properly set up
2. Check if the user has the correct role
3. Verify the user is authenticated

### Database Connection Issues

1. Check your Supabase project settings
2. Verify environment variables are set correctly
3. Ensure the database schema was run successfully

## Security Notes

- Only promote trusted users to admin
- Regularly review admin user list
- Consider implementing additional security measures for production
- Monitor admin actions through Supabase logs

## Next Steps

After setting up admins, you can:

1. Create events through the dashboard
2. Manage user roles and permissions
3. View platform analytics (when implemented)
4. Configure additional admin features
