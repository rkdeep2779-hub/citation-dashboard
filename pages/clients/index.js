import useSWR from "swr";
import Link from "next/link";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Clients() {
  const { data } = useSWR("/api/clients", fetcher);
  const [search, setSearch] = useState("");

  const filteredClients = data?.clients?.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clients</h1>

      {/* Search Bar */}
      <Input
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Client List */}
      <div className="grid gap-4">
        {filteredClients?.map((client) => (
          <Card key={client.id} className="p-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{client.name}</h2>
              <p className="text-zinc-500">{client.website}</p>
            </div>

            <Link
              href={`/clients/${client.id}`}
              className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800"
            >
              View
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
