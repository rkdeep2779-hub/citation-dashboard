import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { client_id, directory_id } = req.body;

    const { data, error } = await supabase
      .from("client_directories")
      .insert({ client_id, directory_id })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.json({ mapping: data });
  }

  res.status(405).end();
}
