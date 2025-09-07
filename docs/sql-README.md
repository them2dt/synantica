# Student Event Platform - Database Setup

This directory contains SQL scripts to set up the complete database structure for the Student Event Platform.

## 📁 Files Overview

### 1. `01_create_tables.sql`
Creates all database tables, indexes, and triggers based on the TypeScript types and UX requirements.

**Key Features:**
- **User Management**: Extended user profiles, settings, and role-based access control
- **Event System**: Comprehensive event data with categories, tags, and resources
- **Registration System**: Event registrations with status tracking
- **Review System**: User reviews and ratings for events
- **Analytics**: Built-in tracking for views, registrations, and engagement
- **Performance**: Optimized indexes for fast queries

### 2. `02_insert_seed_data.sql`
Inserts initial data to get started with the platform.

**Includes:**
- **Event Categories**: Hackathon, Workshop, Seminar, Conference, etc.
- **Tags**: Technology, Business, Academic, and General tags
- **Sample Events**: 6 diverse events showcasing different categories and features
- **Tag Relationships**: Proper many-to-many relationships between events and tags

### 3. `03_row_level_security.sql`
Sets up Row Level Security (RLS) policies for data protection and access control.

**Security Features:**
- **User Privacy**: Users can only access their own data
- **Role-Based Access**: Different permissions for students, organizers, and admins
- **Public Data**: Published events and public reviews are accessible to all
- **Admin Controls**: Admins can manage all data and user roles

### 4. `04_database_functions.sql`
Creates useful database functions for common operations and analytics.

**Function Categories:**
- **Event Analytics**: Statistics, popular events, search functionality
- **User Analytics**: Event history, personalized recommendations
- **Data Maintenance**: Automatic updates, cleanup procedures
- **Notifications**: User targeting for event notifications

## 🚀 Quick Setup

### Prerequisites
- PostgreSQL 13+ with UUID extension
- Supabase project (recommended) or standalone PostgreSQL

### Installation Steps

1. **Create Tables**
   ```sql
   \i 01_create_tables.sql
   ```

2. **Insert Seed Data**
   ```sql
   \i 02_insert_seed_data.sql
   ```

3. **Set Up Security**
   ```sql
   \i 03_row_level_security.sql
   ```

4. **Add Functions**
   ```sql
   \i 04_database_functions.sql
   ```

### For Supabase Users

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each script in order
4. Verify tables are created in the Table Editor

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `user_profiles` | Extended user data | Academic info, social links, bio |
| `user_settings` | User preferences | Theme, notifications, privacy |
| `user_role_assignments` | Role-based access | Student, Organizer, Admin roles |
| `events` | Event information | Full event data with resources |
| `event_categories` | Event categorization | Predefined categories with metadata |
| `tags` | Flexible tagging | User-defined tags with usage tracking |
| `event_registrations` | Registration tracking | Status, payment, special needs |
| `event_reviews` | User feedback | Ratings, comments, verification |

### Key Relationships

- **Users** → **Events** (One-to-Many via `organizer_id`)
- **Events** → **Categories** (Many-to-One)
- **Events** → **Tags** (Many-to-Many via `event_tags`)
- **Users** → **Registrations** (One-to-Many)
- **Events** → **Registrations** (One-to-Many)
- **Users** → **Reviews** (One-to-Many)
- **Events** → **Reviews** (One-to-Many)

## 🔧 Key Features

### Event Management
- **Rich Event Data**: Title, description, dates, location, requirements, prizes
- **Resource Links**: PDFs, organization homepage, YouTube videos
- **Registration System**: External links, alumni contact, requirements
- **Status Tracking**: Draft, Published, Cancelled, Completed

### User Experience
- **Personalization**: User interests, recommendations, event history
- **Search & Filter**: Full-text search, category/subject filters, date ranges
- **Reviews & Ratings**: User feedback system with verification
- **Notifications**: Event reminders and recommendations

### Analytics & Insights
- **Event Statistics**: Registration counts, view counts, ratings
- **Popular Events**: Trending events based on engagement
- **User Behavior**: Event history, interests, recommendations
- **Performance Tracking**: Automatic counters and statistics

### Security & Privacy
- **Row Level Security**: Data access control at the database level
- **Role-Based Access**: Different permissions for different user types
- **Data Privacy**: Users can only access their own sensitive data
- **Public Data**: Events and reviews are publicly accessible when appropriate

## 🎯 MVP Features Supported

Based on `core-features.txt`, this database structure supports:

✅ **Event Overview**: Students can browse upcoming events  
✅ **3rd-Party Registration**: Events link to external registration systems  
✅ **Event Sharing**: Events can be shared via URLs  
✅ **Resource Access**: Google Drive links and other resources  
✅ **Search & Filter**: By category, date, subject  
✅ **Detailed Information**: Comprehensive event details  
✅ **User Registration**: Login system with preferences  
✅ **Theme Switching**: User theme preferences stored  

## 🔮 Future Extensibility

The database structure is designed to support future features:

- **Payment Integration**: Payment status and references in registrations
- **Advanced Analytics**: Detailed user behavior tracking
- **Notification System**: Email and push notification preferences
- **Multi-language Support**: Internationalization ready
- **API Integration**: External service integrations
- **Mobile App**: Mobile-specific features and data

## 📝 Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- UUIDs are used for all primary keys for better scalability
- JSONB is used for flexible data like requirements, prizes, and resources
- Full-text search is enabled for event titles and descriptions
- Automatic triggers maintain data consistency and performance
- Row Level Security ensures data privacy and access control

## 🆘 Troubleshooting

### Common Issues

1. **UUID Extension Missing**
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. **Permission Errors**
   - Ensure RLS policies are properly set up
   - Check user role assignments
   - Verify Supabase auth integration

3. **Performance Issues**
   - Check that indexes are created
   - Monitor query performance
   - Consider additional indexes for specific use cases

### Support

For issues or questions about the database structure, refer to:
- TypeScript types in `/types/` directory
- Component usage in `/components/` directory
- Core features in `core-features.txt`
