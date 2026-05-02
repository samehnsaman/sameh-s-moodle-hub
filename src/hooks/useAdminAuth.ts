import { useEffect, useState } from "react";
import {
  ADMIN_AUTH_EVENT,
  getAdminEmail,
  isAdminLoggedIn,
} from "@/lib/admin-auth";

export function useAdminAuth() {
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setLoggedIn(isAdminLoggedIn());
      setEmail(getAdminEmail());
    };
    sync();
    setMounted(true);
    window.addEventListener(ADMIN_AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ADMIN_AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Before mount, behave as if logged-out so SSR + first paint never leak admin UI.
  return { mounted, loggedIn: mounted && loggedIn, email };
}
