-- =====================================================
-- Seed Data for Student Event Platform - SIMPLIFIED
-- =====================================================
-- This script inserts initial data for event types, fields,
-- and sample events to get started with the platform.
-- =====================================================

-- =====================================================
-- EVENT TYPES
-- =====================================================

INSERT INTO event_types (id, name, slug, description, icon, color, sort_order) VALUES
    (uuid_generate_v4(), 'Olympiads', 'olympiads', 'Academic competitions and olympiads', 'Award', '#FF327D', 1),
    (uuid_generate_v4(), 'Contests', 'contests', 'Competitions and contests with prizes', 'Trophy', '#3B82F6', 2),
    (uuid_generate_v4(), 'Events', 'events', 'General events and gatherings', 'Users', '#10B981', 3),
    (uuid_generate_v4(), 'Workshops', 'workshops', 'Hands-on learning sessions and skill development', 'BookOpen', '#8B5CF6', 4);

-- =====================================================
-- EVENT FIELDS
-- =====================================================

INSERT INTO event_fields (id, name, slug, color, usage_count) VALUES
    -- Technology fields
    (uuid_generate_v4(), 'Technology', 'technology', '#3B82F6', 0),
    (uuid_generate_v4(), 'Programming', 'programming', '#10B981', 0),
    (uuid_generate_v4(), 'Artificial Intelligence', 'artificial-intelligence', '#8B5CF6', 0),
    (uuid_generate_v4(), 'Machine Learning', 'machine-learning', '#F59E0B', 0),
    (uuid_generate_v4(), 'Web Development', 'web-development', '#EC4899', 0),
    (uuid_generate_v4(), 'Mobile Development', 'mobile-development', '#06B6D4', 0),
    (uuid_generate_v4(), 'Data Science', 'data-science', '#84CC16', 0),
    (uuid_generate_v4(), 'Cybersecurity', 'cybersecurity', '#6366F1', 0),
    (uuid_generate_v4(), 'Blockchain', 'blockchain', '#F97316', 0),
    
    -- Business fields
    (uuid_generate_v4(), 'Startup', 'startup', '#14B8A6', 0),
    (uuid_generate_v4(), 'Entrepreneurship', 'entrepreneurship', '#3B82F6', 0),
    (uuid_generate_v4(), 'Business', 'business', '#10B981', 0),
    (uuid_generate_v4(), 'Marketing', 'marketing', '#8B5CF6', 0),
    (uuid_generate_v4(), 'Finance', 'finance', '#F59E0B', 0),
    
    -- Academic fields
    (uuid_generate_v4(), 'Computer Science', 'computer-science', '#EF4444', 0),
    (uuid_generate_v4(), 'Engineering', 'engineering', '#EC4899', 0),
    (uuid_generate_v4(), 'Design', 'design', '#06B6D4', 0),
    (uuid_generate_v4(), 'Research', 'research', '#84CC16', 0),
    (uuid_generate_v4(), 'Leadership', 'leadership', '#6366F1', 0),
    
    -- General fields
    (uuid_generate_v4(), 'Beginner Friendly', 'beginner-friendly', '#F97316', 0),
    (uuid_generate_v4(), 'Advanced', 'advanced', '#14B8A6', 0),
    (uuid_generate_v4(), 'Free', 'free', '#3B82F6', 0),
    (uuid_generate_v4(), 'Virtual', 'virtual', '#10B981', 0),
    (uuid_generate_v4(), 'In-Person', 'in-person', '#8B5CF6', 0);

-- =====================================================
-- SAMPLE EVENTS
-- =====================================================

