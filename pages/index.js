import useSWR from "swr";

export default function Dashboard() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/dashboard", fetcher);

  return (
    <div style={{ padding: 40 }}>
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
