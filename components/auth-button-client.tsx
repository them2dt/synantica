'use client'

import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface AuthButtonClientProps {
  /** Whether to make buttons full width */
  fullWidth?: boolean
  /** Callback when auth buttons are clicked */
  onClick?: () => void
}

export function AuthButtonClient({ fullWidth = false, onClick }: AuthButtonClientProps = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className={cn("flex gap-2", fullWidth && "w-full")}>
        <Button size="sm" variant="outline" disabled className={fullWidth ? "flex-1" : ""}>
          Loading...
        </Button>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      {/* User is logged in - could add user menu here */}
    </div>
  ) : (
    <div className={cn("flex gap-2", fullWidth && "w-full")}>
      <Button asChild size="sm" variant="outline" className={fullWidth ? "flex-1" : ""}>
        <Link href="/auth/login" onClick={onClick}>Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default" className={fullWidth ? "flex-1" : ""}>
        <Link href="/auth/sign-up" onClick={onClick}>Sign up</Link>
      </Button>
    </div>
  );
}
