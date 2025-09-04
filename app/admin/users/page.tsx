import { Metadata } from 'next';
import { generateMetadataWithOG } from '@/lib/og-image';
import { AdminUsersPageComponent } from '@/components/admin/admin-users-page';

/**
 * Metadata for the admin users page
 */
export const metadata: Metadata = generateMetadataWithOG(
  'User Management - Synantica Admin',
  'Manage user roles and permissions in the Synantica platform.'
);

/**
 * Admin users management page
 * Allows admins to view and manage user roles
 */
export default function AdminUsersPage() {
  return <AdminUsersPageComponent />;
}
