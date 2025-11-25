import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const { data } = useSWR("/api/dashboard", fetcher);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {data?.clients || 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {data?.submissions || 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {data?.live || 0}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
