# 🚀 Supabase Integration Guide

This guide walks you through the complete integration of Supabase database with your Student Event Platform.

## ✅ What's Been Completed

### 1. **Database Service Layer**
- ✅ `lib/database/events.ts` - Server-side database functions
- ✅ `lib/database/events-client.ts` - Client-side database functions
- ✅ `lib/hooks/use-events.ts` - React hooks for data management

### 2. **Updated Components**
- ✅ Dashboard page now fetches real data from database
- ✅ Event detail pages use database queries
- ✅ Search and filtering implemented with database functions
- ✅ Loading states and error handling added

### 3. **Database Functions Used**
- ✅ `search_events()` - Advanced search with filters
- ✅ `get_popular_events()` - Popular events based on engagement
- ✅ `get_event_stats()` - Event statistics and analytics

## 🔧 Environment Setup

### 1. **Environment Variables**
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key

# Optional: Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. **Get Your Supabase Credentials**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key
4. Paste them into your `.env.local` file

## 🗄️ Database Setup

### 1. **Run Database Scripts**
Execute these SQL scripts in your Supabase SQL Editor in order:

```sql
-- 1. Drop existing tables (if needed)
\i 00_drop_all_tables.sql

-- 2. Create database schema
\i 01_create_tables.sql

-- 3. Insert base seed data
\i 02_insert_seed_data.sql

-- 4. Set up Row Level Security
\i 03_row_level_security.sql

-- 5. Add database functions
\i 04_database_functions.sql

-- 6. Insert real opportunity data
\i 02.1_insert_real_opportunity_data.sql
```

### 2. **Verify Setup**
Check that these tables exist in your Supabase dashboard:
- `events`
- `event_categories`
- `tags`
- `event_tags`
- `user_profiles`
- `user_settings`

## 🎯 Key Features Now Working

### **Dashboard**
- ✅ Real events from database
- ✅ Dynamic categories from database
- ✅ Search functionality with database queries
- ✅ Filtering by category, age, region, field
- ✅ Loading states and error handling

### **Event Details**
- ✅ Individual event pages with real data
- ✅ Event resources (PDFs, links, videos)
- ✅ Alumni contact information
- ✅ Registration links
- ✅ Proper error handling for missing events

### **Search & Filtering**
- ✅ Full-text search across titles and descriptions
- ✅ Category filtering
- ✅ Age range filtering
- ✅ Region filtering
- ✅ Field/subject filtering
- ✅ Date range filtering

## 🔍 Testing the Integration

### 1. **Start Your Development Server**
```bash
npm run dev
```

### 2. **Test Dashboard**
- Visit `/dashboard`
- You should see real events from your database
- Try searching and filtering
- Check loading states

### 3. **Test Event Details**
- Click on any event from the dashboard
- Verify all event information displays correctly
- Check that resources and links work

### 4. **Test Error Handling**
- Try visiting `/events/invalid-id`
- Should show proper error message

## 🐛 Troubleshooting

### **Common Issues**

1. **"Failed to fetch events" Error**
   - Check your environment variables
   - Verify Supabase URL and key are correct
   - Ensure database scripts were run successfully

2. **Empty Dashboard**
   - Run the seed data scripts
   - Check that events have `status = 'published'`
   - Verify RLS policies allow public access

3. **TypeScript Errors**
   - Run `npm run build` to check for type errors
   - Update types if needed

4. **Database Connection Issues**
   - Check Supabase project status
   - Verify network connectivity
   - Check browser console for detailed errors

### **Debug Steps**

1. **Check Browser Console**
   - Look for network errors
   - Check for JavaScript errors

2. **Check Supabase Logs**
   - Go to Supabase dashboard → Logs
   - Look for database query errors

3. **Test Database Functions**
   - Run `search_events()` function directly in Supabase SQL Editor
   - Verify it returns data

## 🚀 Next Steps

### **Immediate**
1. Test all functionality thoroughly
2. Fix any remaining issues
3. Deploy to production

### **Future Enhancements**
1. Add user authentication
2. Implement event registration
3. Add user reviews and ratings
4. Create admin dashboard
5. Add real-time updates
6. Implement caching for better performance

## 📊 Database Schema Overview

Your database now includes:
- **25+ real academic competitions** (Olympiads, Science Fairs, Hackathons)
- **14 event categories** with proper icons and colors
- **25+ tags** for flexible filtering
- **Advanced search functions** with full-text search
- **Analytics functions** for popular events and statistics
- **Row Level Security** for data protection

## 🎉 Success!

Your Student Event Platform is now fully integrated with Supabase! You have:
- Real data instead of mock data
- Advanced search and filtering
- Proper error handling
- Loading states
- Scalable database architecture

The platform is ready for production use with real academic competitions and opportunities!
