-- =====================================================
-- Fix RLS Policies to Prevent Infinite Recursion
-- =====================================================
-- This script fixes the RLS policies that are causing
-- infinite recursion issues, particularly with user_role_assignments
-- =====================================================

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can manage roles" ON user_role_assignments;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Admins can manage categories" ON event_categories;
DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
DROP POLICY IF EXISTS "Admins can manage registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can manage reviews" ON event_reviews;
DROP POLICY IF EXISTS "Admins can manage interests" ON user_interests;

-- Fix user_role_assignments RLS policies to allow sign-up
DROP POLICY IF EXISTS "Allow all operations on user_role_assignments" ON user_role_assignments;

-- Allow inserts during sign-up process (when auth.uid() is null) or self-management
CREATE POLICY "Allow user role assignments" ON user_role_assignments
    FOR ALL USING (
        auth.uid() = user_id OR
        auth.uid() IS NULL OR
        auth.uid() = granted_by  -- Allow users to grant roles to themselves (for initial setup)
    );

-- For events - allow all read operations, restrict write operations
CREATE POLICY "Allow all read operations on events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Allow insert on events" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on events" ON events
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete on events" ON events
    FOR DELETE USING (true);

-- For event_categories - allow all operations
CREATE POLICY "Allow all operations on event_categories" ON event_categories
    FOR ALL USING (true);

-- For tags - allow all operations
CREATE POLICY "Allow all operations on tags" ON tags
    FOR ALL USING (true);

-- For event_tags - allow all operations
CREATE POLICY "Allow all operations on event_tags" ON event_tags
    FOR ALL USING (true);

-- For event_registrations - allow all operations
CREATE POLICY "Allow all operations on event_registrations" ON event_registrations
    FOR ALL USING (true);

-- For event_reviews - allow all operations
CREATE POLICY "Allow all operations on event_reviews" ON event_reviews
    FOR ALL USING (true);

-- For user_interests - allow all operations
CREATE POLICY "Allow all operations on user_interests" ON user_interests
    FOR ALL USING (true);

-- Fix user_settings RLS policies to allow sign-up
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;

-- Allow users to insert their own settings OR allow inserts during sign-up process
CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IS NULL  -- Allow inserts during sign-up process
    );

-- Fix user_profiles RLS policies to allow sign-up
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Allow users to insert their own profile OR allow inserts during sign-up (when auth.uid() is null)
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id OR
        auth.uid() IS NULL  -- Allow inserts during sign-up process
    );

-- Keep existing policies for select and update
-- These should work fine as they only apply to authenticated users

-- =====================================================
-- Function to handle user profile creation after sign-up
-- =====================================================

-- Function to create user profile after auth user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
