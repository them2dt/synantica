-- =====================================================
-- Real Opportunity Data for Student Event Platform
-- =====================================================
-- This script inserts real academic competitions, olympiads,
-- hackathons, and workshops based on the provided CSV data.
-- 
-- PREREQUISITES:
-- 1. Run 01_create_tables.sql first
-- 2. Run 02_insert_seed_data.sql first (for base categories and tags)
-- 3. Run 03_row_level_security.sql first
-- 4. Run 04_database_functions.sql first
-- =====================================================

-- Check if required tables exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_categories') THEN
        RAISE EXCEPTION 'event_categories table not found. Please run 01_create_tables.sql first.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tags') THEN
        RAISE EXCEPTION 'tags table not found. Please run 01_create_tables.sql first.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
        RAISE EXCEPTION 'events table not found. Please run 01_create_tables.sql first.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_tags') THEN
        RAISE EXCEPTION 'event_tags table not found. Please run 01_create_tables.sql first.';
    END IF;
END $$;

-- =====================================================
-- ADDITIONAL CATEGORIES (if not already present)
-- =====================================================

-- Insert additional categories specific to academic competitions
INSERT INTO event_categories (id, name, slug, description, icon, color, sort_order) VALUES
    (uuid_generate_v4(), 'Olympiads', 'olympiads', 'Academic competitions and olympiads', 'Award', '#8B5CF6', 15),
    (uuid_generate_v4(), 'Science Fairs', 'science-fairs', 'Science and engineering exhibitions', 'Microscope', '#10B981', 16)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ADDITIONAL TAGS
-- =====================================================

-- Insert subject-specific tags
INSERT INTO tags (id, name, slug, color, usage_count) VALUES
    -- STEM Subjects
    (uuid_generate_v4(), 'Mathematics', 'mathematics', '#3B82F6', 0),
    (uuid_generate_v4(), 'Physics', 'physics', '#EF4444', 0),
    (uuid_generate_v4(), 'Chemistry', 'chemistry', '#10B981', 0),
    (uuid_generate_v4(), 'Biology', 'biology', '#84CC16', 0),
    (uuid_generate_v4(), 'Computer Science', 'computer-science', '#8B5CF6', 0),
    (uuid_generate_v4(), 'Astronomy', 'astronomy', '#6366F1', 0),
    (uuid_generate_v4(), 'Geography', 'geography', '#F59E0B', 0),
    (uuid_generate_v4(), 'Linguistics', 'linguistics', '#EC4899', 0),
    (uuid_generate_v4(), 'Economics', 'economics', '#14B8A6', 0),
    (uuid_generate_v4(), 'Robotics', 'robotics', '#F97316', 0),
    (uuid_generate_v4(), 'Philosophy', 'philosophy', '#6B7280', 0),
    (uuid_generate_v4(), 'Engineering', 'engineering', '#06B6D4', 0),
    
    -- Competition Types
    (uuid_generate_v4(), 'International', 'international', '#FF327D', 0),
    (uuid_generate_v4(), 'National', 'national', '#3B82F6', 0),
    (uuid_generate_v4(), 'European', 'european', '#10B981', 0),
    (uuid_generate_v4(), 'Swiss', 'swiss', '#F59E0B', 0),
    
    -- Age Groups
    (uuid_generate_v4(), 'High School', 'high-school', '#8B5CF6', 0),
    (uuid_generate_v4(), 'University', 'university', '#EF4444', 0),
    (uuid_generate_v4(), 'All Ages', 'all-ages', '#84CC16', 0)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- REAL OPPORTUNITY EVENTS
-- =====================================================

-- Get category IDs for reference
DO $$
DECLARE
    contest_category_id UUID;
    hackathon_category_id UUID;
    workshop_category_id UUID;
    olympiad_category_id UUID;
    science_fair_category_id UUID;
    
    -- Tag IDs
    mathematics_tag_id UUID;
    physics_tag_id UUID;
    chemistry_tag_id UUID;
    biology_tag_id UUID;
    computer_science_tag_id UUID;
    astronomy_tag_id UUID;
    geography_tag_id UUID;
    linguistics_tag_id UUID;
    economics_tag_id UUID;
    robotics_tag_id UUID;
    philosophy_tag_id UUID;
    engineering_tag_id UUID;
    international_tag_id UUID;
    national_tag_id UUID;
    european_tag_id UUID;
    swiss_tag_id UUID;
    high_school_tag_id UUID;
    university_tag_id UUID;
    all_ages_tag_id UUID;
    stem_tag_id UUID;
    sustainability_tag_id UUID;
    
    -- Event IDs
    event_id UUID;
