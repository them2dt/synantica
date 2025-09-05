-- =====================================================
-- Database Functions and Procedures
-- =====================================================
-- This script creates useful database functions for
-- common operations, analytics, and data management.
-- =====================================================

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
        COALESCE(e.view_count, 0)::INTEGER as total_views,
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
    title VARCHAR(255),
    category_name VARCHAR(100),
    registration_count BIGINT,
    view_count INTEGER,
    average_rating DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.title,
        ec.name as category_name,
        COALESCE(er.registration_count, 0) as registration_count,
        e.view_count,
        COALESCE(rev.avg_rating, 0) as average_rating
    FROM events e
    JOIN event_categories ec ON e.category_id = ec.id
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
        e.view_count DESC,
        COALESCE(rev.avg_rating, 0) DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search events
CREATE OR REPLACE FUNCTION search_events(
    search_query TEXT,
    category_filter VARCHAR(100) DEFAULT NULL,
    field_filter VARCHAR(100) DEFAULT NULL,
    min_age_filter INTEGER DEFAULT NULL,
    max_age_filter INTEGER DEFAULT NULL,
    region_filter VARCHAR(100) DEFAULT NULL,
    date_from DATE DEFAULT NULL,
    date_to DATE DEFAULT NULL,
    is_free_filter BOOLEAN DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    event_id UUID,
    title VARCHAR(255),
    description TEXT,
    category_name VARCHAR(100),
    field VARCHAR(100),
    min_age INTEGER,
    max_age INTEGER,
    region VARCHAR(100),
    date DATE,
    "time" TIME,
    location VARCHAR(255),
    is_free BOOLEAN,
    registration_count BIGINT,
    average_rating DECIMAL(3,2),
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.title,
        e.description,
        ec.name as category_name,
        e.field,
        e.min_age,
        e.max_age,
        e.region,
        e.date,
        e.time,
        e.location,
        e.is_free,
        COALESCE(er.registration_count, 0) as registration_count,
        COALESCE(rev.avg_rating, 0) as average_rating,
        ts_rank(
            to_tsvector('english', e.title || ' ' || e.description),
            plainto_tsquery('english', search_query)
        ) as relevance_score
    FROM events e
    JOIN event_categories ec ON e.category_id = ec.id
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
        to_tsvector('english', e.title || ' ' || e.description) @@ plainto_tsquery('english', search_query)
    )
    AND (category_filter IS NULL OR ec.slug = category_filter)
    AND (field_filter IS NULL OR e.field = field_filter)
    AND (min_age_filter IS NULL OR e.min_age >= min_age_filter)
    AND (max_age_filter IS NULL OR e.max_age <= max_age_filter)
    AND (region_filter IS NULL OR e.region = region_filter)
    AND (date_from IS NULL OR e.date >= date_from)
    AND (date_to IS NULL OR e.date <= date_to)
    AND (is_free_filter IS NULL OR e.is_free = is_free_filter)
    ORDER BY 
        CASE WHEN search_query IS NOT NULL THEN relevance_score ELSE 0 END DESC,
        e.date ASC,
        e.time ASC
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
    title VARCHAR(255),
    category_name VARCHAR(100),
    registration_date TIMESTAMP WITH TIME ZONE,
    status registration_status,
    rating INTEGER,
    review_comment TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.title,
        ec.name as category_name,
        er.registration_date,
        er.status,
        rev.rating,
        rev.comment as review_comment
    FROM event_registrations er
    JOIN events e ON er.event_id = e.id
    JOIN event_categories ec ON e.category_id = ec.id
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
    title VARCHAR(255),
    category_name VARCHAR(100),
    field VARCHAR(100),
    min_age INTEGER,
    max_age INTEGER,
    region VARCHAR(100),
    date DATE,
    "time" TIME,
    location VARCHAR(255),
    is_free BOOLEAN,
    recommendation_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as event_id,
        e.title,
        ec.name as category_name,
        e.field,
        e.min_age,
        e.max_age,
        e.region,
        e.date,
        e.time,
        e.location,
        e.is_free,
        COALESCE(
            (SELECT AVG(interest_level)::REAL / 5.0
             FROM user_interests ui
             JOIN event_tags et ON ui.tag_id = et.tag_id
             WHERE et.event_id = e.id AND ui.user_id = user_uuid),
            0.5
        ) as recommendation_score
    FROM events e
    JOIN event_categories ec ON e.category_id = ec.id
    WHERE e.status = 'published'
    AND e.date >= CURRENT_DATE
    AND NOT EXISTS (
        SELECT 1 FROM event_registrations 
        WHERE event_id = e.id AND user_id = user_uuid
    )
    ORDER BY recommendation_score DESC, e.date ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DATA MAINTENANCE FUNCTIONS
