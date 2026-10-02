import { supabase } from "./supabase";

export default async function fetchTripItems(tripId: string) {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
