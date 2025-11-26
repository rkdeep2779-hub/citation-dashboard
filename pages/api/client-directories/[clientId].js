import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { clientId } = req.query;

  const { data, error } = await supabase
    .from("client_directories")
    .select("directory_id, directories(*)")
    .eq("client_id", clientId);

  if (error) return res.status(500).json({ error: error.message });

  // Format assigned directories as an array of directories
  const directories = data.map((d) => d.directories);

  return res.json({ directories });
}
