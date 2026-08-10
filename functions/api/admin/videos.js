function authorized(request, env) {
  const configured = env.ADMIN_TOKEN;
  const supplied = request.headers.get("x-admin-token");
  return !!configured && !!supplied && supplied === configured;
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "video";
}

async function uniqueSlug(env, base) {
  let slug = base;
  for (let i = 1; i < 100; i++) {
    const exists = await env.DB.prepare("SELECT id FROM videos WHERE slug=? LIMIT 1").bind(slug).first();
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.video_url) {
    return Response.json({ error: "Title and video URL are required." }, { status: 400 });
  }

  const title = String(body.title).trim().slice(0, 180);
  const video_url = String(body.video_url).trim().slice(0, 2000);
  const thumbnail_url = String(body.thumbnail_url || "").trim().slice(0, 2000);
  const duration = String(body.duration || "").trim().slice(0, 20);
  const description = String(body.description || "").trim().slice(0, 1000);
  const slug = await uniqueSlug(env, slugify(title));

  const result = await env.DB.prepare(
    "INSERT INTO videos (slug,title,video_url,thumbnail_url,duration,description) VALUES (?,?,?,?,?,?)"
  ).bind(slug, title, video_url, thumbnail_url, duration, description).run();

  return Response.json({ ok: true, message: "Video added.", id: result.meta.last_row_id, slug }, { status: 201 });
}

export async function onRequestDelete({ request, env }) {
  if (!authorized(request, env)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid video ID." }, { status: 400 });

  await env.DB.prepare("DELETE FROM videos WHERE id=?").bind(id).run();
  return Response.json({ ok: true, message: "Video deleted." });
}
