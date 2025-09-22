-- =====================================================
-- Performance Optimization Indexes - SIMPLIFIED SCHEMA
-- =====================================================
-- Additional indexes to optimize query performance
-- for the new simplified event schema
-- =====================================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_status_from_date_created 
ON events(status, from_date, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_type_status_from_date 
ON events(type, status, from_date);

CREATE INDEX IF NOT EXISTS idx_events_country_status_from_date 
ON events(country, status, from_date);

CREATE INDEX IF NOT EXISTS idx_events_from_age_to_age_status 
ON events(from_age, to_age, status);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_events_name_search 
ON events USING gin(to_tsvector('english', name));

CREATE INDEX IF NOT EXISTS idx_events_description_search 
ON events USING gin(to_tsvector('english', description));

-- JSONB indexes for fields array
CREATE INDEX IF NOT EXISTS idx_events_fields_gin 
ON events USING gin(fields);

-- JSONB indexes for links array
CREATE INDEX IF NOT EXISTS idx_events_links_gin 
ON events USING gin(links);

-- Partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_published_featured 
ON events(from_date, created_at DESC) 
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_events_published_type 
ON events(from_date, created_at DESC) 
WHERE status = 'published' AND type = 'hackathon';

-- Event field assignments optimization
CREATE INDEX IF NOT EXISTS idx_event_field_assignments_field_event 
ON event_field_assignments(field_id, event_id);

-- User interests optimization
CREATE INDEX IF NOT EXISTS idx_user_interests_user_field 
ON user_interests(user_id, field_id);

-- Event registrations optimization
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_status 
ON event_registrations(user_id, status);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_status 
ON event_registrations(event_id, status);

-- Event reviews optimization
CREATE INDEX IF NOT EXISTS idx_event_reviews_event_rating 
ON event_reviews(event_id, rating);

CREATE INDEX IF NOT EXISTS idx_event_reviews_user_created 
ON event_reviews(user_id, created_at DESC);

-- Event types optimization
CREATE INDEX IF NOT EXISTS idx_event_types_slug_active 
ON event_types(slug) WHERE is_active = true;

-- Event fields optimization
CREATE INDEX IF NOT EXISTS idx_event_fields_slug 
ON event_fields(slug);

-- =====================================================
-- Query Performance Analysis
-- =====================================================

-- Analyze table statistics for better query planning
ANALYZE events;
ANALYZE event_types;
ANALYZE event_fields;
ANALYZE event_field_assignments;
ANALYZE event_registrations;
ANALYZE event_reviews;
ANALYZE user_interests;

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON INDEX idx_events_status_from_date_created IS 'Optimizes queries filtering by status and ordering by from_date/created_at';
COMMENT ON INDEX idx_events_type_status_from_date IS 'Optimizes type-based event filtering';
COMMENT ON INDEX idx_events_country_status_from_date IS 'Optimizes country-based filtering';
COMMENT ON INDEX idx_events_from_age_to_age_status IS 'Optimizes age-based filtering';
COMMENT ON INDEX idx_events_name_search IS 'Enables full-text search on event names';
COMMENT ON INDEX idx_events_description_search IS 'Enables full-text search on event descriptions';
COMMENT ON INDEX idx_events_fields_gin IS 'Enables efficient querying of event fields array';
COMMENT ON INDEX idx_events_links_gin IS 'Enables efficient querying of event links array';
COMMENT ON INDEX idx_events_published_featured IS 'Optimizes published events queries';
COMMENT ON INDEX idx_events_published_type IS 'Optimizes hackathon events queries';