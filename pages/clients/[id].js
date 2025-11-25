import { useRouter } from "next/router";
import useSWR from "swr";

export default function ClientDetail() {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, mutate } = useSWR(id ? `/api/clients/${id}` : null, fetcher);

  const handleUpdate = async (submissionId, field, value) => {
    await fetch("/api/submissions/update", {
      method: "POST",
      body: JSON.stringify({
        submissionId,
        status: field === "status" ? value : undefined,
        url: field === "url" ? value : undefined,
      }),
      headers: { "Content-Type": "application/json" },
    });

    mutate();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 24 }}>{data?.client?.name}</h1>

      <div style={{ marginTop: 20 }}>
        {data?.submissions?.map((s) => (
          <div
            key={s.id}
            style={{
              padding: 20,
              background: "#fff",
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <h3>{s.directories?.name}</h3>

            <select
              value={s.status}
              onChange={(e) => handleUpdate(s.id, "status", e.target.value)}
            >
              <option>Pending</option>
              <option>Submitted</option>
              <option>Verified</option>
              <option>Live</option>
              <option>Rejected</option>
            </select>

            <input
              style={{ marginLeft: 10 }}
              value={s.url || ""}
              onChange={(e) => handleUpdate(s.id, "url", e.target.value)}
              placeholder="Listing URL"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
