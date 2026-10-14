// Serves the GitHub Pages build at chartspur.com. Pages stays the build and deploy path (pages.yml).
const ORIGIN = "https://myrmitis.github.io/chartspur";
const HOST = "chartspur.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== HOST) {
      url.hostname = HOST;
      return Response.redirect(url.toString(), 301);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    const upstream = await fetch(ORIGIN + url.pathname + url.search, {
      method: request.method,
      redirect: "manual",
      cf: { cacheEverything: true, cacheTtl: 300 },
    });
    const headers = new Headers(upstream.headers);
    // Pages redirects /dir to /chartspur/dir/ on its own host; keep the visitor on chartspur.com.
    const location = headers.get("Location");
    if (location?.startsWith(ORIGIN)) {
      headers.set("Location", `https://${HOST}${location.slice(ORIGIN.length) || "/"}`);
    }
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
