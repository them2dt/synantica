"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { useToast } from "@/components/ui/toast";
// import { Turnstile } from "@marsidev/react-turnstile";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const router = useRouter();
  const { error: toastError } = useToast();
  const isDev = process.env.NODE_ENV !== "production";

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

  /**
   * Handle form submission with enhanced error handling
   */
  const onSubmit = async (data: SignInFormData) => {
    if (isDev) {
      console.log("Login form submitted with data:", {
        email: data.email,
        passwordLength: data.password.length,
      });
    }

    // Temporarily bypass Turnstile for debugging
    // TODO: Re-enable after fixing Turnstile integration
    // if (!turnstileToken) {
    //   toastError("Verification required", "Please complete the verification challenge.");
    //   return;
    // }

    const supabase = createClient();
    if (isDev) {
      console.log("Supabase client created for login");
    }

    try {
      if (isDev) {
        console.log("Calling supabase.auth.signInWithPassword...");
      }
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (isDev) {
        console.log("Login response:", { data: authData, error });
      }

      if (error) {
        if (isDev) {
          console.error("Login error:", error.message);
        }
        if (error.message.includes("Invalid login credentials")) {
          toastError("Login Failed", "Invalid email or password. Please try again.");
        } else {
          toastError("Login Failed", "Could not authenticate. Please try again later.");
        }
        return;
      }

      // Persist session based on user preference
      if (authData.session) {
        const expiresIn = data.keepSignedIn ? 60 * 60 * 24 * 30 : 60 * 60;
        await supabase.auth.setSession({
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_in: expiresIn,
        } as {
          access_token: string;
          refresh_token: string;
          expires_in: number;
        });
      }

      console.log('Login successful, redirecting to dashboard...');
      
      // Refresh the page to update server-side authentication state
      router.refresh();

      await router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      if (isDev) {
        console.error("An unexpected error occurred:", err);
      }
      toastError("Login failed", "An unexpected error occurred. Please try again.");
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

        {/* Cloudflare Turnstile Verification - Temporarily disabled for debugging */}
        {/* <div className="space-y-2">
          <Label className="text-sm font-medium text-center block">
            Please complete the verification below
          </Label>
          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
              className="mx-auto"
            />
          </div>
        </div> */}

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
