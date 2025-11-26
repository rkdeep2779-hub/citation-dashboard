import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ClientDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Fetch client
  const { data: clientData, mutate } = useSWR(
    id ? `/api/clients/${id}` : null,
    fetcher
  );

  // Fetch all directories
  const { data: directoryData } = useSWR(
    "/api/directories",
    fetcher
  );

  // Fetch assigned directories
  const { data: assignedData, mutate: mutateAssigned } = useSWR(
    id ? `/api/client-directories/${id}` : null,
    fetcher
  );

  const client = clientData?.client || null;
  const assigned = assignedData?.directories || [];

  // Assign directory to client
  async function assignDirectory(dirId) {
    await fetch("/api/client-directories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: id, directory_id: dirId }),
    });

    mutateAssigned();
  }

  if (!client) return <p>Loading...</p>;

  return (
    <div className="p-6">

      {/* CLIENT DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Phone:</strong> {client.phone}</p>
          <p><strong>Website:</strong> {client.website}</p>
        </CardContent>
      </Card>

      {/* ASSIGNED DIRECTORIES */}
      <h2 className="text-xl font-bold mt-6">Assigned Directories</h2>

      {assigned.length === 0 && (
        <p className="text-gray-600 mt-2">No directories assigned yet.</p>
      )}

      <div className="grid gap-4 mt-4">
        {assigned.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle>{a.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Domain: {a.domain}</p>
              <p>Category: {a.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AVAILABLE DIRECTORIES */}
      <h2 className="text-xl font-bold mt-8">Assign New Directories</h2>

      <div className="grid gap-4 mt-4">

        {directoryData?.directories
          ?.filter((d) => !assigned.some((a) => a.id === d.id)) // hide already assigned
          .map((d) => (
            <Card key={d.id} className="p-4">
              <CardHeader>
                <CardTitle>{d.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{d.domain}</p>
                <Button
                  className="mt-3"
                  onClick={() => assignDirectory(d.id)}
                >
                  Assign
                </Button>
              </CardContent>
            </Card>
          ))}

      </div>

    </div>
  );
}
