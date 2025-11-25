import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { submissionId, status, url } = req.body;

  const { data, error } = await supabase
    .from("submissions")
    .update({ status, url, updated_at: new Date() })
    .eq("id", submissionId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ updated: data });
}
