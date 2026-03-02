import { Metadata } from 'next';
import Image from 'next/image';
import { generateMetadataWithOG, generateEventOGImageUrl } from '@/lib/og-image';
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ThemedText } from '@/components/ui/themed-text'
import { ArrowLeft, ExternalLink, Image as ImageIcon, Share2 } from 'lucide-react'

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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="bg-slate-50 rounded-none border border-slate-200 p-8">
          <ThemedText variant="h2" as="h1" className="mb-8">
            Open Graph Image Testing
          </ThemedText>

          <div className="space-y-8">
            {/* Default OG Image */}
            <div className="flex-1">
              <ThemedText variant="h3" as="h2" className="mb-4">Standard OpenGraph</ThemedText>
              <ThemedText variant="base" color="secondary" className="mb-4 block">
                The standard OG image for general pages. Clean branding with Swiss flag.
              </ThemedText>
              <div className="bg-slate-50/50 p-4 rounded-none border border-slate-200">
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
                  className="max-w-full h-auto rounded-none border border-slate-200"
                />
              </div>
            </div>

            {/* Event OG Image */}
            <div>
              <ThemedText variant="h3" as="h2" className="mb-4">
                Event OpenGraph
              </ThemedText>
              <ThemedText variant="base" color="secondary" className="mb-4 block">
                This is the specialized layout for event pages:
              </ThemedText>
              <div className="bg-slate-50/50 p-4 rounded-none border border-slate-200">
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
                  className="max-w-full h-auto rounded-none border border-slate-200"
                />
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-slate-50/40 p-6 rounded-none border border-slate-200">
              <ThemedText variant="h3" as="h2" className="mb-4">How to Use</ThemedText>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 border border-slate-200">
                  <ThemedText variant="sm" className="block"><strong>For general pages:</strong> Use <code>generateMetadataWithOG()</code> in your page metadata</ThemedText>
                  <ThemedText variant="sm" className="block"><strong>For event pages:</strong> Use <code>generateMetadataWithOG()</code> with type &apos;event&apos; and additional parameters</ThemedText>
                  <ThemedText variant="sm" className="block"><strong>Direct URL:</strong> You can also use the API directly at <code>/api/og</code> with query parameters</ThemedText>
                </div>
              </div>
              <ThemedText variant="h5" as="h3" className="mt-8 mb-3">API Parameters</ThemedText>
              <ThemedText variant="xs" color="muted" className="mb-4 block">
                Supported parameters for <code>/api/og</code>:
              </ThemedText>
            </div>

            {/* Test Social Media */}
            <div className="bg-slate-50/40 p-6 rounded-none border border-slate-200">
              <ThemedText variant="h3" as="h2" className="mb-3">
                Test Social Media Sharing
              </ThemedText>
              <ThemedText variant="sm" color="secondary" className="mb-4 block">
                Use these tools to test how your OG images appear on social media:
              </ThemedText>
              <div className="space-y-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-slate-200 bg-slate-50 text-slate-950 px-4 py-2 rounded-none hover:bg-slate-50/60 transition-colors"
                >
                  Test on Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-slate-200 bg-slate-50 text-slate-950 px-4 py-2 rounded-none hover:bg-slate-50/60 transition-colors ml-2"
                >
                  Test on Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}/test-og`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-slate-200 bg-slate-50 text-slate-950 px-4 py-2 rounded-none hover:bg-slate-50/60 transition-colors ml-2"
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
