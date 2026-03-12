function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  if (origin === "https://eamongr17-code.github.io") return true;
  if (/^https:\/\/[a-z0-9-]+(\.vercel\.app)$/.test(origin)) return true;
  return false;
}

function corsHeaders(origin) {
  const allowed = isAllowedOrigin(origin) ? origin : "https://eamongr17-code.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? "";

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
      const key = `${Date.now()}-${safeName}`;

      await env.ATLAS_STORAGE.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
      });

      const url = `https://pub-e9e14046aed24aaf9fc42c0864d1822d.r2.dev/${key}`;

      return new Response(JSON.stringify({ url }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Upload failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }
  },
};
