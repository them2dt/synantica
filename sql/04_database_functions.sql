-- =====================================================
-- Database Functions and Procedures - SIMPLIFIED
-- =====================================================
-- This script creates useful database functions for
-- common operations, analytics, and data management.
-- =====================================================

-- Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS update_field_usage_on_insert ON event_field_assignments;
DROP TRIGGER IF EXISTS update_field_usage_on_delete ON event_field_assignments;

-- Drop all functions with CASCADE to handle dependencies
DROP FUNCTION IF EXISTS get_event_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_popular_events(INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_user_event_history(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_recommendations(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_field_usage_counts() CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_events() CASCADE;
DROP FUNCTION IF EXISTS get_users_for_event_notification(UUID) CASCADE;
DROP FUNCTION IF EXISTS trigger_update_field_usage() CASCADE;

-- Drop search_events with all possible parameter combinations
DROP FUNCTION IF EXISTS search_events(TEXT, VARCHAR, TEXT[], INTEGER, INTEGER, VARCHAR, DATE, DATE, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS search_events(TEXT, VARCHAR, VARCHAR, INTEGER, INTEGER, VARCHAR, DATE, DATE, BOOLEAN, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS search_events(TEXT, VARCHAR, VARCHAR, INTEGER, INTEGER, VARCHAR, DATE, DATE, BOOLEAN, INTEGER, INTEGER) CASCADE;

-- =====================================================
-- EVENT ANALYTICS FUNCTIONS
-- =====================================================

-- Function to get event statistics
CREATE OR REPLACE FUNCTION get_event_stats(event_uuid UUID)
RETURNS TABLE (
    total_registrations INTEGER,
    total_views INTEGER,
    average_rating DECIMAL(3,2),
    total_reviews INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(er.registration_count, 0)::INTEGER as total_registrations,
        0::INTEGER as total_views, -- Simplified - no view tracking
        COALESCE(rev.avg_rating, 0)::DECIMAL(3,2) as average_rating,
        COALESCE(rev.review_count, 0)::INTEGER as total_reviews
    FROM events e
    LEFT JOIN (
        SELECT 
            event_id,
            COUNT(*) as registration_count
        FROM event_registrations 
        WHERE status = 'registered'
        GROUP BY event_id
    ) er ON e.id = er.event_id
    LEFT JOIN (
        SELECT 
            event_id,
            AVG(rating) as avg_rating,
            COUNT(*) as review_count
        FROM event_reviews 
        WHERE is_public = true
        GROUP BY event_id
    ) rev ON e.id = rev.event_id
    WHERE e.id = event_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular events
CREATE OR REPLACE FUNCTION get_popular_events(
    limit_count INTEGER DEFAULT 10,
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    event_id UUID,
    name VARCHAR(255),
    type VARCHAR(100),
    registration_count BIGINT,
    average_rating DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.name,
        e.type,
        COALESCE(er.registration_count, 0) as registration_count,
        COALESCE(rev.avg_rating, 0) as average_rating
    FROM events e
    LEFT JOIN (
        SELECT 
            event_id,
            COUNT(*) as registration_count
        FROM event_registrations 
        WHERE status = 'registered'
        AND registration_date >= NOW() - INTERVAL '1 day' * days_back
        GROUP BY event_id
    ) er ON e.id = er.event_id
    LEFT JOIN (
        SELECT 
            event_id,
            AVG(rating) as avg_rating
        FROM event_reviews 
        WHERE is_public = true
        GROUP BY event_id
    ) rev ON e.id = rev.event_id
    WHERE e.status = 'published'
    AND e.created_at >= NOW() - INTERVAL '1 day' * days_back
    ORDER BY 
        COALESCE(er.registration_count, 0) DESC,
        COALESCE(rev.avg_rating, 0) DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search events
CREATE OR REPLACE FUNCTION search_events(
    search_query TEXT,
    type_filter VARCHAR(100) DEFAULT NULL,
    fields_filter TEXT[] DEFAULT NULL,
    from_age_filter INTEGER DEFAULT NULL,
    to_age_filter INTEGER DEFAULT NULL,
    country_filter VARCHAR(100) DEFAULT NULL,
    from_date_filter DATE DEFAULT NULL,
    to_date_filter DATE DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    event_id UUID,
    name VARCHAR(255),
    description TEXT,
    type VARCHAR(100),
    fields TEXT[],
    from_age INTEGER,
    to_age INTEGER,
    country VARCHAR(100),
    from_date DATE,
    to_date DATE,
    location VARCHAR(255),
    registration_count BIGINT,
    average_rating DECIMAL(3,2),
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.name,
        e.description,
        e.type,
        e.fields,
        e.from_age,
        e.to_age,
        e.country,
        e.from_date,
        e.to_date,
        e.location,
        COALESCE(er.registration_count, 0) as registration_count,
        COALESCE(rev.avg_rating, 0) as average_rating,
        CASE 
            WHEN search_query IS NOT NULL THEN
                ts_rank(
                    to_tsvector('english', e.name || ' ' || e.description),
                    plainto_tsquery('english', search_query)
                )
            ELSE 0
        END as relevance_score
    FROM events e
    LEFT JOIN (
        SELECT 
            event_id,
            COUNT(*) as registration_count
        FROM event_registrations 
        WHERE status = 'registered'
        GROUP BY event_id
    ) er ON e.id = er.event_id
    LEFT JOIN (
        SELECT 
            event_id,
            AVG(rating) as avg_rating
        FROM event_reviews 
        WHERE is_public = true
        GROUP BY event_id
    ) rev ON e.id = rev.event_id
    WHERE e.status = 'published'
    AND (
        search_query IS NULL OR
        to_tsvector('english', e.name || ' ' || e.description) @@ plainto_tsquery('english', search_query)
    )
    AND (type_filter IS NULL OR e.type = type_filter)
    AND (fields_filter IS NULL OR e.fields && fields_filter)
    AND (from_age_filter IS NULL OR e.from_age >= from_age_filter)
    AND (to_age_filter IS NULL OR e.to_age <= to_age_filter)
    AND (country_filter IS NULL OR e.country = country_filter)
    AND (from_date_filter IS NULL OR e.from_date >= from_date_filter)
    AND (to_date_filter IS NULL OR e.to_date <= to_date_filter)
    ORDER BY 
        CASE WHEN search_query IS NOT NULL THEN relevance_score ELSE 0 END DESC,
        e.from_date ASC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USER ANALYTICS FUNCTIONS
-- =====================================================

-- Function to get user event history
CREATE OR REPLACE FUNCTION get_user_event_history(user_uuid UUID)
RETURNS TABLE (
    event_id UUID,
    name VARCHAR(255),
    type VARCHAR(100),
    registration_date TIMESTAMP WITH TIME ZONE,
    status registration_status,
    rating INTEGER,
    review_comment TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.name,
        e.type,
        er.registration_date,
        er.status,
        rev.rating,
        rev.comment as review_comment
    FROM event_registrations er
    JOIN events e ON er.event_id = e.id
    LEFT JOIN event_reviews rev ON e.id = rev.event_id AND rev.user_id = user_uuid
    WHERE er.user_id = user_uuid
    ORDER BY er.registration_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user recommendations
CREATE OR REPLACE FUNCTION get_user_recommendations(
    user_uuid UUID,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    event_id UUID,
    name VARCHAR(255),
    type VARCHAR(100),
    fields TEXT[],
    from_age INTEGER,
    to_age INTEGER,
    country VARCHAR(100),
    from_date DATE,
    to_date DATE,
    location VARCHAR(255),
    recommendation_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.name,
        e.type,
        e.fields,
        e.from_age,
        e.to_age,
        e.country,
        e.from_date,
        e.to_date,
        e.location,
        COALESCE(
            (SELECT AVG(interest_level)::REAL / 5.0
             FROM user_interests ui
             JOIN event_field_assignments efa ON ui.field_id = efa.field_id
             WHERE efa.event_id = e.id AND ui.user_id = user_uuid),
            0.5
        ) as recommendation_score
    FROM events e
    WHERE e.status = 'published'
    AND e.from_date >= CURRENT_DATE
    AND NOT EXISTS (
        SELECT 1 FROM event_registrations 
        WHERE event_id = e.id AND user_id = user_uuid
    )
    ORDER BY recommendation_score DESC, e.from_date ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DATA MAINTENANCE FUNCTIONS
-- =====================================================

-- Function to update field usage counts
CREATE OR REPLACE FUNCTION update_field_usage_counts()
RETURNS VOID AS $$
BEGIN
    UPDATE event_fields 
    SET usage_count = (
        SELECT COUNT(*) 
        FROM event_field_assignments 
        WHERE field_id = event_fields.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired events
CREATE OR REPLACE FUNCTION cleanup_expired_events()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE events 
    SET status = 'cancelled'
    WHERE status = 'published'
    AND to_date < CURRENT_DATE - INTERVAL '7 days';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- NOTIFICATION FUNCTIONS
-- =====================================================

-- Function to get users to notify about new events
CREATE OR REPLACE FUNCTION get_users_for_event_notification(event_uuid UUID)
RETURNS TABLE (
    user_id UUID,
    email VARCHAR(255),
    full_name VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        up.id as user_id,
        up.email,
        up.full_name
    FROM user_profiles up
    JOIN user_settings us ON up.id = us.user_id
    WHERE us.event_reminders = true
    AND (
        -- Users interested in event fields
        EXISTS (
            SELECT 1 FROM user_interests ui
            JOIN event_field_assignments efa ON ui.field_id = efa.field_id
            WHERE efa.event_id = event_uuid
            AND ui.user_id = up.id
            AND ui.interest_level >= 3
        )
        OR
        -- Users who registered for similar events
        EXISTS (
            SELECT 1 FROM event_registrations er1
            JOIN events e1 ON er1.event_id = e1.id
            JOIN events e2 ON e1.type = e2.type
            WHERE e2.id = event_uuid
            AND er1.user_id = up.id
            AND er1.status = 'registered'
        )
    )
    AND NOT EXISTS (
        -- Exclude users who already registered
        SELECT 1 FROM event_registrations er
        WHERE er.event_id = event_uuid
        AND er.user_id = up.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger function to update field usage count when event_field_assignments change
CREATE OR REPLACE FUNCTION trigger_update_field_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE event_fields SET usage_count = usage_count + 1 WHERE id = NEW.field_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE event_fields SET usage_count = usage_count - 1 WHERE id = OLD.field_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_field_usage_on_insert
    AFTER INSERT ON event_field_assignments
    FOR EACH ROW EXECUTE FUNCTION trigger_update_field_usage();

CREATE TRIGGER update_field_usage_on_delete
    AFTER DELETE ON event_field_assignments
    FOR EACH ROW EXECUTE FUNCTION trigger_update_field_usage();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION get_event_stats IS 'Get comprehensive statistics for an event';
COMMENT ON FUNCTION get_popular_events IS 'Get popular events based on registrations and ratings';
COMMENT ON FUNCTION search_events IS 'Search events with filters and full-text search';
COMMENT ON FUNCTION get_user_event_history IS 'Get complete event history for a user';
COMMENT ON FUNCTION get_user_recommendations IS 'Get personalized event recommendations for a user';
COMMENT ON FUNCTION update_field_usage_counts IS 'Update usage counts for all event fields';
COMMENT ON FUNCTION cleanup_expired_events IS 'Mark old events as cancelled';
COMMENT ON FUNCTION get_users_for_event_notification IS 'Get users who should be notified about a new event';