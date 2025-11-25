import useSWR from "swr";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Dashboard() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/dashboard", fetcher);

  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ padding: 40 }}>
      <button
        onClick={logout}
        style={{
          padding: "10px 20px",
          background: "red",
          color: "white",
          borderRadius: 5,
          marginBottom: 20,
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <h1 style={{ fontSize: 32, marginBottom: 20 }}>Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ padding: 20, background: "#fff", borderRadius: 10 }}>
          <h3>Total Clients</h3>
          <p style={{ fontSize: 24 }}>{data?.clients || 0}</p>
        </div>

        <div style={{ padding: 20, background: "#fff", borderRadius: 10 }}>
          <h3>Total Submissions</h3>
          <p style={{ fontSize: 24 }}>{data?.submissions || 0}</p>
        </div>

        <div style={{ padding: 20, background: "#fff", borderRadius: 10 }}>
          <h3>Live Listings</h3>
          <p style={{ fontSize: 24 }}>{data?.live || 0}</p>
        </div>
      </div>
    </div>
  );
}
