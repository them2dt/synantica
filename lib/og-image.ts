/**
 * Utility functions for generating Open Graph images
 * Provides helper functions to create dynamic social preview images
 */

/**
 * Generates an Open Graph image URL for general pages
 * @param title - The title to display on the image
 * @param description - The description to display on the image
 * @returns The URL for the generated OG image
 */
export function generateOGImageUrl(title: string, description?: string): string {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
  });

  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Generates an Open Graph image URL for event pages
 * @param title - The event title
 * @param description - The event description
 * @param eventDate - The event date
 * @param location - The event location
 * @param category - The event category
 * @returns The URL for the generated OG image
 */
export function generateEventOGImageUrl(
  title: string,
  description?: string,
  eventDate?: string,
  location?: string,
  category?: string
): string {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const params = new URLSearchParams({
    type: 'event',
    title,
    ...(description && { description }),
    ...(eventDate && { eventDate }),
    ...(location && { location }),
    ...(category && { category }),
  });

  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Generates metadata object with Open Graph images
 * @param title - The page title
 * @param description - The page description
 * @param type - The type of page (default, event, etc.)
 * @param additionalParams - Additional parameters for OG image generation
 * @returns Metadata object with Open Graph configuration
 */
export function generateMetadataWithOG(
  title: string,
  description: string,
  type: 'default' | 'event' = 'default',
  additionalParams?: {
    eventDate?: string;
    location?: string;
    category?: string;
  }
) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  const ogImageUrl = type === 'event' 
    ? generateEventOGImageUrl(title, description, additionalParams?.eventDate, additionalParams?.location, additionalParams?.category)
    : generateOGImageUrl(title, description);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: 'Synantica',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
