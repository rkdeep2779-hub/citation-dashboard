// pages/api/submissions/update.js
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { submissionId, status, listing_url } = req.body;

  if (!submissionId) {
    return res.status(400).json({ error: "submissionId required" });
  }

  try {
    const updates = {};
    if (typeof status !== "undefined") updates.status = status;
    if (typeof listing_url !== "undefined") updates.listing_url = listing_url;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const { data, error } = await supabase
      .from("submissions")
      .update(updates)
      .eq("id", submissionId)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, submission: data });
  } catch (err) {
    console.error("Update handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
