'use client'

import { AuthenticatedNavbar } from '@/components/layout/authenticated-navbar';
import { useAuthContext } from '@/lib/contexts/auth-context';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuthContext();
  const pathname = usePathname();
  
  // Don't show navbar on auth pages
  const isAuthPage = pathname?.startsWith('/auth');
  const shouldShowNavbar = isAuthenticated && !isAuthPage && !loading;

  return (
    <>
      {shouldShowNavbar && <AuthenticatedNavbar />}
      {children}
    </>
  );
}
