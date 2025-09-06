"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  validatePassword, 
  getStrengthColor, 
  getStrengthDescription
} from "@/lib/utils/password-validation";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const router = useRouter();

  // Password validation
  const passwordValidation = validatePassword(password);
  const isPasswordValid = passwordValidation.isValid;
  const isRepeatPasswordValid = password === repeatPassword && repeatPassword.length > 0;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Enhanced validation
    if (!isPasswordValid) {
      setError("Password does not meet security requirements");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleSignUp} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-gray-300"
          />
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
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "h-12 border-gray-300 pr-10",
                password && !isPasswordValid && "border-red-300 focus:border-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
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
          <Label htmlFor="repeat-password" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="repeat-password"
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Confirm your password"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className={cn(
                "h-12 border-gray-300 pr-10",
                repeatPassword && !isRepeatPasswordValid && "border-red-300 focus:border-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {repeatPassword && (
            <div className="flex items-center gap-2 text-sm">
              {isRepeatPasswordValid ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Passwords match</span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          disabled={isLoading || !isPasswordValid || !isRepeatPasswordValid}
        >
          {isLoading ? "Creating account..." : "Create Account"}
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
