import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    const { error } = await supabase
      .from("directories")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    return res.json({ success: true });
  }

  res.status(405).end();
}
