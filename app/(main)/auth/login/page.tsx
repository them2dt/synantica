import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function Page() {
  return (
    <AuthLayout
      title="Sign in"
    >
      <LoginForm />
    </AuthLayout>
  );
}
