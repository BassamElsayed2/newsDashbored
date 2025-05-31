import supabase from "./supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name_ar, name_en");

  if (error) throw error;
  return data;
}
