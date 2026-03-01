import { Metadata } from 'next';
import Image from 'next/image';
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
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="bg-card rounded-none border border-border p-8">
          <h1 className="text-3xl text-slate-950 mb-8">
            Open Graph Image Testing
          </h1>

          <div className="space-y-8">
            {/* Default OG Image */}
            <div>
              <h2 className="text-2xl text-slate-950 mb-4">
                Default OG Image
              </h2>
              <p className="text-secondary-foreground mb-4">
                This is the default layout for general pages:
              </p>
              <div className="bg-muted/50 p-4 rounded-none border border-border">
                <code className="text-sm text-slate-950 break-all">
                  {defaultOGUrl}
                </code>
              </div>
              <div className="mt-4">
                <Image
                  src={defaultOGUrl}
                  alt="Default OG Image"
                  width={600}
                  height={315}
                  className="max-w-full h-auto rounded-none border border-border"
                />
              </div>
            </div>

            {/* Event OG Image */}
            <div>
              <h2 className="text-2xl text-slate-950 mb-4">
                Event OG Image
              </h2>
              <p className="text-secondary-foreground mb-4">
                This is the specialized layout for event pages:
              </p>
              <div className="bg-muted/50 p-4 rounded-none border border-border">
                <code className="text-sm text-slate-950 break-all">
                  {eventOGUrl}
                </code>
              </div>
              <div className="mt-4">
                <Image
                  src={eventOGUrl}
                  alt="Event OG Image"
                  width={600}
                  height={315}
                  className="max-w-full h-auto rounded-none border border-border"
                />
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-muted/40 p-6 rounded-none border border-border">
              <h3 className="text-lg text-slate-950 mb-3">
                How to Use
              </h3>
              <div className="text-secondary-foreground space-y-2 text-sm">
                <p><strong>For general pages:</strong> Use <code>generateMetadataWithOG()</code> in your page metadata</p>
                <p><strong>For event pages:</strong> Use <code>generateMetadataWithOG()</code> with type &apos;event&apos; and additional parameters</p>
                <p><strong>Direct URL:</strong> You can also use the API directly at <code>/api/og</code> with query parameters</p>
              </div>
            </div>

            {/* Test Social Media */}
            <div className="bg-muted/40 p-6 rounded-none border border-border">
              <h3 className="text-lg text-slate-950 mb-3">
                Test Social Media Sharing
              </h3>
              <p className="text-secondary-foreground mb-4 text-sm">
                Use these tools to test how your OG images appear on social media:
              </p>
              <div className="space-y-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-border bg-slate-50 text-slate-950 px-4 py-2 rounded-none hover:bg-muted/60 transition-colors"
                >
                  Test on Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-border bg-slate-50 text-slate-950 px-4 py-2 rounded-none hover:bg-muted/60 transition-colors ml-2"
                >
                  Test on Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-border bg-slate-50 text-slate-950 px-4 py-2 rounded-none hover:bg-muted/60 transition-colors ml-2"
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
