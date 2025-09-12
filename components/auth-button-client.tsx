'use client'

import Link from "next/link";
import { Button } from "./ui/button";

interface AuthButtonClientProps {
  /** Whether to make buttons full width */
  fullWidth?: boolean
  /** Callback when auth buttons are clicked */
  onClick?: () => void
}

/**
 * Renders the Sign In and Sign Up buttons.
 * This is a client component for use in the navigation bar.
 */
export function AuthButtonClient({ fullWidth = false, onClick }: AuthButtonClientProps = {}) {
  return (
    <>
      <Button asChild size="sm" variant="outline" className={fullWidth ? "flex-1" : ""}>
        <Link href="/auth/login" onClick={onClick}>Sign in</Link>
      </Button>
      <Button asChild size="sm" className={fullWidth ? "flex-1" : ""}>
        <Link href="/auth/sign-up" onClick={onClick}>Sign up</Link>
      </Button>
    </>
  );
}
