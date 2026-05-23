import OpengraphImage from "./opengraph-image";

// Twitter/X card — same 1200×630 spec as Open Graph.
// Next.js requires runtime/size/contentType be statically parseable,
// so we inline the consts here and reuse the OG render component.

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Cognitum Learn — turn any topic into an in-house expert you can ask anything. Videos → cited answers on your hardware.";

export default function TwitterImage() {
  return OpengraphImage();
}
