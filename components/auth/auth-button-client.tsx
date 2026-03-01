'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button";
import { SignInModal } from "./sign-in-modal"

interface AuthButtonClientProps {
  /** Whether to make buttons full width */
  fullWidth?: boolean
  /** Callback when auth buttons are clicked */
  onClick?: () => void
}

/**
 * Renders the Sign In button which triggers the SignInModal.
 * This is a client component for use in the navigation bar.
 */
export function AuthButtonClient({ fullWidth = false, onClick }: AuthButtonClientProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
    if (onClick) onClick()
  }

  return (
    <>
      <Button
        variant="default"
        size="default"
        className={fullWidth ? "w-full" : ""}
        onClick={handleOpenModal}
      >
        Sign in
      </Button>
      <SignInModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