BEGIN
    -- Get category IDs (with error handling)
    SELECT id INTO contest_category_id FROM event_categories WHERE slug = 'contests';
    IF contest_category_id IS NULL THEN
        RAISE EXCEPTION 'Contests category not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO hackathon_category_id FROM event_categories WHERE slug = 'hackathons';
    IF hackathon_category_id IS NULL THEN
        RAISE EXCEPTION 'Hackathons category not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO workshop_category_id FROM event_categories WHERE slug = 'workshops';
    IF workshop_category_id IS NULL THEN
        RAISE EXCEPTION 'Workshops category not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO olympiad_category_id FROM event_categories WHERE slug = 'olympiads';
    IF olympiad_category_id IS NULL THEN
        RAISE EXCEPTION 'Olympiads category not found. This should have been created earlier in this script.';
    END IF;
    
    SELECT id INTO science_fair_category_id FROM event_categories WHERE slug = 'science-fairs';
    IF science_fair_category_id IS NULL THEN
        RAISE EXCEPTION 'Science Fairs category not found. This should have been created earlier in this script.';
    END IF;
    
    -- Get tag IDs (with error handling)
    SELECT id INTO mathematics_tag_id FROM tags WHERE slug = 'mathematics';
    IF mathematics_tag_id IS NULL THEN
        RAISE EXCEPTION 'Mathematics tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO physics_tag_id FROM tags WHERE slug = 'physics';
    IF physics_tag_id IS NULL THEN
        RAISE EXCEPTION 'Physics tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO chemistry_tag_id FROM tags WHERE slug = 'chemistry';
    IF chemistry_tag_id IS NULL THEN
        RAISE EXCEPTION 'Chemistry tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO biology_tag_id FROM tags WHERE slug = 'biology';
    IF biology_tag_id IS NULL THEN
        RAISE EXCEPTION 'Biology tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO computer_science_tag_id FROM tags WHERE slug = 'computer-science';
    IF computer_science_tag_id IS NULL THEN
        RAISE EXCEPTION 'Computer Science tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO astronomy_tag_id FROM tags WHERE slug = 'astronomy';
    IF astronomy_tag_id IS NULL THEN
        RAISE EXCEPTION 'Astronomy tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO geography_tag_id FROM tags WHERE slug = 'geography';
    IF geography_tag_id IS NULL THEN
        RAISE EXCEPTION 'Geography tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO linguistics_tag_id FROM tags WHERE slug = 'linguistics';
    IF linguistics_tag_id IS NULL THEN
        RAISE EXCEPTION 'Linguistics tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO economics_tag_id FROM tags WHERE slug = 'economics';
    IF economics_tag_id IS NULL THEN
        RAISE EXCEPTION 'Economics tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO robotics_tag_id FROM tags WHERE slug = 'robotics';
    IF robotics_tag_id IS NULL THEN
        RAISE EXCEPTION 'Robotics tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO philosophy_tag_id FROM tags WHERE slug = 'philosophy';
    IF philosophy_tag_id IS NULL THEN
        RAISE EXCEPTION 'Philosophy tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO engineering_tag_id FROM tags WHERE slug = 'engineering';
    IF engineering_tag_id IS NULL THEN
        RAISE EXCEPTION 'Engineering tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO international_tag_id FROM tags WHERE slug = 'international';
    IF international_tag_id IS NULL THEN
        RAISE EXCEPTION 'International tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO national_tag_id FROM tags WHERE slug = 'national';
    IF national_tag_id IS NULL THEN
        RAISE EXCEPTION 'National tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO european_tag_id FROM tags WHERE slug = 'european';
    IF european_tag_id IS NULL THEN
        RAISE EXCEPTION 'European tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO swiss_tag_id FROM tags WHERE slug = 'swiss';
    IF swiss_tag_id IS NULL THEN
        RAISE EXCEPTION 'Swiss tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO high_school_tag_id FROM tags WHERE slug = 'high-school';
    IF high_school_tag_id IS NULL THEN
        RAISE EXCEPTION 'High School tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO university_tag_id FROM tags WHERE slug = 'university';
    IF university_tag_id IS NULL THEN
        RAISE EXCEPTION 'University tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO all_ages_tag_id FROM tags WHERE slug = 'all-ages';
    IF all_ages_tag_id IS NULL THEN
        RAISE EXCEPTION 'All Ages tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO stem_tag_id FROM tags WHERE slug = 'tech';
    IF stem_tag_id IS NULL THEN
        RAISE EXCEPTION 'Tech tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;
    
    SELECT id INTO sustainability_tag_id FROM tags WHERE slug = 'innovation';
    IF sustainability_tag_id IS NULL THEN
        RAISE EXCEPTION 'Innovation tag not found. Please run 02_insert_seed_data.sql first.';
    END IF;

    -- =====================================================
    -- SCIENCE FAIRS AND CONTESTS
    -- =====================================================
    
    -- ISEF - International Science and Engineering Fair
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'ISEF - International Science and Engineering Fair',
        'The world''s largest international pre-college science competition. Students from around the world compete for scholarships, tuition grants, internships, scientific field trips and the grand prize of $75,000.',
        'World''s largest international pre-college science competition',
        science_fair_category_id,
        'STEM',
        13,
        18,
        'USA',
        '2024-05-12',
        '09:00:00',
        'Los Angeles, California, USA',
        false,
        true,
        true,
        'published',
        'Society for Science',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    -- Link to tags
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, stem_tag_id),
        (event_id, international_tag_id),
        (event_id, high_school_tag_id);

    -- EUCYS - EU Contest for Young Scientists
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'EUCYS - EU Contest for Young Scientists',
        'The European Union Contest for Young Scientists (EUCYS) is a European Commission initiative that aims to promote the ideals of cooperation and interchange between young scientists.',
        'European competition for young scientists',
        science_fair_category_id,
        'humanities, social sciences, STEM',
        15,
        18,
        'EU',
        '2024-09-15',
        '09:00:00',
        'Brussels, Belgium',
        false,
        true,
        true,
        'published',
        'European Commission',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, stem_tag_id),
        (event_id, european_tag_id),
        (event_id, high_school_tag_id);

    -- SJf - National Contest (Swiss)
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'SJf - National Contest',
        'Swiss National Science Competition for young researchers. Students present their research projects and compete for recognition and prizes.',
        'Swiss national science competition',
        science_fair_category_id,
        'humanities, social sciences, STEM',
        15,
        23,
        'CH',
        '2024-04-20',
        '09:00:00',
        'Zurich, Switzerland',
        false,
        true,
        true,
        'published',
        'Schweizer Jugend forscht',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, stem_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- =====================================================
    -- MATHEMATICS OLYMPIADS
    -- =====================================================
    
    -- SMO - Swiss Mathematical Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'SMO - Swiss Mathematical Olympiad',
        'The Swiss Mathematical Olympiad is a competition for high school students interested in mathematics. It consists of several rounds leading to the national final.',
        'Swiss national mathematics competition',
        olympiad_category_id,
        'maths',
        15,
        20,
        'CH',
        '2024-03-15',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Mathematical Society',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, mathematics_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- IMO - International Mathematical Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'IMO - International Mathematical Olympiad',
        'The International Mathematical Olympiad (IMO) is the World Championship Mathematics Competition for High School students and is held annually in a different country.',
        'World championship mathematics competition',
        olympiad_category_id,
        'maths',
        15,
        20,
        'international',
        '2024-07-11',
        '09:00:00',
        'Bath, United Kingdom',
        false,
        true,
        true,
        'published',
        'International Mathematical Olympiad Foundation',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, mathematics_tag_id),
        (event_id, international_tag_id),
        (event_id, high_school_tag_id);

    -- =====================================================
    -- PHYSICS OLYMPIADS
    -- =====================================================
    
    -- SPhO - Swiss Physics Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'SPhO - Swiss Physics Olympiad',
        'The Swiss Physics Olympiad is a competition for high school students interested in physics. It includes theoretical and experimental rounds.',
        'Swiss national physics competition',
        olympiad_category_id,
        'physics',
        15,
        20,
        'CH',
        '2024-03-22',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Physical Society',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, physics_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- IPhO - International Physics Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'IPhO - International Physics Olympiad',
        'The International Physics Olympiad (IPhO) is an annual physics competition for high school students. It is one of the International Science Olympiads.',
        'International physics competition for high school students',
        olympiad_category_id,
        'physics',
        15,
        20,
        'international',
        '2024-07-21',
        '09:00:00',
        'Tehran, Iran',
        false,
        true,
        true,
        'published',
        'International Physics Olympiad Committee',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, physics_tag_id),
        (event_id, international_tag_id),
        (event_id, high_school_tag_id);

    -- =====================================================
    -- BIOLOGY OLYMPIADS
    -- =====================================================
    
    -- SBO - Swiss Biology Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'SBO - Swiss Biology Olympiad',
        'The Swiss Biology Olympiad is a competition for high school students interested in biology. It includes theoretical and practical examinations.',
        'Swiss national biology competition',
        olympiad_category_id,
        'biology',
        15,
        20,
        'CH',
        '2024-03-29',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Society for Biology',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, biology_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- IBO - International Biology Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'IBO - International Biology Olympiad',
        'The International Biology Olympiad (IBO) is a competition for high school students. It is one of the most prestigious biology competitions worldwide.',
        'International biology competition for high school students',
        olympiad_category_id,
        'biology',
        15,
        20,
        'international',
        '2024-07-07',
        '09:00:00',
        'Astana, Kazakhstan',
        false,
        true,
        true,
        'published',
        'International Biology Olympiad Committee',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, biology_tag_id),
        (event_id, international_tag_id),
        (event_id, high_school_tag_id);

    -- =====================================================
    -- COMPUTER SCIENCE OLYMPIADS
    -- =====================================================
    
    -- SOI - Swiss Olympiad in Informatics
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'SOI - Swiss Olympiad in Informatics',
        'The Swiss Olympiad in Informatics is a programming competition for high school students. It tests algorithmic thinking and programming skills.',
        'Swiss national programming competition',
        olympiad_category_id,
        'computer science',
        15,
        20,
        'CH',
        '2024-04-05',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Olympiad in Informatics',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, computer_science_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- IOI - International Olympiad in Informatics
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'IOI - International Olympiad in Informatics',
        'The International Olympiad in Informatics (IOI) is an annual competitive programming competition for secondary school students.',
        'International programming competition for high school students',
        olympiad_category_id,
        'computer science',
        15,
        20,
        'international',
        '2024-09-01',
        '09:00:00',
        'Alexandria, Egypt',
        false,
        true,
        true,
        'published',
        'International Olympiad in Informatics Committee',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, computer_science_tag_id),
        (event_id, international_tag_id),
        (event_id, high_school_tag_id);

    -- =====================================================
    -- CHEMISTRY OLYMPIADS
    -- =====================================================
    
    -- SChO - Swiss Chemistry Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'SChO - Swiss Chemistry Olympiad',
        'The Swiss Chemistry Olympiad is a competition for high school students interested in chemistry. It includes theoretical and practical examinations.',
        'Swiss national chemistry competition',
        olympiad_category_id,
        'chemistry',
        15,
        20,
        'CH',
        '2024-04-12',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Chemical Society',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, chemistry_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- IChO - International Chemistry Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'IChO - International Chemistry Olympiad',
        'The International Chemistry Olympiad (IChO) is an annual competition for the world''s most talented chemistry students at secondary school level.',
        'International chemistry competition for high school students',
        olympiad_category_id,
        'chemistry',
        15,
        20,
        'international',
        '2024-07-22',
        '09:00:00',
        'Riyadh, Saudi Arabia',
        false,
        true,
        true,
        'published',
        'International Chemistry Olympiad Committee',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, chemistry_tag_id),
        (event_id, international_tag_id),
        (event_id, high_school_tag_id);

    -- =====================================================
    -- OTHER OLYMPIADS
    -- =====================================================
    
    -- Swiss Geography Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'Swiss Geography Olympiad',
        'The Swiss Geography Olympiad is a competition for high school students interested in geography. It tests knowledge of physical and human geography.',
        'Swiss national geography competition',
        olympiad_category_id,
        'geography',
        15,
        20,
        'CH',
        '2024-04-19',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Geography Society',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, geography_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- Swiss Linguistics Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'Swiss Linguistics Olympiad',
        'The Swiss Linguistics Olympiad is a competition for high school students interested in linguistics. It tests analytical thinking and problem-solving skills.',
        'Swiss national linguistics competition',
        olympiad_category_id,
        'linguistics',
        15,
        20,
        'CH',
        '2024-04-26',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Linguistics Society',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, linguistics_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- Swiss Economics Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'Swiss Economics Olympiad',
        'The Swiss Economics Olympiad is a competition for high school students interested in economics. It tests understanding of economic concepts and analysis.',
        'Swiss national economics competition',
        olympiad_category_id,
        'economics',
        15,
        20,
        'CH',
        '2024-05-03',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Economics Society',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, economics_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- Swiss Robotics Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'Swiss Robotics Olympiad',
        'The Swiss Robotics Olympiad is a competition for students aged 6-19 interested in robotics. It includes building and programming robots to solve challenges.',
        'Swiss national robotics competition for all ages',
        olympiad_category_id,
        'robotics',
        6,
        19,
        'CH',
        '2024-05-10',
        '09:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Robotics Society',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, robotics_tag_id),
        (event_id, swiss_tag_id),
        (event_id, all_ages_tag_id);

    -- Philosophy Olympiad
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'Philosophy Olympiad',
        'The Philosophy Olympiad is a competition for high school students interested in philosophy. It tests critical thinking and philosophical reasoning skills.',
        'Swiss national philosophy competition',
        olympiad_category_id,
        'philosophy',
        15,
        20,
        'CH',
        '2024-05-17',
        '14:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'Swiss Philosophy Society',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, philosophy_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- =====================================================
    -- HACKATHONS
    -- =====================================================
    
    -- START Hack
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'START Hack',
        'START Hack is Switzerland''s biggest student hackathon. Students from all over Europe come together to build innovative solutions in 36 hours.',
        'Switzerland''s biggest student hackathon',
        hackathon_category_id,
        'CS, AI, entrepreneurship',
        18,
        29,
        'SG',
        '2024-03-16',
        '18:00:00',
        'St. Gallen, Switzerland',
        false,
        true,
        true,
        'published',
        'START Global',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, computer_science_tag_id),
        (event_id, swiss_tag_id),
        (event_id, university_tag_id);

    -- NASA Space Apps Challenge
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'NASA Space Apps Challenge',
        'NASA Space Apps Challenge is an international hackathon for coders, scientists, designers, storytellers, makers, builders, and technologists. Teams use NASA data to create solutions to challenges we face on Earth and in space.',
        'International NASA hackathon for space solutions',
        hackathon_category_id,
        'STEM, sustainability',
        13,
        30,
        'CH',
        '2024-10-05',
        '09:00:00',
        'Various locations, Switzerland',
        false,
        true,
        true,
        'published',
        'NASA',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, stem_tag_id),
        (event_id, sustainability_tag_id),
        (event_id, international_tag_id),
        (event_id, all_ages_tag_id);

    -- =====================================================
    -- WORKSHOPS
    -- =====================================================
    
    -- CERN-Solvay student camp
    INSERT INTO events (
        id, title, description, short_description, category_id, field, min_age, max_age, region,
        date, time, location, is_virtual, registration_required, is_free, status, organizer_name,
        is_featured, is_verified, published_at
    ) VALUES (
        uuid_generate_v4(),
        'CERN-Solvay student camp',
        'A unique opportunity for students to visit CERN and learn about particle physics, accelerators, and the fundamental questions of the universe. Includes lectures, lab visits, and hands-on activities.',
        'CERN student camp for physics enthusiasts',
        workshop_category_id,
        'STEM',
        16,
        25,
        'GE',
        '2024-07-15',
        '09:00:00',
        'CERN, Geneva, Switzerland',
        false,
        true,
        true,
        'published',
        'CERN & Solvay',
        true,
        true,
        NOW()
    ) RETURNING id INTO event_id;
    
    INSERT INTO event_tags (event_id, tag_id) VALUES
        (event_id, stem_tag_id),
        (event_id, physics_tag_id),
        (event_id, swiss_tag_id),
        (event_id, high_school_tag_id);

    -- Update tag usage counts
    UPDATE tags SET usage_count = (
        SELECT COUNT(*) FROM event_tags WHERE tag_id = tags.id
    );

END $$;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE events IS 'Real academic competitions, olympiads, hackathons, and workshops based on actual opportunities';
