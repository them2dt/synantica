"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "./login-form"

interface SignInModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function SignInModal({ isOpen, onOpenChange }: SignInModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-8 border-slate-200">
                <DialogHeader className="space-y-3 pt-0">
                    <DialogTitle className="text-3xl font-heading text-center">
                        synantica
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-500 text-sm">
                        Sign in to explore STEM and research opportunities.
                    </DialogDescription>
                </DialogHeader>
                <LoginForm />
            </DialogContent>
        </Dialog>
    )
}
