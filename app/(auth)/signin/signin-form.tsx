"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Github, Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/lib/hooks";
import { loginStart, loginSuccess } from "@/lib/features/auth/authSlice";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = async (provider: string) => {
    setIsLoading(true);
    dispatch(loginStart());

    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock user data
    const mockUser = {
      id: "user_123",
      name: "Alex Johnson",
      email: email || "alex@example.com",
      avatar: "",
      plan: "pro" as const,
    };

    dispatch(loginSuccess(mockUser));
    setIsLoading(false);
    
    // Redirect to dashboard
    router.push("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin("email");
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <CardTitle className="text-2xl">Welcome to AudienceStream</CardTitle>
          <CardDescription className="mt-2">
            Sign in to start creating AI-powered marketing campaigns
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Social login buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleLogin("google")}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            <Chrome className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>

          <Button
            onClick={() => handleLogin("github")}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </div>
      </CardContent>
    </Card>
  );
}