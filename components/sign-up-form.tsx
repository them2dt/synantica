"use client";

import { cn } from "@/lib/utils";
import { useAuthActions } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { useToast } from "@/components/ui/toast";
import {
  validatePassword,
  getStrengthColor,
  getStrengthDescription
} from "@/lib/utils/password-validation";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const { error: toastError, success: toastSuccess } = useToast();
  const { signUp } = useAuthActions();

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password for real-time validation
  const password = watch("password");
  const passwordValidation = validatePassword(password);

  const onSubmit = async (data: SignUpFormData) => {
    const { error } = await signUp(data.email, data.password, "/dashboard");

    if (error) {
      if (error.includes("email-already-in-use")) {
        toastError("Email already exists", "This email is already registered. Please try signing in instead.");
      } else if (error.includes("weak-password")) {
        toastError("Password too weak", "Please choose a stronger password with more variety.");
      } else {
        toastError("Registration failed", error);
      }
      return;
    }

    toastSuccess("Account created!", "Welcome to the platform! You can now start exploring events.");
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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className={cn(
                "h-12 border-gray-300 pr-10 text-base",
                errors.password && "border-red-300 focus:border-red-500"
              )}
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Password strength:</span>
                <span className={cn("font-medium", getStrengthColor(passwordValidation.strength))}>
                  {getStrengthDescription(passwordValidation.strength)}
                </span>
              </div>
              <Progress
                value={passwordValidation.score}
                className="h-2"
              />

              {/* Password Requirements */}
              <div className="space-y-1 text-xs">
                {passwordValidation.feedback.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {passwordValidation.requirements.minLength && requirement.includes('characters') ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : passwordValidation.requirements.hasUppercase && requirement.includes('uppercase') ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : passwordValidation.requirements.hasLowercase && requirement.includes('lowercase') ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : passwordValidation.requirements.hasNumbers && requirement.includes('numbers') ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : passwordValidation.requirements.hasSpecialChars && requirement.includes('special') ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : passwordValidation.requirements.noCommonPatterns && requirement.includes('common') ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={requirement.includes('characters') && passwordValidation.requirements.minLength ? 'text-green-600' :
                      requirement.includes('uppercase') && passwordValidation.requirements.hasUppercase ? 'text-green-600' :
                        requirement.includes('lowercase') && passwordValidation.requirements.hasLowercase ? 'text-green-600' :
                          requirement.includes('numbers') && passwordValidation.requirements.hasNumbers ? 'text-green-600' :
                            requirement.includes('special') && passwordValidation.requirements.hasSpecialChars ? 'text-green-600' :
                              requirement.includes('common') && passwordValidation.requirements.noCommonPatterns ? 'text-green-600' : 'text-red-600'}>
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showRepeatPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              className={cn(
                "h-12 border-gray-300 pr-10 text-base",
                errors.confirmPassword && "border-red-300 focus:border-red-500"
              )}
              {...register("confirmPassword")}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showRepeatPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-sm text-red-600" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>


        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>

        {/* Mode Toggle */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
