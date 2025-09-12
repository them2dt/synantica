-- =====================================================
-- Performance Optimization Indexes
-- =====================================================
-- Additional indexes to optimize query performance
-- and prevent N+1 query problems
-- =====================================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_status_date_created 
ON events(status, date, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_category_status_date 
ON events(category_id, status, date);

CREATE INDEX IF NOT EXISTS idx_events_field_region_status 
ON events(field, region, status);

CREATE INDEX IF NOT EXISTS idx_events_age_range_status 
ON events(min_age, max_age, status);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_events_title_search 
ON events USING gin(to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_events_description_search 
ON events USING gin(to_tsvector('english', description));

-- Partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_published_featured 
ON events(date, created_at DESC) 
WHERE status = 'published' AND is_featured = true;

CREATE INDEX IF NOT EXISTS idx_events_published_free 
ON events(date, created_at DESC) 
WHERE status = 'published' AND is_free = true;

-- Event tags optimization
CREATE INDEX IF NOT EXISTS idx_event_tags_tag_id_event_id 
ON event_tags(tag_id, event_id);

-- User interests optimization
CREATE INDEX IF NOT EXISTS idx_user_interests_user_tag 
ON user_interests(user_id, tag_id);

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

-- =====================================================
-- Query Performance Analysis
-- =====================================================

-- Analyze table statistics for better query planning
ANALYZE events;
ANALYZE event_categories;
ANALYZE tags;
ANALYZE event_tags;
ANALYZE event_registrations;
ANALYZE event_reviews;
ANALYZE user_interests;

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON INDEX idx_events_status_date_created IS 'Optimizes queries filtering by status and ordering by date/created_at';
COMMENT ON INDEX idx_events_category_status_date IS 'Optimizes category-based event filtering';
COMMENT ON INDEX idx_events_field_region_status IS 'Optimizes field and region-based filtering';
COMMENT ON INDEX idx_events_age_range_status IS 'Optimizes age-based filtering';
COMMENT ON INDEX idx_events_title_search IS 'Enables full-text search on event titles';
COMMENT ON INDEX idx_events_description_search IS 'Enables full-text search on event descriptions';
COMMENT ON INDEX idx_events_published_featured IS 'Optimizes featured events queries';
COMMENT ON INDEX idx_events_published_free IS 'Optimizes free events queries';
