import useSWR from "swr";
import { useRouter } from "next/router";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ClientDetails() {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR(`/api/clients/${id}`, fetcher);

  if (!data) return <p>Loading...</p>;

  const client = data.client;
  const directories = data.directories || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{client.name}</h1>

      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle>Client Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Phone:</strong> {client.phone}</p>
          <p><strong>Website:</strong> {client.website}</p>
        </CardContent>
      </Card>

      {/* Directory Listings */}
      <h2 className="text-2xl font-semibold">Directory Listings</h2>

      <div className="grid gap-4">
        {directories.map((dir) => (
          <Card key={dir.id} className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{dir.directory_name}</h3>

              <select
                defaultValue={dir.status}
                className="border p-2 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Live">Live</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <Input
              defaultValue={dir.listing_url}
              placeholder="Listing URL"
              className="mt-3"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
