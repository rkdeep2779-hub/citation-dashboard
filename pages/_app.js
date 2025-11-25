import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const publicRoutes = ["/login"]; // pages user can see without login

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && !publicRoutes.includes(router.pathname)) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router.pathname]);

  if (loading) return <p>Loading...</p>;

  return <Component {...pageProps} />;
}

