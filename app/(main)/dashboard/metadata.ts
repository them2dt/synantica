import { Metadata } from 'next';
import { generateMetadataWithOG } from '@/lib/og-image';

/**
 * Metadata configuration for the dashboard page
 * Generates dynamic Open Graph images for the dashboard
 */
export const metadata: Metadata = generateMetadataWithOG(
  'Dashboard - Synantica',
  'Discover and manage your upcoming career events, workshops, and networking opportunities all in one place.'
);
