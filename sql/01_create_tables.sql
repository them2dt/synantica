-- =====================================================
-- Student Event Platform Database Schema - SIMPLIFIED
-- =====================================================
-- This script creates all the necessary tables for the
-- student event platform based on the simplified TypeScript types
-- and clean event structure.
-- =====================================================

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- Drop existing types if they exist (to avoid conflicts)
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS registration_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS theme_type CASCADE;

-- Event status enum - simplified
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled');

-- User role enum
CREATE TYPE user_role AS ENUM ('student', 'organizer', 'admin', 'moderator');

-- Registration status enum
CREATE TYPE registration_status AS ENUM ('registered', 'cancelled', 'attended', 'no_show');

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');

-- Theme enum
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'system');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Drop existing tables if they exist (to avoid conflicts)
DROP TABLE IF EXISTS event_field_assignments CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS event_reviews CASCADE;
DROP TABLE IF EXISTS user_role_assignments CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_fields CASCADE;
DROP TABLE IF EXISTS event_types CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    
    -- Academic information
    university VARCHAR(255),
    major VARCHAR(255),
    graduation_year INTEGER,
    
    -- Social links
    linkedin_url TEXT,
    github_url TEXT,
    website_url TEXT,
    
    -- Location
    location VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
    theme theme_type DEFAULT 'system',
    email_notifications BOOLEAN DEFAULT true,
    event_reminders BOOLEAN DEFAULT true,
    weekly_digest BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User role assignments
CREATE TABLE user_role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    granted_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(user_id, role)
);

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

-- Event registrations
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status registration_status DEFAULT 'registered',
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    dietary_restrictions TEXT,
    accessibility_needs TEXT,
    emergency_contact TEXT,
    notes TEXT,
    payment_status payment_status,
    payment_amount DECIMAL(10,2),
    payment_reference VARCHAR(255),
    
    UNIQUE(event_id, user_id)
);

-- Event reviews
CREATE TABLE event_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- User interests (for recommendations)
CREATE TABLE user_interests (
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    field_id UUID NOT NULL REFERENCES event_fields(id) ON DELETE CASCADE,
    interest_level INTEGER NOT NULL CHECK (interest_level >= 1 AND interest_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (user_id, field_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_university ON user_profiles(university);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

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

-- Event registrations indexes
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);
CREATE INDEX idx_event_registrations_registration_date ON event_registrations(registration_date);

-- Event reviews indexes
CREATE INDEX idx_event_reviews_event_id ON event_reviews(event_id);
CREATE INDEX idx_event_reviews_user_id ON event_reviews(user_id);
CREATE INDEX idx_event_reviews_rating ON event_reviews(rating);
CREATE INDEX idx_event_reviews_created_at ON event_reviews(created_at);

-- Event field assignments indexes
CREATE INDEX idx_event_field_assignments_event_id ON event_field_assignments(event_id);
CREATE INDEX idx_event_field_assignments_field_id ON event_field_assignments(field_id);

-- User interests indexes
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_field_id ON user_interests(field_id);

-- User role assignments indexes
CREATE INDEX idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX idx_user_role_assignments_role ON user_role_assignments(role);
CREATE INDEX idx_user_role_assignments_is_active ON user_role_assignments(is_active);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_types_updated_at BEFORE UPDATE ON event_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_fields_updated_at BEFORE UPDATE ON event_fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_reviews_updated_at BEFORE UPDATE ON event_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_interests_updated_at BEFORE UPDATE ON user_interests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE user_profiles IS 'Extended user profiles beyond Supabase auth.users';
COMMENT ON TABLE user_settings IS 'User preferences and settings';
COMMENT ON TABLE user_role_assignments IS 'Role-based access control for users';
COMMENT ON TABLE event_types IS 'Predefined event types (hackathon, workshop, etc.)';
COMMENT ON TABLE event_fields IS 'Event fields/topics (technology, business, etc.)';
COMMENT ON TABLE events IS 'Main events table with simplified structure';
COMMENT ON TABLE event_field_assignments IS 'Many-to-many relationship between events and fields';
COMMENT ON TABLE event_registrations IS 'User registrations for events';
COMMENT ON TABLE event_reviews IS 'User reviews and ratings for events';
COMMENT ON TABLE user_interests IS 'User interests for recommendation system';