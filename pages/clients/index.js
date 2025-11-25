import useSWR from "swr";
import Link from "next/link";

export default function Clients() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/clients", fetcher);
  const clients = data?.clients || [];

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Clients</h1>

      {clients.map((client) => (
        <Link key={client.id} href={`/clients/${client.id}`}>
          <div
            style={{
              padding: 15,
              background: "#fff",
              marginBottom: 10,
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            {client.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
