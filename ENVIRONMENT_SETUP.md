# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

### Supabase Configuration
```bash
# Get these from https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# Admin panel access control (comma-separated list of admin email addresses)
ADMIN_EMAILS=admin@yourdomain.com,admin2@yourdomain.com
# The following variable is required for the Vercel Postgres database, but can
# be ignored if you're using a different database provider.
POSTGRES_URL=your_postgres_database_url
# The following variable is required for local development to start a webhook
# listener that automatically updates your database when you change your SQL
# files. You can get this from your Supabase project's API settings.
SUPABASE_DB_PASSWORD=your_supabase_db_password
```

```

### Optional Variables
```bash
# NextAuth.js (if using authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Database URL for direct database access
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.YOUR_PROJECT.supabase.co:5432/postgres

# Email configuration
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-smtp-password
```

## How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
   - **Database Password** → `SUPABASE_DB_PASSWORD`
   - **Connection string** → `POSTGRES_URL`
     - **Important**: Make sure you get the connection string that starts with `postgresql://` and not `postgres://`. Also, make sure to replace the `[YOUR-PASSWORD]` placeholder with your actual database password.


## Testing Environment Setup

Once you've set up the environment variables:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Check the navigation:** The auth buttons should now be visible and functional

3. **Test authentication:** Try signing up and signing in

## Troubleshooting

### Auth buttons still not visible?
- Make sure `.env.local` is in the project root
- Restart the development server after adding environment variables
- Check that the variable names match exactly (case-sensitive)

### Authentication not working?
- Verify Supabase project is active
- Check that the anon key has the correct permissions
- Ensure your domain is whitelisted in Supabase


## Admin Panel Configuration

The admin panel uses a separate Supabase client with elevated permissions:

### Service Role Key
The `SUPABASE_SERVICE_ROLE_KEY` is used for admin operations and:
- Bypasses Row Level Security (RLS) policies
- Has full database access
- Should only be used in server-side admin API routes
- **Never expose this key to the client-side**

### Admin Client Usage
The admin client is automatically used in:
- `/api/admin/events/*` routes
- All CRUD operations for events management
- Bypasses user authentication checks for database operations

### Security Notes
- Admin routes still check user authentication via the regular client
- Service role key is only used for database operations after auth verification
- Admin panel is protected by authentication middleware
