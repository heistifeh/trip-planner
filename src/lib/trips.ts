import { supabase } from "./supabase";

export async function fetchTrips() {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchTrip(id: string) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
