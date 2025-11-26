import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("directories").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ directories: data });
  }

  if (req.method === "POST") {
    const { name, domain, category } = req.body;
    const { data, error } = await supabase
      .from("directories")
      .insert({ name, domain, category })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ directory: data });
  }

  res.status(405).end();
}
