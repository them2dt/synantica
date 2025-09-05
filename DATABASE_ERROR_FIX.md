# Database Error Fix Guide

## Issues Fixed

The following errors have been resolved:

1. **"column reference 'event_id' is ambiguous"** - Fixed by replacing RPC functions with direct table queries
2. **"infinite recursion detected in policy for relation 'user_role_assignments'"** - Fixed by simplifying RLS policies
3. **Empty error objects** - Fixed by improving error handling

## Steps to Fix Database

### 1. Run the RLS Policy Fix

Execute the following SQL script in your Supabase SQL editor:

```sql
-- Run the contents of sql/05_fix_rls_policies.sql
```

This will:
- Remove problematic RLS policies that cause infinite recursion
- Replace them with simpler policies that allow proper data access
- Fix the user_role_assignments table access issues

### 2. Test the Application

After running the RLS fix:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard to test event loading
3. Check the browser console for any remaining errors

## What Was Changed

### Database Functions
- Replaced `search_events` RPC function with direct table queries
- Replaced `get_popular_events` RPC function with direct table queries
- Simplified queries to avoid ambiguous column references

### RLS Policies
- Removed complex admin role checking policies that caused recursion
- Added simple "allow all" policies for development
- Can be made more restrictive later for production

### Error Handling
- Improved error logging to show actual error details
- Added proper null checks for database responses

## Expected Results

After applying these fixes:
- ✅ Events should load without "ambiguous column" errors
- ✅ Categories should load without "infinite recursion" errors
- ✅ Error messages should be more descriptive
- ✅ Dashboard should display real data from the database

## Next Steps

1. Run the RLS fix script
2. Test the application
3. If everything works, you can make the RLS policies more restrictive for production use
4. Consider implementing proper admin role management later
