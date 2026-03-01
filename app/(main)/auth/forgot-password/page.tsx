import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password?"
    >
      <p className="text-sm text-muted-foreground mb-4">
        Enter your email below to receive a password reset link.
      </p>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
