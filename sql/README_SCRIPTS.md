# SQL Scripts Overview - Simplified Schema

## 📋 **Script Execution Order**

Execute these scripts in the following order for a fresh setup:

### **1. Fresh Database Setup**
```sql
-- 1. Drop all existing tables (if any)
\i 00_drop_all_tables.sql

-- 2. Create new simplified schema
\i 01_create_tables.sql

-- 3. Insert seed data
\i 02_insert_seed_data.sql

-- 4. Set up Row Level Security
\i 03_row_level_security.sql

-- 5. Create database functions
\i 04_database_functions.sql

-- 6. Fix RLS policies (if needed)
\i 05_fix_rls_policies.sql

-- 7. Add performance indexes
\i 06_performance_indexes.sql

-- 8. Add user age fields (optional)
\i 07_add_user_age_fields.sql
```

### **2. Migration from Old Schema**
```sql
-- If migrating from old complex schema
\i 00_migrate_to_simplified_schema.sql
```

## 📁 **Script Descriptions**

| Script | Purpose | Status |
|--------|---------|--------|
| `00_drop_all_tables.sql` | Drop all tables for fresh start | ✅ Updated |
| `00_migrate_to_simplified_schema.sql` | Migrate from old to new schema | ✅ New |
| `01_create_tables.sql` | Create simplified database schema | ✅ Updated |
| `02_insert_seed_data.sql` | Insert sample data | ✅ Updated |
| `03_row_level_security.sql` | Set up RLS policies | ✅ Updated |
| `04_database_functions.sql` | Create database functions | ✅ Updated |
| `05_fix_rls_policies.sql` | Fix RLS issues for sign-up | ✅ Updated |
| `06_performance_indexes.sql` | Add performance indexes | ✅ Updated |
| `07_add_user_age_fields.sql` | Add user age fields | ✅ Keep as-is |
| `README_MIGRATION.md` | Migration documentation | ✅ New |

## 🔄 **Key Changes Made**

### **Updated Scripts**
- **`00_drop_all_tables.sql`** - Updated table names for new schema
- **`01_create_tables.sql`** - Completely rewritten with simplified structure
- **`02_insert_seed_data.sql`** - Updated with new field names and structure
- **`03_row_level_security.sql`** - Updated policies for new tables
- **`04_database_functions.sql`** - Simplified functions for new schema
- **`05_fix_rls_policies.sql`** - Updated for new table names
- **`06_performance_indexes.sql`** - Updated indexes for new field names

### **New Scripts**
- **`00_migrate_to_simplified_schema.sql`** - Migration from old to new schema
- **`README_MIGRATION.md`** - Complete migration documentation

### **Removed Scripts**
- `fix_signup_issues.sql` - Functionality integrated into main RLS policies
- `02.1_insert_real_opportunity_data.sql` - Replaced with simplified seed data

## 🚀 **Quick Start**

### **For New Projects**
```bash
# Run all scripts in order
psql -d your_database -f 00_drop_all_tables.sql
psql -d your_database -f 01_create_tables.sql
psql -d your_database -f 02_insert_seed_data.sql
psql -d your_database -f 03_row_level_security.sql
psql -d your_database -f 04_database_functions.sql
psql -d your_database -f 05_fix_rls_policies.sql
psql -d your_database -f 06_performance_indexes.sql
psql -d your_database -f 07_add_user_age_fields.sql
```

### **For Existing Projects (Migration)**
```bash
# Run migration script
psql -d your_database -f 00_migrate_to_simplified_schema.sql
```

## ✅ **Verification**

After running the scripts, verify the setup:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check sample data
SELECT COUNT(*) as event_count FROM events;
SELECT COUNT(*) as type_count FROM event_types;
SELECT COUNT(*) as field_count FROM event_fields;

-- Test a query
SELECT name, type, from_date, to_date, country 
FROM events 
WHERE status = 'published' 
LIMIT 5;
```

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **Foreign Key Errors**
   - Run scripts in the correct order
   - Check that all referenced tables exist

2. **RLS Policy Errors**
   - Run `05_fix_rls_policies.sql` after the main setup
   - Check Supabase Auth configuration

3. **Permission Errors**
   - Ensure you're using the service role key
   - Check database permissions

4. **Migration Issues**
   - Backup your data before migration
   - Check the migration logs
   - Verify data integrity after migration

### **Rollback Plan**

If you need to rollback:

```sql
-- Restore from backup tables (if migration was used)
CREATE TABLE events AS SELECT * FROM events_backup;
-- ... restore other tables

-- Or start fresh
\i 00_drop_all_tables.sql
\i 01_create_tables.sql
-- ... continue with fresh setup
```

## 📊 **Schema Comparison**

| Old Schema | New Schema | Change |
|------------|------------|--------|
| `event_categories` | `event_types` | Renamed |
| `tags` | `event_fields` | Renamed |
| `event_tags` | `event_field_assignments` | Renamed |
| `title` | `name` | Simplified |
| `date`/`end_date` | `from_date`/`to_date` | Clearer naming |
| `min_age`/`max_age` | `from_age`/`to_age` | Consistent naming |
| `region` | `country` | More specific |
| `category` | `type` | Simplified |
| `tags` array | `fields` array | JSONB array |
| `external_links` | `links` | Simplified |

## 🎯 **Benefits of New Schema**

1. **Simplified Queries** - No complex JOINs needed
2. **Better Performance** - Smaller payloads, faster queries
3. **Easier Maintenance** - Less code, clearer structure
4. **Cleaner Data** - Only essential fields, no unused complexity
5. **Better Developer Experience** - Intuitive field names and structure

---

**Last Updated:** $(date)
**Schema Version:** 2.0 (Simplified)
**Compatible With:** TypeScript interfaces in `/types/event.ts`
