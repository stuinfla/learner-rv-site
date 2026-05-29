// Dynamic version endpoint — fetches the latest GitHub release tag for cognitum-learn.
// Cached at the edge for 1 hour so we don't hammer the GitHub API on every page view.

export const revalidate = 3600; // 1h ISR

type GithubRelease = { tag_name?: string; name?: string };

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/stuinfla/cognitum-learn/releases/latest",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "cognitum-learn-site",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return Response.json(
        { version: null, source: "fallback", status: res.status },
        { status: 200, headers: { "Cache-Control": "public, s-maxage=300" } },
      );
    }

    const data = (await res.json()) as GithubRelease;
    const tag = data.tag_name?.trim() || data.name?.trim() || null;

    return Response.json(
      { version: tag, source: "github" },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return Response.json(
      { version: null, source: "error" },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=300" } },
    );
  }
}
