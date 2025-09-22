import { UpdatePasswordForm } from '@/components/update-password-form'
import { AuthLayout } from '@/components/auth-layout'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

function UpdatePasswordFormFallback() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-semibold">Loading Form...</h2>
      <p className="mt-2 text-muted-foreground">
        Please wait a moment.
      </p>
    </div>
  )
}

export default function UpdatePasswordPage() {
  return (
    <AuthLayout
      title="Update Your Password"
    >
      <p className="text-sm text-muted-foreground mb-4">
        Enter your new password below. Make sure it&apos;s a strong one!
      </p>
      <Suspense fallback={<UpdatePasswordFormFallback />}>
        <UpdatePasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
