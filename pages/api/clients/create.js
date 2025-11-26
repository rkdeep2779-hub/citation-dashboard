import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, website } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });

  const { data, error } = await supabase
    .from("clients")
    .insert({ name, phone, website })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ client: data });
}
