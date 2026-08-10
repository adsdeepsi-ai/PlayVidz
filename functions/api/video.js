export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const slug = (url.searchParams.get("slug") || "").trim();
  if (!slug) return Response.json({ error: "Missing slug" }, { status: 400 });

  const video = await env.DB.prepare(
    "SELECT id, slug, title, video_url, thumbnail_url, duration, description, created_at FROM videos WHERE slug=? LIMIT 1"
  ).bind(slug).first();

  if (!video) return Response.json({ error: "Video not found" }, { status: 404 });

  const similar = await env.DB.prepare(
    "SELECT id, slug, title, video_url, thumbnail_url, duration FROM videos WHERE id != ? ORDER BY id DESC LIMIT 10"
  ).bind(video.id).all();

  return Response.json({ video, similar: similar.results || [] });
}
