-- =====================================================
-- Student Event Platform Database Schema
-- =====================================================
-- This script creates all the necessary tables for the
-- student event platform based on the TypeScript types
-- and current UX requirements.
-- =====================================================

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- Event status enum
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

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

-- Event categories
CREATE TABLE event_categories (
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

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7), -- Hex color code
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    
    -- Categorization
    category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,
    field VARCHAR(100) NOT NULL,
    min_age INTEGER,
    max_age INTEGER,
    region VARCHAR(100) NOT NULL,
    
    -- Date and time
    date DATE NOT NULL,
    time TIME NOT NULL,
    end_date DATE,
    end_time TIME,
    
    -- Location
    location VARCHAR(255) NOT NULL,
    venue_details TEXT,
    is_virtual BOOLEAN DEFAULT false,
    virtual_link TEXT,
    
    -- Registration
    registration_required BOOLEAN DEFAULT true,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Pricing
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status and metadata
    status event_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    
    -- Organizer information
    organizer_name VARCHAR(255) NOT NULL,
    organizer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    
    -- Requirements and prizes (stored as JSON arrays)
    requirements JSONB DEFAULT '[]',
    prizes JSONB DEFAULT '[]',
    external_links JSONB DEFAULT '[]',
    
    -- Resources and links
    support_pdfs JSONB DEFAULT '[]', -- Array of {name, url} objects
    organization_homepage TEXT,
    youtube_videos JSONB DEFAULT '[]', -- Array of URLs
    registration_url TEXT,
    alumni_contact_email TEXT,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    registration_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Event tags junction table (many-to-many)
CREATE TABLE event_tags (
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (event_id, tag_id)
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
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    interest_level INTEGER NOT NULL CHECK (interest_level >= 1 AND interest_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (user_id, tag_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_university ON user_profiles(university);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- Events indexes
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_is_featured ON events(is_featured);
CREATE INDEX idx_events_is_verified ON events(is_verified);
CREATE INDEX idx_events_field ON events(field);
CREATE INDEX idx_events_min_age ON events(min_age);
CREATE INDEX idx_events_max_age ON events(max_age);
CREATE INDEX idx_events_region ON events(region);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_published_at ON events(published_at);

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

-- Event tags indexes
CREATE INDEX idx_event_tags_event_id ON event_tags(event_id);
CREATE INDEX idx_event_tags_tag_id ON event_tags(tag_id);

-- User interests indexes
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_tag_id ON user_interests(tag_id);

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
CREATE TRIGGER update_event_categories_updated_at BEFORE UPDATE ON event_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_reviews_updated_at BEFORE UPDATE ON event_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_interests_updated_at BEFORE UPDATE ON user_interests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE user_profiles IS 'Extended user profiles beyond Supabase auth.users';
COMMENT ON TABLE user_settings IS 'User preferences and settings';
COMMENT ON TABLE user_role_assignments IS 'Role-based access control for users';
COMMENT ON TABLE event_categories IS 'Predefined event categories with metadata';
COMMENT ON TABLE tags IS 'Flexible tagging system for events';
COMMENT ON TABLE events IS 'Main events table with all event information';
COMMENT ON TABLE event_tags IS 'Many-to-many relationship between events and tags';
COMMENT ON TABLE event_registrations IS 'User registrations for events';
COMMENT ON TABLE event_reviews IS 'User reviews and ratings for events';
COMMENT ON TABLE user_interests IS 'User interests for recommendation system';
