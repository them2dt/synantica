-- =====================================================
-- Drop All Tables Script - SIMPLIFIED SCHEMA
-- =====================================================
-- This script drops all tables in the correct order
-- to respect foreign key constraints.
-- WARNING: This will delete ALL data!
-- =====================================================

-- =====================================================
-- DROP TRIGGERS FIRST
-- =====================================================

-- Drop triggers that might prevent table deletion
DROP TRIGGER IF EXISTS update_field_usage_on_insert ON event_field_assignments;
DROP TRIGGER IF EXISTS update_field_usage_on_delete ON event_field_assignments;
DROP TRIGGER IF EXISTS update_registration_count_on_insert ON event_registrations;
DROP TRIGGER IF EXISTS update_registration_count_on_update ON event_registrations;
DROP TRIGGER IF EXISTS update_registration_count_on_delete ON event_registrations;

-- Drop updated_at triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
DROP TRIGGER IF EXISTS update_event_types_updated_at ON event_types;
DROP TRIGGER IF EXISTS update_event_fields_updated_at ON event_fields;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_event_reviews_updated_at ON event_reviews;
DROP TRIGGER IF EXISTS update_user_interests_updated_at ON user_interests;

-- =====================================================
-- DROP FUNCTIONS
-- =====================================================

-- Drop custom functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS trigger_update_field_usage();
DROP FUNCTION IF EXISTS trigger_update_registration_count();
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS is_organizer(UUID);
DROP FUNCTION IF EXISTS get_user_role(UUID);
DROP FUNCTION IF EXISTS get_event_stats(UUID);
DROP FUNCTION IF EXISTS get_popular_events(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS search_events(TEXT, VARCHAR, TEXT[], INTEGER, INTEGER, VARCHAR, DATE, DATE, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_user_event_history(UUID);
DROP FUNCTION IF EXISTS get_user_recommendations(UUID, INTEGER);
DROP FUNCTION IF EXISTS update_field_usage_counts();
DROP FUNCTION IF EXISTS cleanup_expired_events();
DROP FUNCTION IF EXISTS get_users_for_event_notification(UUID);
DROP FUNCTION IF EXISTS handle_new_user();

-- =====================================================
-- DROP TABLES (in reverse dependency order)
-- =====================================================

-- Drop junction tables first (many-to-many relationships)
DROP TABLE IF EXISTS event_field_assignments CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;

-- Drop tables with foreign keys to other tables
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS event_reviews CASCADE;
DROP TABLE IF EXISTS user_role_assignments CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;

-- Drop main tables
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_fields CASCADE;
DROP TABLE IF EXISTS event_types CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- =====================================================
-- DROP CUSTOM TYPES
-- =====================================================

-- Drop custom ENUM types
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS registration_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS theme_type CASCADE;

-- =====================================================
-- DROP EXTENSIONS (optional - only if you want to remove UUID extension)
-- =====================================================

-- Uncomment the line below if you want to remove the UUID extension
-- DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if all tables are dropped
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    IF table_count = 0 THEN
        RAISE NOTICE 'All tables successfully dropped!';
    ELSE
        RAISE NOTICE 'Warning: % tables still exist', table_count;
    END IF;
END $$;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON SCHEMA public IS 'All tables have been dropped. Run 01_create_tables.sql to recreate the simplified schema.';