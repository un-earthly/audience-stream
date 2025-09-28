"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Loader2 } from "lucide-react";
import { loginFailure, loginStart, loginSuccess } from "@/lib/features/auth/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Try to hydrate auth state from server session cookie
    // only when not already authenticated
    if (!isAuthenticated) {
      let cancelled = false;
      const hydrate = async () => {
        dispatch(loginStart());
        try {
          const res = await fetch("/api/auth/me", { cache: "no-store" });
          if (!cancelled && res.ok) {
            const data = await res.json();
            if (data?.user) {
              dispatch(loginSuccess(data.user));
              return;
            }
          }
          if (!cancelled) dispatch(loginFailure());
        } catch {
          if (!cancelled) dispatch(loginFailure());
        }
      };
      hydrate();
      return () => {
        cancelled = true;
      };
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;