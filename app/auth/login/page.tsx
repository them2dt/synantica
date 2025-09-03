import { LoginForm } from "@/components/login-form";
import { AuthLayout } from "@/components/auth-layout";

export default function Page() {
  return (
    <AuthLayout
      subtitle="Don't have an account yet? Sign up now"
    >
      <LoginForm />
    </AuthLayout>
  );
}
