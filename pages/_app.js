import "../styles/globals.css";
import Layout from "../components/layout";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const publicRoutes = ["/login"];

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

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
