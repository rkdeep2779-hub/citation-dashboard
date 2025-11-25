// pages/clients/[id].js
import { useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useRouter } from "next/router";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ClientDetails() {
  const router = useRouter();
  const { id } = router.query;

  // fetch client + directories/submissions from API
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/clients/${id}` : null,
    fetcher
  );

  const [savingMap, setSavingMap] = useState({}); // { submissionId: boolean }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading client.</p>;
  if (!data?.client) return <p>No client found.</p>;

  const client = data.client;
  const submissions = data.directories || []; // adapt to your API's field name

  // Helper: call backend to update a single submission
  const updateSubmission = async (submissionId, patch) => {
    try {
      setSavingMap((s) => ({ ...s, [submissionId]: true }));

      // optimistic UI: update local SWR cache for this client
      mutate(
        (prev) => {
          if (!prev) return prev;
          const updatedDirs = (prev.directories || []).map((d) =>
            d.id === submissionId ? { ...d, ...patch } : d
          );
          return { ...prev, directories: updatedDirs };
        },
        false // don't revalidate immediately
      );

      // send update to server
      const res = await fetch("/api/submissions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, ...patch }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || "Update failed");

      // revalidate to get canonical data
      await mutate();
      // optional: revalidate global dashboards
      globalMutate("/api/dashboard");
    } catch (err) {
      console.error("Update error:", err);
      // On error, revalidate from server to restore previous correct state
      await mutate();
      alert("Could not save change. Try again.");
    } finally {
      setSavingMap((s) => ({ ...s, [submissionId]: false }));
    }
  };

  // auto-save when input loses focus
  const onUrlBlur = (submissionId, newValue, oldValue) => {
    if ((newValue || "") === (oldValue || "")) return;
    updateSubmission(submissionId, { listing_url: newValue });
  };

  // immediate save for select change
  const onStatusChange = (submissionId, newStatus) => {
    updateSubmission(submissionId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{client.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Client Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Phone:</strong> {client.phone || "—"}</p>
          <p><strong>Website:</strong> {client.website || "—"}</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold">Directory Listings</h2>

      <div className="space-y-4">
        {submissions.length === 0 && <p>No directories added for this client.</p>}

        {submissions.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">
                  {s.directories?.name || s.directory_name || "Directory"}
                </h3>
                <p className="text-sm text-zinc-500">{s.directories?.domain || s.domain || ""}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Status select */}
                <select
                  value={s.status || "Pending"}
                  onChange={(e) => onStatusChange(s.id, e.target.value)}
                  className="rounded border px-3 py-2 bg-white text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Verified">Verified</option>
                  <option value="Live">Live</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* Listing URL editable input */}
                <div style={{ minWidth: 320 }}>
                  <Input
                    defaultValue={s.listing_url || s.url || ""}
                    onBlur={(e) => onUrlBlur(s.id, e.target.value, s.listing_url || s.url || "")}
                    placeholder="Listing URL (paste link or leave empty)"
                  />
                </div>

                {/* Save indicator */}
                <div>
                  {savingMap[s.id] ? (
                    <span className="text-sm text-zinc-500">Saving…</span>
                  ) : (
                    <span className="text-sm text-zinc-400">Saved</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
