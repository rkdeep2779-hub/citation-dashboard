import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";

import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Clients() {
  const { data, mutate } = useSWR("/api/clients", fetcher);
  const [search, setSearch] = useState("");

  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    website: "",
  });

  const [saving, setSaving] = useState(false);

  const filteredClients = data?.clients?.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const createClient = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/clients/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!res.ok) throw new Error("Failed to create client");

      await mutate(); // refresh clients list
      setNewClient({ name: "", phone: "", website: "" });
      setSaving(false);
      alert("Client added!");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>

        {/* ADD CLIENT BUTTON & MODAL */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Client</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              <Input
                placeholder="Client Name"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient((v) => ({ ...v, name: e.target.value }))
                }
              />

              <Input
                placeholder="Phone Number"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient((v) => ({ ...v, phone: e.target.value }))
                }
              />

              <Input
                placeholder="Website URL"
                value={newClient.website}
                onChange={(e) =>
                  setNewClient((v) => ({ ...v, website: e.target.value }))
                }
              />

              <Button onClick={createClient} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Client"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
