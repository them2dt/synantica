import { SignUpForm } from "@/components/sign-up-form";
import { AuthLayout } from "@/components/auth-layout";

export default function Page() {
  return (
    <AuthLayout
      subtitle="Already have an account? Sign in"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
