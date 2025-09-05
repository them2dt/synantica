-- =====================================================
-- Seed Data for Student Event Platform
-- =====================================================
-- This script inserts initial data for categories, tags,
-- and sample events to get started with the platform.
-- =====================================================

-- =====================================================
-- EVENT CATEGORIES
-- =====================================================

INSERT INTO event_categories (id, name, slug, description, icon, color, sort_order) VALUES
    (uuid_generate_v4(), 'Contests', 'contests', 'Competitions and contests with prizes', 'Trophy', '#FF327D', 1),
    (uuid_generate_v4(), 'Hackathons', 'hackathons', 'Coding competitions and innovation challenges', 'TrendingUp', '#3B82F6', 2),
    (uuid_generate_v4(), 'Events', 'events', 'General events and gatherings', 'Users', '#F59E0B', 3),
    (uuid_generate_v4(), 'Workshops', 'workshops', 'Hands-on learning sessions and skill development', 'BookOpen', '#10B981', 4),
    (uuid_generate_v4(), 'Seminars', 'seminars', 'Educational presentations and discussions', 'PresentationChart', '#8B5CF6', 5),
    (uuid_generate_v4(), 'Conferences', 'conferences', 'Large-scale professional gatherings', 'Users', '#F59E0B', 6),
    (uuid_generate_v4(), 'Networking', 'networking', 'Professional networking and career events', 'Briefcase', '#EF4444', 7),
    (uuid_generate_v4(), 'Social', 'social', 'Casual social gatherings and community events', 'Heart', '#EC4899', 8),
    (uuid_generate_v4(), 'Sports', 'sports', 'Athletic events and fitness activities', 'Activity', '#06B6D4', 9),
    (uuid_generate_v4(), 'Cultural', 'cultural', 'Cultural events and artistic performances', 'Palette', '#84CC16', 10),
    (uuid_generate_v4(), 'Academic', 'academic', 'Academic lectures and scholarly events', 'GraduationCap', '#6366F1', 11),
    (uuid_generate_v4(), 'Career', 'career', 'Career development and job-related events', 'Briefcase', '#F97316', 12),
    (uuid_generate_v4(), 'Volunteer', 'volunteer', 'Community service and volunteer opportunities', 'HandHeart', '#14B8A6', 13),
    (uuid_generate_v4(), 'Other', 'other', 'Miscellaneous events and activities', 'MoreHorizontal', '#6B7280', 14);

-- =====================================================
-- TAGS
-- =====================================================

INSERT INTO tags (id, name, slug, color, usage_count) VALUES
    -- Technology tags
    (uuid_generate_v4(), 'Tech', 'tech', '#3B82F6', 0),
    (uuid_generate_v4(), 'Coding', 'coding', '#10B981', 0),
    (uuid_generate_v4(), 'Innovation', 'innovation', '#8B5CF6', 0),
    (uuid_generate_v4(), 'AI', 'ai', '#F59E0B', 0),
    (uuid_generate_v4(), 'Machine Learning', 'machine-learning', '#EF4444', 0),
    (uuid_generate_v4(), 'Web Development', 'web-development', '#EC4899', 0),
    (uuid_generate_v4(), 'Mobile Development', 'mobile-development', '#06B6D4', 0),
    (uuid_generate_v4(), 'Data Science', 'data-science', '#84CC16', 0),
    (uuid_generate_v4(), 'Cybersecurity', 'cybersecurity', '#6366F1', 0),
    (uuid_generate_v4(), 'Blockchain', 'blockchain', '#F97316', 0),
    
    -- Business tags
    (uuid_generate_v4(), 'Startup', 'startup', '#14B8A6', 0),
    (uuid_generate_v4(), 'Entrepreneurship', 'entrepreneurship', '#3B82F6', 0),
    (uuid_generate_v4(), 'Business', 'business', '#10B981', 0),
    (uuid_generate_v4(), 'Marketing', 'marketing', '#8B5CF6', 0),
    (uuid_generate_v4(), 'Finance', 'finance', '#F59E0B', 0),
    
    -- Academic tags
    (uuid_generate_v4(), 'Computer Science', 'computer-science', '#EF4444', 0),
    (uuid_generate_v4(), 'Engineering', 'engineering', '#EC4899', 0),
    (uuid_generate_v4(), 'Design', 'design', '#06B6D4', 0),
    (uuid_generate_v4(), 'Research', 'research', '#84CC16', 0),
    (uuid_generate_v4(), 'Leadership', 'leadership', '#6366F1', 0),
    
    -- General tags
    (uuid_generate_v4(), 'Beginner Friendly', 'beginner-friendly', '#F97316', 0),
    (uuid_generate_v4(), 'Advanced', 'advanced', '#14B8A6', 0),
    (uuid_generate_v4(), 'Free', 'free', '#3B82F6', 0),
    (uuid_generate_v4(), 'Virtual', 'virtual', '#10B981', 0),
    (uuid_generate_v4(), 'In-Person', 'in-person', '#8B5CF6', 0);

