import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Clients() {
  const { data, mutate } = useSWR("/api/clients", fetcher);
  const [search, setSearch] = useState("");
  const [newClient, setNewClient] = useState({ name: "", phone: "", website: "" });

  const saveClient = async () => {
    const res = await fetch("/api/clients/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient)
    });

    await mutate();
    setNewClient({ name: "", phone: "", website: "" });
  };

  const filtered = data?.clients?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Client</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader><DialogTitle>Add Client</DialogTitle></DialogHeader>

            <div className="space-y-4">
              <Input placeholder="Name" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} />
              <Input placeholder="Phone" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
              <Input placeholder="Website" value={newClient.website} onChange={e => setNewClient({ ...newClient, website: e.target.value })} />
              <Button onClick={saveClient} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-4">
        {filtered?.map((client) => (
          <Card key={client.id} className="p-4 flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">{client.name}</h2>
              <p className="text-gray-500">{client.website}</p>
            </div>
            <Link href={`/clients/${client.id}`} className="text-blue-600">View</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
