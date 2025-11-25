import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { id } = req.query;

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, directories(name)")
    .eq("client_id", id);

  const { data: directories } = await supabase.from("directories").select("*");

  res.json({
    client,
    submissions: submissions || [],
    directories: directories || [],
  });
}
