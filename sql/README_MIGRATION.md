# Database Migration: Simplified Event Schema

## Overview

This migration transforms the complex event schema into a clean, simplified structure that matches the new TypeScript interfaces.

## Key Changes

### 1. Simplified Event Structure

**Before (Complex):**
- 25+ fields including complex multi-day support
- Separate category and tag systems
- Complex pricing and registration logic
- Analytics fields not implemented

**After (Simplified):**
- 15 essential fields
- Single type field + fields array
- Simple date range (from_date, to_date)
- Clean JSONB arrays for links and fields

### 2. Table Changes

| Old Table | New Table | Purpose |
|-----------|-----------|---------|
| `event_categories` | `event_types` | Event categorization |
| `tags` | `event_fields` | Event topics/fields |
| `event_tags` | `event_field_assignments` | Many-to-many relationships |
| `events` | `events` | Simplified event structure |

### 3. Field Mappings

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `title` | `name` | Simplified naming |
| `date` | `from_date` | Start of event |
| `end_date` | `to_date` | End of event |
| `min_age` | `from_age` | Age range start |
| `max_age` | `to_age` | Age range end |
| `category` | `type` | Event type |
| `tags` | `fields` | Event fields/topics |
| `region` | `country` | Geographic location |
| `external_links` | `links` | External URLs |
| `youtube_videos[0]` | `youtube_link` | Single YouTube link |

### 4. Removed Fields

- `short_description`
- `venue_details`
- `is_virtual`, `virtual_link`
- `registration_required`, `registration_deadline`
- `is_free`, `price`, `currency`
- `is_featured`, `is_verified`
- `requirements`, `prizes`
- `support_pdfs`, `organization_homepage`
- `alumni_contact_email`
- `view_count`, `registration_count`
- `published_at`
- Complex multi-day fields (`isMultiDay`, `duration`, `recurringPattern`, `eventSchedule`)

## Migration Steps

### 1. Run Migration Script
```sql
-- Execute the migration script
\i 00_migrate_to_simplified_schema.sql
```

### 2. Verify Migration
```sql
-- Check data integrity
SELECT 'Events migrated' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'Event types migrated', COUNT(*) FROM event_types
UNION ALL
SELECT 'Event fields migrated', COUNT(*) FROM event_fields;
```

### 3. Update Application Code
- Update TypeScript interfaces
- Update database queries
- Update UI components
- Test all functionality

## New Schema Benefits

### 1. **Simplified Queries**
```sql
-- Old complex query
SELECT e.*, ec.name as category, array_agg(t.name) as tags
FROM events e
LEFT JOIN event_categories ec ON e.category_id = ec.id
LEFT JOIN event_tags et ON e.id = et.event_id
LEFT JOIN tags t ON et.tag_id = t.id
GROUP BY e.id, ec.name;

-- New simple query
SELECT * FROM events WHERE type = 'hackathon' AND fields @> '["Technology"]';
```

### 2. **Better Performance**
- Fewer JOINs required
- Smaller payload sizes
- Faster queries
- Reduced complexity

### 3. **Easier Maintenance**
- Less code to maintain
- Clearer data structure
- Simplified forms
- Better developer experience

## Rollback Plan

If rollback is needed:

1. **Restore from backup tables:**
```sql
-- Restore original tables
CREATE TABLE events AS SELECT * FROM events_backup;
CREATE TABLE event_categories AS SELECT * FROM event_categories_backup;
CREATE TABLE tags AS SELECT * FROM tags_backup;
CREATE TABLE event_tags AS SELECT * FROM event_tags_backup;
```

2. **Recreate constraints and indexes**
3. **Update application code to old schema**

## Testing Checklist

- [ ] All events migrated correctly
- [ ] Event types and fields populated
- [ ] Foreign key constraints working
- [ ] RLS policies updated
- [ ] Database functions working
- [ ] Application queries updated
- [ ] UI components displaying correctly
- [ ] Search functionality working
- [ ] Filtering by type and fields working
- [ ] Event creation/editing working

## Post-Migration Tasks

1. **Update Application Code**
   - Update all database queries
   - Update TypeScript interfaces
   - Update UI components
   - Update forms

2. **Test Functionality**
   - Event listing and filtering
   - Event creation and editing
   - Search functionality
   - User registrations
   - Event reviews

3. **Performance Monitoring**
   - Monitor query performance
   - Check for any slow queries
   - Optimize if needed

4. **Cleanup**
   - Remove backup tables after verification
   - Update documentation
   - Train team on new schema

## Support

If you encounter issues during migration:

1. Check the migration logs
2. Verify data integrity
3. Test with a small dataset first
4. Contact the development team

---

**Migration Date:** $(date)
**Schema Version:** 2.0 (Simplified)
**Previous Version:** 1.0 (Complex)
