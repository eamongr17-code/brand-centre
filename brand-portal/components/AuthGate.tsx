"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface AuthGateProps {
  children: React.ReactNode;
  requireOwner?: boolean;
}

export default function AuthGate({ children, requireOwner = false }: AuthGateProps) {
  const { isAuthenticated, isOwner, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (requireOwner && !isOwner) {
      router.replace("/internal");
    }
  }, [loading, isAuthenticated, isOwner, requireOwner, router]);

  if (loading || !isAuthenticated) return null;
  if (requireOwner && !isOwner) return null;

  return <>{children}</>;
}
