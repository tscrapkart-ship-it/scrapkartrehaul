import { createClient } from "./client";

export async function uploadImage(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${path}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteImage(
  bucket: string,
  url: string
): Promise<boolean> {
  const supabase = createClient();

  // Extract path from full URL
  const parts = url.split(`/storage/v1/object/public/${bucket}/`);
  if (parts.length < 2) return false;

  const path = parts[1];
  const { error } = await supabase.storage.from(bucket).remove([path]);

  return !error;
}
