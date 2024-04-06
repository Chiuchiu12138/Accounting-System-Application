"use client";

import { useState, useEffect, useContext, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext, AuthScreen } from "../_providers/AuthProvider";

export { RouteGuard };

function RouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const { authenticatedUser, setAuthScreen } = useContext(AuthContext);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(pathname);
  }, [pathname]);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = [
      "/",
      "",
      "/auth/reset-password-return",
      "/auth/reset-password-return/",
      "/auth/confirm-email-return",
      "/auth/confirm-email-return/",
    ];
    const path = url.split("?")[0];
    if (!authenticatedUser?.userToken && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push("/");
      setAuthScreen(AuthScreen.LOGIN);
    } else {
      setAuthorized(true);
    }
  }

  return authorized && children;
}
