-- =====================================================
-- Migration Script: Old Schema to Simplified Schema
-- =====================================================
-- This script migrates from the old complex event schema
-- to the new simplified event schema.
-- =====================================================

-- =====================================================
-- BACKUP EXISTING DATA
-- =====================================================

-- Create backup tables
CREATE TABLE events_backup AS SELECT * FROM events;
CREATE TABLE event_categories_backup AS SELECT * FROM event_categories;
CREATE TABLE tags_backup AS SELECT * FROM tags;
CREATE TABLE event_tags_backup AS SELECT * FROM event_tags;

-- =====================================================
-- DROP OLD CONSTRAINTS AND TABLES
-- =====================================================

-- Drop foreign key constraints
ALTER TABLE event_registrations DROP CONSTRAINT IF EXISTS event_registrations_event_id_fkey;
ALTER TABLE event_reviews DROP CONSTRAINT IF EXISTS event_reviews_event_id_fkey;
ALTER TABLE event_tags DROP CONSTRAINT IF EXISTS event_tags_event_id_fkey;
ALTER TABLE event_tags DROP CONSTRAINT IF EXISTS event_tags_tag_id_fkey;

-- Drop old tables
DROP TABLE IF EXISTS event_tags CASCADE;
DROP TABLE IF EXISTS event_categories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS events CASCADE;

-- =====================================================
-- CREATE NEW SIMPLIFIED TABLES
-- =====================================================

-- Event types (replaces categories)
CREATE TABLE event_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event fields (replaces tags)
CREATE TABLE event_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7), -- Hex color code
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table - SIMPLIFIED
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Date range
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    
    -- Location
    location VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- Organizer
    organizer VARCHAR(255) NOT NULL,
    organizer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    
    -- Age range
    from_age INTEGER,
    to_age INTEGER,
    
    -- Media and links
    youtube_link TEXT,
    links JSONB DEFAULT '[]', -- Array of strings
    
    -- Categorization
    type VARCHAR(100) NOT NULL,
    fields JSONB DEFAULT '[]', -- Array of strings
    
    -- Status
    status event_status DEFAULT 'draft',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event field assignments (many-to-many)
CREATE TABLE event_field_assignments (
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    field_id UUID NOT NULL REFERENCES event_fields(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (event_id, field_id)
);

-- =====================================================
-- MIGRATE DATA
-- =====================================================

-- Migrate categories to event types
INSERT INTO event_types (id, name, slug, description, icon, color, sort_order, created_at, updated_at)
SELECT 
    id,
    name,
    slug,
    description,
    icon,
    color,
    sort_order,
    created_at,
    updated_at
FROM event_categories_backup;

-- Migrate tags to event fields
INSERT INTO event_fields (id, name, slug, color, usage_count, created_at, updated_at)
SELECT 
    id,
    name,
    slug,
    color,
    usage_count,
    created_at,
    updated_at
FROM tags_backup;

-- Migrate events with simplified structure
INSERT INTO events (
    id, name, description, from_date, to_date, location, country, organizer, organizer_id,
    from_age, to_age, youtube_link, links, type, fields, status, created_at, updated_at
)
SELECT 
    e.id,
    e.title as name,
    e.description,
    COALESCE(e.date, CURRENT_DATE) as from_date,
    COALESCE(e.end_date, e.date, CURRENT_DATE) as to_date,
    e.location,
    COALESCE(e.region, 'Unknown') as country,
    e.organizer_name as organizer,
    e.organizer_id,
    e.min_age as from_age,
    e.max_age as to_age,
    CASE 
        WHEN e.youtube_videos IS NOT NULL AND jsonb_array_length(e.youtube_videos) > 0 
        THEN e.youtube_videos->0->>'url'
        ELSE NULL
    END as youtube_link,
    COALESCE(e.external_links, '[]'::jsonb) as links,
    COALESCE(ec.name, 'other') as type,
    COALESCE(
        (SELECT jsonb_agg(t.name) 
         FROM event_tags_backup et 
         JOIN tags_backup t ON et.tag_id = t.id 
         WHERE et.event_id = e.id), 
        '[]'::jsonb
    ) as fields,
    CASE 
        WHEN e.status = 'completed' THEN 'cancelled'::event_status
        ELSE e.status::event_status
    END as status,
    e.created_at,
    e.updated_at
FROM events_backup e
LEFT JOIN event_categories_backup ec ON e.category_id = ec.id;

-- Migrate event-tag relationships to event-field relationships
INSERT INTO event_field_assignments (event_id, field_id, created_at)
SELECT 
    et.event_id,
    et.tag_id as field_id,
    et.created_at
FROM event_tags_backup et
WHERE EXISTS (SELECT 1 FROM events WHERE id = et.event_id)
AND EXISTS (SELECT 1 FROM event_fields WHERE id = et.tag_id);

-- =====================================================
-- RECREATE CONSTRAINTS
-- =====================================================

-- Recreate foreign key constraints
ALTER TABLE event_registrations ADD CONSTRAINT event_registrations_event_id_fkey 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE event_reviews ADD CONSTRAINT event_reviews_event_id_fkey 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

-- =====================================================
-- CREATE INDEXES
-- =====================================================

-- Events indexes
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_from_date ON events(from_date);
CREATE INDEX idx_events_to_date ON events(to_date);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_country ON events(country);
CREATE INDEX idx_events_from_age ON events(from_age);
CREATE INDEX idx_events_to_age ON events(to_age);
CREATE INDEX idx_events_created_at ON events(created_at);

-- Event field assignments indexes
CREATE INDEX idx_event_field_assignments_event_id ON event_field_assignments(event_id);
CREATE INDEX idx_event_field_assignments_field_id ON event_field_assignments(field_id);

-- =====================================================
-- UPDATE FIELD USAGE COUNTS
-- =====================================================

UPDATE event_fields SET usage_count = (
    SELECT COUNT(*) FROM event_field_assignments WHERE field_id = event_fields.id
);

-- =====================================================
-- CLEANUP
-- =====================================================

-- Drop backup tables after successful migration
-- (Uncomment these lines after verifying the migration was successful)
-- DROP TABLE IF EXISTS events_backup;
-- DROP TABLE IF EXISTS event_categories_backup;
-- DROP TABLE IF EXISTS tags_backup;
-- DROP TABLE IF EXISTS event_tags_backup;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify migration
SELECT 
    'Events migrated' as table_name,
    COUNT(*) as count
FROM events
UNION ALL
SELECT 
    'Event types migrated' as table_name,
    COUNT(*) as count
FROM event_types
UNION ALL
SELECT 
    'Event fields migrated' as table_name,
    COUNT(*) as count
FROM event_fields
UNION ALL
SELECT 
    'Event field assignments migrated' as table_name,
    COUNT(*) as count
FROM event_field_assignments;
