"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

type SessionUser = {
  id?: string;
  role?: string;
};

export default function DashboardResolverPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const session = await getSession();
        const sessionUser = (session?.user || {}) as SessionUser;

        if (sessionUser.id) {
          localStorage.setItem("userId", String(sessionUser.id));
        }

        const role = sessionUser.role?.toLowerCase();

        if (cancelled) return;
        if (role === "brand") {
          router.replace("/dashboard/brand");
          return;
        }
        if (role === "influencer") {
          router.replace("/dashboard/influencer");
          return;
        }

        router.replace("/login");
      } catch {
        if (!cancelled) {
          router.replace("/login");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
    </div>
  );
}
