import { Metadata } from 'next';
import { generateMetadataWithOG, generateEventOGImageUrl } from '@/lib/og-image';

/**
 * Test page to demonstrate Open Graph image generation
 * This page shows how different OG images are generated
 */
export const metadata: Metadata = generateMetadataWithOG(
  'Test OG Images - Synantica',
  'Testing dynamic Open Graph image generation for social media previews'
);

/**
 * Test page component showing OG image examples
 */
export default function TestOGPage() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  // Example OG image URLs
  const defaultOGUrl = `${baseUrl}/api/og?title=Synantica&description=Find Your Next Career Event`;
  const eventOGUrl = generateEventOGImageUrl(
    'HackTech 2024',
    'Join us for 48 hours of coding, innovation, and prizes!',
    'March 15, 2024',
    'Computer Science Building',
    'Hackathon'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Open Graph Image Testing
          </h1>
          
          <div className="space-y-8">
            {/* Default OG Image */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Default OG Image
              </h2>
              <p className="text-gray-600 mb-4">
                This is the default layout for general pages:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <code className="text-sm text-gray-800 break-all">
                  {defaultOGUrl}
                </code>
              </div>
              <div className="mt-4">
                <img 
                  src={defaultOGUrl} 
                  alt="Default OG Image" 
                  className="max-w-full h-auto rounded-lg border"
                  style={{ maxWidth: '600px' }}
                />
              </div>
            </div>

            {/* Event OG Image */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Event OG Image
              </h2>
              <p className="text-gray-600 mb-4">
                This is the specialized layout for event pages:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <code className="text-sm text-gray-800 break-all">
                  {eventOGUrl}
                </code>
              </div>
              <div className="mt-4">
                <img 
                  src={eventOGUrl} 
                  alt="Event OG Image" 
                  className="max-w-full h-auto rounded-lg border"
                  style={{ maxWidth: '600px' }}
                />
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                How to Use
              </h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>For general pages:</strong> Use <code>generateMetadataWithOG()</code> in your page metadata</p>
                <p><strong>For event pages:</strong> Use <code>generateMetadataWithOG()</code> with type 'event' and additional parameters</p>
                <p><strong>Direct URL:</strong> You can also use the API directly at <code>/api/og</code> with query parameters</p>
              </div>
            </div>

            {/* Test Social Media */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-green-900 mb-3">
                Test Social Media Sharing
              </h3>
              <p className="text-green-800 mb-4">
                Use these tools to test how your OG images appear on social media:
              </p>
              <div className="space-y-2">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Test on Facebook
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors ml-2"
                >
                  Test on Twitter
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors ml-2"
                >
                  Test on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
