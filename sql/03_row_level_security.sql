-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
-- This script sets up Row Level Security policies for
-- the student event platform to ensure proper data
-- access control and privacy.
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER PROFILES POLICIES
-- =====================================================

-- Users can view all public profiles
CREATE POLICY "Users can view all profiles" ON user_profiles
    FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- USER SETTINGS POLICIES
-- =====================================================

-- Users can only view their own settings
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own settings
CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only insert their own settings
CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- USER ROLE ASSIGNMENTS POLICIES
-- =====================================================

-- Users can view their own role assignments
CREATE POLICY "Users can view own roles" ON user_role_assignments
    FOR SELECT USING (auth.uid() = user_id);

-- Only admins can manage role assignments
CREATE POLICY "Admins can manage roles" ON user_role_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments 
            WHERE user_id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
        )
    );

-- =====================================================
-- EVENT CATEGORIES POLICIES
-- =====================================================

-- Everyone can view active categories
CREATE POLICY "Everyone can view active categories" ON event_categories
    FOR SELECT USING (is_active = true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories" ON event_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments 
            WHERE user_id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
        )
    );

-- =====================================================
-- TAGS POLICIES
-- =====================================================

-- Everyone can view tags
CREATE POLICY "Everyone can view tags" ON tags
    FOR SELECT USING (true);

-- Only admins can manage tags
CREATE POLICY "Admins can manage tags" ON tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments 
            WHERE user_id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
        )
    );

-- =====================================================
-- EVENTS POLICIES
-- =====================================================

-- Everyone can view published events
CREATE POLICY "Everyone can view published events" ON events
    FOR SELECT USING (status = 'published');

-- Users can view their own events (draft or published)
CREATE POLICY "Users can view own events" ON events
    FOR SELECT USING (auth.uid() = organizer_id);

-- Organizers and admins can create events
CREATE POLICY "Organizers can create events" ON events
    FOR INSERT WITH CHECK (
        auth.uid() = organizer_id OR
        EXISTS (
            SELECT 1 FROM user_role_assignments 
            WHERE user_id = auth.uid() 
            AND role IN ('organizer', 'admin') 
            AND is_active = true
        )
    );

-- Organizers can update their own events, admins can update any
CREATE POLICY "Organizers can update own events" ON events
    FOR UPDATE USING (
        auth.uid() = organizer_id OR
        EXISTS (
            SELECT 1 FROM user_role_assignments 
            WHERE user_id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
        )
    );

-- Organizers can delete their own events, admins can delete any
CREATE POLICY "Organizers can delete own events" ON events
    FOR DELETE USING (
        auth.uid() = organizer_id OR
        EXISTS (
            SELECT 1 FROM user_role_assignments 
            WHERE user_id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
        )
    );

-- =====================================================
-- EVENT TAGS POLICIES
-- =====================================================

-- Everyone can view event tags
CREATE POLICY "Everyone can view event tags" ON event_tags
    FOR SELECT USING (true);

-- Only admins can manage event tags
CREATE POLICY "Admins can manage event tags" ON event_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments 
            WHERE user_id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
        )
    );

-- =====================================================
-- EVENT REGISTRATIONS POLICIES
-- =====================================================

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations" ON event_registrations
    FOR SELECT USING (auth.uid() = user_id);

-- Event organizers can view registrations for their events
CREATE POLICY "Organizers can view event registrations" ON event_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_registrations.event_id 
            AND events.organizer_id = auth.uid()
        )
    );

-- Users can register for events
CREATE POLICY "Users can register for events" ON event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations" ON event_registrations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can cancel their own registrations
CREATE POLICY "Users can cancel own registrations" ON event_registrations
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- EVENT REVIEWS POLICIES
-- =====================================================

-- Everyone can view public reviews
CREATE POLICY "Everyone can view public reviews" ON event_reviews
    FOR SELECT USING (is_public = true);

-- Users can view their own reviews
CREATE POLICY "Users can view own reviews" ON event_reviews
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON event_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON event_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON event_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- USER INTERESTS POLICIES
-- =====================================================

-- Users can view their own interests
CREATE POLICY "Users can view own interests" ON user_interests
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own interests
CREATE POLICY "Users can manage own interests" ON user_interests
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS FOR COMMON QUERIES
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_role_assignments 
        WHERE user_id = user_uuid 
        AND role = 'admin' 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is organizer
CREATE OR REPLACE FUNCTION is_organizer(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_role_assignments 
        WHERE user_id = user_uuid 
        AND role IN ('organizer', 'admin') 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS user_role AS $$
DECLARE
    user_role_value user_role;
BEGIN
    SELECT role INTO user_role_value
    FROM user_role_assignments 
    WHERE user_id = user_uuid 
    AND is_active = true
    ORDER BY 
        CASE role 
            WHEN 'admin' THEN 1
            WHEN 'moderator' THEN 2
            WHEN 'organizer' THEN 3
            WHEN 'student' THEN 4
        END
    LIMIT 1;
    
    RETURN COALESCE(user_role_value, 'student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION is_admin IS 'Check if user has admin role';
COMMENT ON FUNCTION is_organizer IS 'Check if user has organizer or admin role';
COMMENT ON FUNCTION get_user_role IS 'Get the highest priority role for a user';
