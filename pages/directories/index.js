import useSWR from "swr";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DirectoriesPage() {
  const { data, mutate } = useSWR("/api/directories", fetcher);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [category, setCategory] = useState("");

  async function addDirectory() {
    await fetch("/api/directories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, domain, category }),
    });
    setName("");
    setDomain("");
    setCategory("");
    mutate();
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Directories</h1>

      <Card className="mt-4 p-4">
        <CardHeader>
          <CardTitle>Add New Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <Input placeholder="Domain" value={domain} onChange={(e)=>setDomain(e.target.value)} className="mt-2"/>
          <Input placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} className="mt-2"/>
          <Button className="mt-3" onClick={addDirectory}>Add</Button>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold mt-6">All Directories</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        {data?.directories?.map((d) => (
          <Card key={d.id} className="p-4">
            <CardHeader>
              <CardTitle>{d.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Domain: {d.domain}</p>
              <p>Category: {d.category}</p>
              <Button
                variant="destructive"
                className="mt-3"
                onClick={async () => {
                  await fetch(`/api/directories/${d.id}`, { method: "DELETE" });
                  mutate();
                }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
