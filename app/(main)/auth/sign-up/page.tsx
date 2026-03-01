import { SignUpForm } from "@/components/auth/sign-up-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function Page() {
  return (
    <AuthLayout
      title="Sign up"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
