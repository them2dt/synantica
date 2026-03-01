"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { signOut } = useAuth();

  const logout = async () => {
    await signOut();
  };

  return <Button onClick={logout}>Logout</Button>;
}
