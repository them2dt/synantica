-- =====================================================
-- Add Age Fields to User Profiles
-- =====================================================
-- This migration adds birth year and date of birth fields
-- to support age-based event filtering and eligibility
-- =====================================================

-- Add age-related columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN birth_year INTEGER,
ADD COLUMN date_of_birth DATE;

-- Add indexes for better query performance
CREATE INDEX idx_user_profiles_birth_year ON user_profiles(birth_year);
CREATE INDEX idx_user_profiles_date_of_birth ON user_profiles(date_of_birth);

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.birth_year IS 'Year of birth for age calculations and event eligibility';
COMMENT ON COLUMN user_profiles.date_of_birth IS 'Full date of birth for precise age calculations';

-- Add constraint to ensure birth year is reasonable (between 1900 and current year + 1)
ALTER TABLE user_profiles 
ADD CONSTRAINT check_birth_year_range 
CHECK (birth_year IS NULL OR (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1));

-- Add constraint to ensure date of birth is reasonable (not in future, not too far in past)
ALTER TABLE user_profiles 
ADD CONSTRAINT check_date_of_birth_range 
CHECK (date_of_birth IS NULL OR (date_of_birth <= CURRENT_DATE AND date_of_birth >= '1900-01-01'));
