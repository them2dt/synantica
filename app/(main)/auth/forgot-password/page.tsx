import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { AuthLayout } from "@/components/auth-layout";

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