-- Insert sample events with simplified structure
INSERT INTO events (
    id, name, description, from_date, to_date, location, country, organizer,
    from_age, to_age, youtube_link, links, type, fields, status, created_at, updated_at
) VALUES
    (
        uuid_generate_v4(),
        'HackTech 2024',
        'Join us for 48 hours of coding, innovation, and prizes! Build the next big thing with fellow developers and win amazing rewards. This hackathon brings together students from all backgrounds to create innovative solutions to real-world problems.',
        '2024-03-15',
        '2024-03-17',
        'Computer Science Building, Room 101',
        'Switzerland',
        'Tech Society',
        18,
        25,
        'https://youtube.com/watch?v=previous-hackathon',
        '["https://techsociety.edu", "https://eventbrite.com/hacktech-2024"]',
        'contests',
        '["Technology", "Programming", "Innovation", "Free", "In-Person"]',
        'published',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'AI Workshop: Introduction to Machine Learning',
        'Learn the fundamentals of machine learning in this hands-on workshop. Perfect for beginners who want to understand AI concepts and build their first ML model.',
        '2024-03-20',
        '2024-03-20',
        'Engineering Building, Lab 205',
        'Switzerland',
        'AI Research Lab',
        18,
        25,
        'https://youtube.com/watch?v=ml-intro',
        '["https://airesearchlab.edu", "https://eventbrite.com/ai-workshop-ml"]',
        'workshops',
        '["Artificial Intelligence", "Machine Learning", "Technology", "Beginner Friendly", "Free", "In-Person"]',
        'published',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'Tech Career Fair 2024',
        'Connect with top tech companies and startups. Network with recruiters, learn about internship opportunities, and discover your next career move in technology.',
        '2024-03-25',
        '2024-03-25',
        'Student Center, Main Hall',
        'Switzerland',
        'Career Services',
        18,
        30,
        NULL,
        '["https://careerservices.edu", "https://eventbrite.com/tech-career-fair"]',
        'events',
        '["Technology", "Business", "Career", "Free", "In-Person"]',
        'published',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'Web Development Bootcamp',
        'Intensive 3-day bootcamp covering modern web development technologies including React, Node.js, and databases. Build a complete web application from scratch.',
        '2024-04-01',
        '2024-04-03',
        'Computer Science Building, Lab 301',
        'Switzerland',
        'Web Dev Academy',
        18,
        30,
        'https://youtube.com/watch?v=web-dev-bootcamp',
        '["https://webdevacademy.edu", "https://eventbrite.com/web-dev-bootcamp"]',
        'workshops',
        '["Web Development", "Programming", "Technology", "Beginner Friendly", "Free", "In-Person"]',
        'published',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'Startup Pitch Competition',
        'Present your innovative business ideas to a panel of successful entrepreneurs and investors. Win funding and mentorship opportunities for your startup.',
        '2024-04-05',
        '2024-04-05',
        'Business School, Auditorium',
        'Switzerland',
        'Entrepreneurship Center',
        18,
        35,
        NULL,
        '["https://entrepreneurship.edu", "https://eventbrite.com/startup-pitch"]',
        'olympiads',
        '["Startup", "Entrepreneurship", "Business", "Innovation", "Free", "In-Person"]',
        'published',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'Data Science Virtual Meetup',
        'Join our online community of data science enthusiasts. Share projects, discuss latest trends, and network with fellow data scientists from around the world.',
        '2024-04-10',
        '2024-04-10',
        'Online - Zoom',
        'International',
        'Data Science Society',
        18,
        30,
        'https://youtube.com/watch?v=data-science-meetup',
        '["https://datasciencesociety.edu", "https://eventbrite.com/data-science-meetup"]',
        'events',
        '["Data Science", "Technology", "Research", "Free", "Virtual"]',
        'published',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'Cybersecurity Workshop',
        'Learn about the latest cybersecurity threats and how to protect against them. Hands-on exercises with real-world scenarios and tools.',
        '2024-04-15',
        '2024-04-15',
        'Computer Science Building, Lab 102',
        'Switzerland',
        'Cybersecurity Institute',
        20,
        30,
        NULL,
        '["https://cybersecurity.edu", "https://eventbrite.com/cybersecurity-workshop"]',
        'workshops',
        '["Cybersecurity", "Technology", "Advanced", "Free", "In-Person"]',
        'published',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'Blockchain Innovation Summit',
        'Explore the future of blockchain technology with industry leaders, developers, and entrepreneurs. Learn about DeFi, NFTs, and Web3 applications.',
        '2024-04-20',
        '2024-04-21',
        'Convention Center, Hall A',
        'Switzerland',
        'Blockchain Association',
        18,
        40,
        'https://youtube.com/watch?v=blockchain-summit',
        '["https://blockchain-association.edu", "https://eventbrite.com/blockchain-summit"]',
        'events',
        '["Blockchain", "Technology", "Innovation", "Business", "Free", "In-Person"]',
        'published',
        NOW(),
        NOW()
    );

-- Update field usage counts
UPDATE event_fields SET usage_count = (
    SELECT COUNT(*) FROM events WHERE fields::text LIKE '%' || event_fields.name || '%'
);