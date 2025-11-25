import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const { count: clients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  const { count: submissions } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true });

  const { count: live } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "Live");

  res.status(200).json({
    clients: clients || 0,
    submissions: submissions || 0,
    live: live || 0,
  });
}
