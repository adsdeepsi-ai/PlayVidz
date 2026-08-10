export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));
  const offset = (page - 1) * limit;

  const count = await env.DB.prepare("SELECT COUNT(*) AS total FROM videos").first();
  const total = Number(count?.total || 0);

  const result = await env.DB.prepare(
    "SELECT id, slug, title, video_url, thumbnail_url, duration, description, created_at FROM videos ORDER BY id DESC LIMIT ? OFFSET ?"
  ).bind(limit, offset).all();

  return Response.json({
    videos: result.results || [],
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit))
  });
}
