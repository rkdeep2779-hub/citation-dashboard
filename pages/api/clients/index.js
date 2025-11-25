import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { data: clients, error } = await supabase.from("clients").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json({ clients });
}