-- =====================================================
-- SAMPLE EVENTS
-- =====================================================

-- Get category IDs for reference
DO $$
DECLARE
    hackathon_category_id UUID;
    workshop_category_id UUID;
    seminar_category_id UUID;
    networking_category_id UUID;
    tech_tag_id UUID;
    coding_tag_id UUID;
    innovation_tag_id UUID;
    ai_tag_id UUID;
    beginner_tag_id UUID;
    free_tag_id UUID;
    virtual_tag_id UUID;
    in_person_tag_id UUID;
    event1_id UUID;
    event2_id UUID;
    event3_id UUID;
    event4_id UUID;
    event5_id UUID;
    event6_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO hackathon_category_id FROM event_categories WHERE slug = 'hackathons';
    SELECT id INTO workshop_category_id FROM event_categories WHERE slug = 'workshops';
    SELECT id INTO seminar_category_id FROM event_categories WHERE slug = 'seminars';
    SELECT id INTO networking_category_id FROM event_categories WHERE slug = 'networking';
    
    -- Get tag IDs
    SELECT id INTO tech_tag_id FROM tags WHERE slug = 'tech';
    SELECT id INTO coding_tag_id FROM tags WHERE slug = 'coding';
    SELECT id INTO innovation_tag_id FROM tags WHERE slug = 'innovation';
    SELECT id INTO ai_tag_id FROM tags WHERE slug = 'ai';
    SELECT id INTO beginner_tag_id FROM tags WHERE slug = 'beginner-friendly';
    SELECT id INTO free_tag_id FROM tags WHERE slug = 'free';
    SELECT id INTO virtual_tag_id FROM tags WHERE slug = 'virtual';
    SELECT id INTO in_person_tag_id FROM tags WHERE slug = 'in-person';
    
    -- Insert sample events
    INSERT INTO events (
        id, title, description, short_description, category_id, field, age_range, region,
        date, time, end_date, end_time, location, is_virtual,
        registration_required, is_free, status, organizer_name,
        requirements, prizes, support_pdfs, organization_homepage,
        youtube_videos, registration_url, alumni_contact_email,
        is_featured, is_verified, published_at
    ) VALUES
    (
        uuid_generate_v4(),
        'HackTech 2024',
        'Join us for 48 hours of coding, innovation, and prizes! Build the next big thing with fellow developers and win amazing rewards. This hackathon brings together students from all backgrounds to create innovative solutions to real-world problems.',
        '48-hour coding competition with prizes',
        hackathon_category_id,
        'computer-science',
        '18-25',
        'zurich',
        '2024-03-15',
        '18:00:00',
        '2024-03-17',
        '18:00:00',
        'Computer Science Building, Room 101',
        false,
        true,
        true,
        'published',
        'Tech Society',
        '["Laptop", "Basic programming knowledge"]',
        '["$5,000 First Place", "$3,000 Second Place", "$2,000 Third Place"]',
        '[{"name": "Event Guidelines", "url": "https://drive.google.com/file/guidelines.pdf"}, {"name": "Preparation Checklist", "url": "https://drive.google.com/file/checklist.pdf"}]',
        'https://techsociety.edu',
        '["https://youtube.com/watch?v=previous-hackathon"]',
        'https://eventbrite.com/hacktech-2024',
        'visioncatalyzer@gmail.com',
        true,
        true,
        NOW()
    ) RETURNING id INTO event1_id;
    
    INSERT INTO events (
        id, title, description, short_description, category_id, field, age_range, region,
        date, time, location, is_virtual,
        registration_required, is_free, status, organizer_name,
        requirements, support_pdfs, organization_homepage,
        registration_url, is_featured, published_at
    ) VALUES
    (
        uuid_generate_v4(),
        'AI Workshop: Introduction to Machine Learning',
        'Learn the fundamentals of machine learning in this hands-on workshop. Perfect for beginners who want to understand AI concepts and build their first ML model.',
        'Beginner-friendly ML workshop',
        workshop_category_id,
        'computer-science',
        '18-25',
        'zurich',
        '2024-03-20',
        '14:00:00',
        'Engineering Building, Lab 205',
        false,
        true,
        true,
        'published',
        'AI Research Lab',
        '["Laptop", "Basic Python knowledge recommended"]',
        '[{"name": "Workshop Materials", "url": "https://drive.google.com/file/workshop-materials.pdf"}]',
        'https://airesearchlab.edu',
        'https://eventbrite.com/ai-workshop-ml',
        true,
        NOW()
    ) RETURNING id INTO event2_id;
    
    INSERT INTO events (
        id, title, description, short_description, category_id, field, age_range, region,
        date, time, location, is_virtual,
        registration_required, is_free, status, organizer_name,
        requirements, organization_homepage, registration_url,
        published_at
    ) VALUES
    (
        uuid_generate_v4(),
        'Tech Career Fair 2024',
        'Connect with top tech companies and startups. Network with recruiters, learn about internship opportunities, and discover your next career move in technology.',
        'Connect with tech companies and startups',
        networking_category_id,
        'business',
        '18-30',
        'zurich',
        '2024-03-25',
        '10:00:00',
        'Student Center, Main Hall',
        false,
        true,
        true,
        'published',
        'Career Services',
        '["Resume", "Professional attire"]',
        'https://careerservices.edu',
        'https://eventbrite.com/tech-career-fair',
        NOW()
    ) RETURNING id INTO event3_id;
    
    INSERT INTO events (
        id, title, description, short_description, category_id, field, age_range, region,
        date, time, location, is_virtual,
        registration_required, is_free, status, organizer_name,
        requirements, support_pdfs, organization_homepage,
        registration_url, published_at
    ) VALUES
    (
        uuid_generate_v4(),
        'Web Development Bootcamp',
        'Intensive 3-day bootcamp covering modern web development technologies including React, Node.js, and databases. Build a complete web application from scratch.',
        '3-day intensive web development course',
        workshop_category_id,
        'computer-science',
        '18-30',
        'zurich',
        '2024-04-01',
        '09:00:00',
        'Computer Science Building, Lab 301',
        false,
        true,
        true,
        'published',
        'Web Dev Academy',
        '["Laptop", "Basic HTML/CSS knowledge"]',
        '[{"name": "Bootcamp Syllabus", "url": "https://drive.google.com/file/bootcamp-syllabus.pdf"}]',
        'https://webdevacademy.edu',
        'https://eventbrite.com/web-dev-bootcamp',
        NOW()
    ) RETURNING id INTO event4_id;
    
    INSERT INTO events (
        id, title, description, short_description, category_id, field, age_range, region,
        date, time, location, is_virtual,
        registration_required, is_free, status, organizer_name,
        requirements, organization_homepage, registration_url,
        published_at
    ) VALUES
    (
        uuid_generate_v4(),
        'Startup Pitch Competition',
        'Present your innovative business ideas to a panel of successful entrepreneurs and investors. Win funding and mentorship opportunities for your startup.',
        'Pitch your startup idea to investors',
        seminar_category_id,
        'business',
        '18-35',
        'zurich',
        '2024-04-05',
        '16:00:00',
        'Business School, Auditorium',
        false,
        true,
        true,
        'published',
        'Entrepreneurship Center',
        '["Business plan", "Pitch deck"]',
        'https://entrepreneurship.edu',
        'https://eventbrite.com/startup-pitch',
        NOW()
    ) RETURNING id INTO event5_id;
    
    INSERT INTO events (
        id, title, description, short_description, category_id, field, age_range, region,
        date, time, location, is_virtual,
        registration_required, is_free, status, organizer_name,
        requirements, support_pdfs, organization_homepage,
        registration_url, published_at
    ) VALUES
    (
        uuid_generate_v4(),
        'Data Science Virtual Meetup',
        'Join our online community of data science enthusiasts. Share projects, discuss latest trends, and network with fellow data scientists from around the world.',
        'Virtual networking for data scientists',
        networking_category_id,
        'computer-science',
        '18-30',
        'international',
        '2024-04-10',
        '19:00:00',
        'Online - Zoom',
        true,
        true,
        true,
        'published',
        'Data Science Society',
        '["Zoom account", "Stable internet connection"]',
        '[{"name": "Meetup Guidelines", "url": "https://drive.google.com/file/meetup-guidelines.pdf"}]',
        'https://datasciencesociety.edu',
        'https://eventbrite.com/data-science-meetup',
        NOW()
    ) RETURNING id INTO event6_id;
    
    -- Link events to tags
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event1_id, tech_tag_id),
        (event1_id, coding_tag_id),
        (event1_id, innovation_tag_id),
        (event1_id, free_tag_id),
        (event1_id, in_person_tag_id),
        
        (event2_id, ai_tag_id),
        (event2_id, tech_tag_id),
        (event2_id, beginner_tag_id),
        (event2_id, free_tag_id),
        (event2_id, in_person_tag_id),
        
        (event3_id, tech_tag_id),
        (event3_id, free_tag_id),
        (event3_id, in_person_tag_id),
        
        (event4_id, coding_tag_id),
        (event4_id, tech_tag_id),
        (event4_id, beginner_tag_id),
        (event4_id, free_tag_id),
        (event4_id, in_person_tag_id),
        
        (event5_id, innovation_tag_id),
        (event5_id, free_tag_id),
        (event5_id, in_person_tag_id),
        
        (event6_id, tech_tag_id),
        (event6_id, free_tag_id),
        (event6_id, virtual_tag_id);
    
    -- Update tag usage counts
    UPDATE tags SET usage_count = (
        SELECT COUNT(*) FROM event_tags WHERE tag_id = tags.id
    );
    
END $$;
