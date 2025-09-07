# Open Graph Image Generation

This Next.js application includes dynamic Open Graph (OG) image generation for social media previews. When your pages are shared on social platforms like Facebook, Twitter, LinkedIn, etc., they will display custom-generated preview images.

## Features

- **Dynamic Image Generation**: Creates unique OG images based on page content
- **Two Layout Types**: Default layout for general pages and specialized event layout
- **Branded Design**: Consistent with Synantica branding and color scheme
- **Edge Runtime**: Fast image generation using Vercel's Edge Runtime
- **TypeScript Support**: Fully typed utilities and components

## How It Works

### API Route
The `/api/og` route generates images dynamically using the `@vercel/og` package:

- **Default Layout**: For general pages with title, description, and feature highlights
- **Event Layout**: For event pages with event details, date, location, and category

### Utility Functions
Located in `lib/og-image.ts`:

- `generateOGImageUrl()`: Creates OG image URLs for general pages
- `generateEventOGImageUrl()`: Creates OG image URLs for event pages
- `generateMetadataWithOG()`: Generates complete metadata objects with OG images

## Usage

### For General Pages

```typescript
import { generateMetadataWithOG } from '@/lib/og-image';

export const metadata = generateMetadataWithOG(
  'Page Title',
  'Page description for social media'
);
```

### For Event Pages

```typescript
import { generateMetadataWithOG } from '@/lib/og-image';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await fetchEvent(params.id); // Your data fetching logic
  
  return generateMetadataWithOG(
    event.title,
    event.description,
    'event',
    {
      eventDate: event.date,
      location: event.location,
      category: event.category,
    }
  );
}
```

### Direct API Usage

You can also use the API directly:

```
/api/og?title=My%20Title&description=My%20Description
/api/og?type=event&title=Event%20Title&eventDate=March%2015&location=Venue&category=Hackathon
```

## Parameters

### General Pages
- `title` (required): Page title
- `description` (optional): Page description

### Event Pages
- `type=event` (required): Specifies event layout
- `title` (required): Event title
- `description` (optional): Event description
- `eventDate` (optional): Event date
- `location` (optional): Event location
- `category` (optional): Event category

## Testing

### Local Testing
1. Start the development server: `npm run dev`
2. Visit `/test-og` to see examples and test different layouts
3. Use social media testing tools:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Test URLs
- Default: `http://localhost:3000/api/og?title=Test&description=Testing`
- Event: `http://localhost:3000/api/og?type=event&title=HackTech%202024&description=Join%20us&eventDate=March%2015&location=CS%20Building&category=Hackathon`

## Customization

### Styling
The OG images use a dark theme with blue accents matching your brand. To customize:

1. Edit the JSX in `/app/api/og/route.tsx`
2. Modify colors, fonts, and layout as needed
3. The images are 1200x630 pixels (standard OG image size)

### Adding New Layouts
1. Add a new `type` parameter check in the API route
2. Create a new JSX layout component
3. Update the utility functions to support the new type

## Deployment

The OG image generation works on:
- **Vercel**: Full support with Edge Runtime
- **Netlify**: Should work with Edge Functions
- **Other platforms**: May require additional configuration

## Performance

- Images are generated on-demand and cached by browsers
- Edge Runtime ensures fast generation times
- No static files needed - everything is dynamic

## Troubleshooting

### Common Issues

1. **Images not showing**: Check that the middleware excludes `/api/og` from authentication
2. **Wrong colors**: Ensure the JSX uses valid CSS color values
3. **Text overflow**: Test with various title/description lengths

### Debug Mode
Add `?debug=true` to any OG image URL to see error messages in the response.

## Examples

Check out these example pages:
- `/test-og` - Testing page with examples
- `/events/[id]` - Event detail page with dynamic OG images
- `/dashboard` - Dashboard with custom metadata

## Dependencies

- `@vercel/og`: For image generation
- `next`: Built-in metadata API support

The implementation is production-ready and follows Next.js best practices for metadata and image generation.
