"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export function LogoutButton() {
  const router = useRouter();
  const { error: toastError } = useToast();

  const logout = async () => {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.refresh();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toastError("Logout failed", "An unexpected error occurred. Please try again.");
    }
  };

  return <Button onClick={logout}>Logout</Button>;
}
