-- =====================================================
-- Fix Sign-up Issues - Database Setup Script
-- =====================================================
-- Run this script in your Supabase SQL Editor to fix
-- the "Database error saving new user" issue during sign-up
-- =====================================================

-- 1. Fix RLS policies to allow sign-up process
-- =====================================================

-- Fix user_profiles RLS policy
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id OR
        auth.uid() IS NULL  -- Allow inserts during sign-up process
    );

-- Fix user_settings RLS policy
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IS NULL  -- Allow inserts during sign-up process
    );

-- Fix user_role_assignments RLS policy
DROP POLICY IF EXISTS "Allow user role assignments" ON user_role_assignments;
CREATE POLICY "Allow user role assignments" ON user_role_assignments
    FOR ALL USING (
        auth.uid() = user_id OR
        auth.uid() IS NULL OR
        auth.uid() = granted_by  -- Allow users to grant roles to themselves
    );

-- 2. Create trigger function for automatic user profile creation
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;

    -- Create default user settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Assign default student role
    INSERT INTO public.user_role_assignments (user_id, role, granted_by)
    VALUES (NEW.id, 'student', NEW.id)
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile after auth user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. Optional: Disable email confirmation in Supabase Auth settings
-- =====================================================
-- Go to Supabase Dashboard > Authentication > Settings
-- And disable "Enable email confirmations" if you want users to be able to sign in immediately

-- 4. Alternative approach: Manual profile creation
-- =====================================================
-- If the automatic trigger doesn't work, you can modify your sign-up form
-- to manually create the user profile after successful authentication

-- Example client-side code (add to sign-up form after successful signUp):
/*
const { data: user, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`,
    data: {
      email_confirm: false,  // Disable email confirmation
    },
  },
});

if (user && !error) {
  // Manually create user profile
  await supabase.from('user_profiles').insert({
    id: user.user?.id,
    email: formData.email,
  });

  await supabase.from('user_settings').insert({
    user_id: user.user?.id,
  });

  router.push('/dashboard');
}
*/

-- =====================================================
-- Testing the fix
-- =====================================================

-- After running this script, try signing up a new user.
-- The error "Database error saving new user" should be resolved.

-- If you still encounter issues, check:
-- 1. Supabase service role permissions
-- 2. Database connection settings
-- 3. Environment variables (NEXT_PUBLIC_SUPABASE_*)
-- 4. Supabase Auth configuration (email confirmations disabled)