-- =====================================================

-- Function to update tag usage counts
CREATE OR REPLACE FUNCTION update_tag_usage_counts()
RETURNS VOID AS $$
BEGIN
    UPDATE tags 
    SET usage_count = (
        SELECT COUNT(*) 
        FROM event_tags 
        WHERE tag_id = tags.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update event registration counts
CREATE OR REPLACE FUNCTION update_event_registration_counts()
RETURNS VOID AS $$
BEGIN
    UPDATE events 
    SET registration_count = (
        SELECT COUNT(*) 
        FROM event_registrations 
        WHERE event_id = events.id 
        AND status = 'registered'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired events
CREATE OR REPLACE FUNCTION cleanup_expired_events()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE events 
    SET status = 'completed'
    WHERE status = 'published'
    AND date < CURRENT_DATE - INTERVAL '7 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
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
        -- Users interested in event tags
        EXISTS (
            SELECT 1 FROM user_interests ui
            JOIN event_tags et ON ui.tag_id = et.tag_id
            WHERE et.event_id = event_uuid
            AND ui.user_id = up.id
            AND ui.interest_level >= 3
        )
        OR
        -- Users who registered for similar events
        EXISTS (
            SELECT 1 FROM event_registrations er1
            JOIN events e1 ON er1.event_id = e1.id
            JOIN events e2 ON e1.category_id = e2.category_id
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

-- Trigger function to update tag usage count when event_tags change
CREATE OR REPLACE FUNCTION trigger_update_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_tag_usage_on_insert
    AFTER INSERT ON event_tags
    FOR EACH ROW EXECUTE FUNCTION trigger_update_tag_usage();

CREATE TRIGGER update_tag_usage_on_delete
    AFTER DELETE ON event_tags
    FOR EACH ROW EXECUTE FUNCTION trigger_update_tag_usage();

-- Trigger function to update event registration count
CREATE OR REPLACE FUNCTION trigger_update_registration_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET registration_count = registration_count + 1 WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status != NEW.status THEN
            IF OLD.status = 'registered' AND NEW.status != 'registered' THEN
                UPDATE events SET registration_count = registration_count - 1 WHERE id = NEW.event_id;
            ELSIF OLD.status != 'registered' AND NEW.status = 'registered' THEN
                UPDATE events SET registration_count = registration_count + 1 WHERE id = NEW.event_id;
            END IF;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.status = 'registered' THEN
            UPDATE events SET registration_count = registration_count - 1 WHERE id = OLD.event_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for event registrations
CREATE TRIGGER update_registration_count_on_insert
    AFTER INSERT ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION trigger_update_registration_count();

CREATE TRIGGER update_registration_count_on_update
    AFTER UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION trigger_update_registration_count();

CREATE TRIGGER update_registration_count_on_delete
    AFTER DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION trigger_update_registration_count();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION get_event_stats IS 'Get comprehensive statistics for an event';
COMMENT ON FUNCTION get_popular_events IS 'Get popular events based on registrations and views';
COMMENT ON FUNCTION search_events IS 'Search events with filters and full-text search';
COMMENT ON FUNCTION get_user_event_history IS 'Get complete event history for a user';
COMMENT ON FUNCTION get_user_recommendations IS 'Get personalized event recommendations for a user';
COMMENT ON FUNCTION update_tag_usage_counts IS 'Update usage counts for all tags';
COMMENT ON FUNCTION update_event_registration_counts IS 'Update registration counts for all events';
COMMENT ON FUNCTION cleanup_expired_events IS 'Mark old events as completed';
COMMENT ON FUNCTION get_users_for_event_notification IS 'Get users who should be notified about a new event';
