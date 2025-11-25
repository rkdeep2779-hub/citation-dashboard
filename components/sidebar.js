import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-zinc-900 text-white p-6 space-y-4 fixed">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <nav className="space-y-3">
        <Link href="/">
          <p className="hover:bg-zinc-800 p-2 rounded cursor-pointer">
            Home
          </p>
        </Link>

        <Link href="/clients">
          <p className="hover:bg-zinc-800 p-2 rounded cursor-pointer">
            Clients
          </p>
        </Link>

        <Link href="/login">
          <p className="hover:bg-zinc-800 p-2 rounded cursor-pointer">
            Login
          </p>
        </Link>
      </nav>
    </div>
  );
}
