import { Navigation } from "@/components/layout/navigation";
import { NavigationSpacer } from "@/components/layout/navigation-spacer";
import { AuthNav } from '@/components/layout/auth-nav';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
