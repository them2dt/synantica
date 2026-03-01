"use client";

import { cn } from "@/lib/utils";
import { useAuthActions } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { useToast } from "@/components/ui/toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { error: toastError } = useToast();
  const { signIn } = useAuthActions();

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      keepSignedIn: true,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    const { error } = await signIn(data.email, data.password, "/dashboard");

    if (error) {
      if (error.includes("invalid-credential")) {
        toastError("Login Failed", "Invalid email or password. Please try again.");
      } else {
        toastError("Login Failed", error);
      }
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            placeholder="Enter your email"
            className={cn(
              "h-12 border-gray-300 text-base",
              errors.email && "border-red-300 focus:border-red-500"
            )}
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className={cn(
              "h-12 border-gray-300 text-base",
              errors.password && "border-red-300 focus:border-red-500"
            )}
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="keepSignedIn"
              {...register("keepSignedIn")}
            />
            <Label
              htmlFor="keepSignedIn"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>


        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        {/* Mode Toggle */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/auth/sign-up"
              className="text-primary hover:underline font-medium"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
