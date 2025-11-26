import { useState, useEffect } from "react";

export const getServerSideProps = () => {
  return { props: {} }; // prevents static generation
};

export default function Login() {
  const [supabase, setSupabase] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function load() {
      const { createClient } = await import("@supabase/supabase-js");

      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      setSupabase(client);
    }

    load();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    if (!supabase) {
      alert("Loading...");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else window.location.href = "/";
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="space-y-4 p-6 border rounded w-80">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="border p-2 rounded w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="bg-black text-white p-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
}
