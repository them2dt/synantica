# Admin Components

This directory contains the admin panel components for managing events in the Student Event Platform.

## Components

### EventsTable
A simple, clean table component for displaying and managing events in the admin panel.

**Features:**
- ✅ Search/filter events by name, description, organizer, location, or country
- ✅ Row-click to edit events (opens modal)
- ✅ Bulk selection and deletion
- ✅ Create new events
- ✅ Individual delete buttons
- ✅ Status and type badges with color coding
- ✅ Responsive design

**Usage:**
```tsx
import { EventsTable } from '@/components/admin'

<EventsTable
  events={events}
  onAddEvent={handleAddEvent}
  onUpdateEvent={handleUpdateEvent}
  onDeleteEvent={handleDeleteEvent}
/>
```

### EventEditModal
A comprehensive modal form for editing/creating events with all Event properties.

**Features:**
- ✅ All Event properties from `types/event.ts`
- ✅ Rich form fields (text, textarea, date, number, select)
- ✅ Array management for `fields` and `links`
- ✅ Quick-add buttons for common fields/subjects
- ✅ Validation for required fields
- ✅ Create and Edit modes
- ✅ Responsive layout

**Event Properties Supported:**
1. **Basic Information**
   - name (required)
   - description (required)
   - type (required) - dropdown: olympiads, contests, events, workshops
   - status (required) - dropdown: draft, published, cancelled

2. **Date & Location**
   - fromDate (required)
   - toDate (required)
   - location (required)
   - country (required)

3. **Organizer & Target Audience**
   - organizer (required)
   - fromAge (optional)
   - toAge (optional)

4. **Fields/Subjects**
   - fields (array) - quick-add buttons + custom input
   - Common fields: computer-science, business, engineering, design, marketing, data-science, AI, etc.

5. **Links & Media**
   - youtubeLink (optional)
   - links (array) - add/remove external links

**Usage:**
```tsx
import { EventEditModal } from '@/components/admin'

<EventEditModal
  event={selectedEvent}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleSave}
  mode="edit" // or "create"
/>
```

## Admin Page

Located at `/app/admin/page.tsx`, the admin page provides the main interface for event management.

**Route:** `/admin`

**Features:**
- Protected route (requires admin authentication)
- Fetches all events via `/api/admin/events`
- CRUD operations via admin API routes
- Loading and error states
- Real-time updates after operations

## API Routes

### GET `/api/admin/events`
Fetches all events (admin only)

### POST `/api/admin/events`
Creates a new event (admin only)

### GET `/api/admin/events/[id]`
Fetches a single event by ID (admin only)

### PUT `/api/admin/events/[id]`
Updates an event (admin only)

### DELETE `/api/admin/events/[id]`
Deletes an event (admin only)

## Database Schema Alignment

The admin panel is **100% aligned** with the Event interface defined in `types/event.ts`:

```typescript
interface Event {
  id: string
  name: string
  description: string
  fromDate: string
  toDate: string
  location: string
  country: string
  organizer: string
  fromAge?: number
  toAge?: number
  youtubeLink?: string
  links: string[]
  type: string
  fields: string[]
  status: EventStatus
  createdAt: string
  updatedAt: string
}
```

All fields are properly handled in the modal form and API routes.

## Security

- Admin routes protected by middleware
- `isAdminUser()` check in all API routes

## Styling

- Uses shadcn/ui components for consistency
- Tailwind CSS for styling
- Color-coded badges for status and type

## Future Improvements

- [ ] Add pagination for large event lists
- [ ] Add advanced filtering (date range, multi-select)
- [ ] Add export functionality (CSV/Excel)
- [ ] Add event duplication feature
- [ ] Add bulk edit capabilities
- [ ] Add activity/audit log
- [ ] Add image upload for events
- [ ] Add rich text editor for descriptions
