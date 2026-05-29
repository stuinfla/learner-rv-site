"use client";

import { useEffect, useState } from "react";
import { COGNITUM_LEARN_VERSION } from "./version";

// LiveVersion — fetches the latest GitHub release tag at mount.
// Falls back to the compile-time COGNITUM_LEARN_VERSION constant if the API call fails
// or the fetch hasn't resolved yet (so the first paint matches SSR and never shows blank).
export function LiveVersion({ className }: { className?: string }) {
  const [version, setVersion] = useState<string>(COGNITUM_LEARN_VERSION);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/version", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { version?: string | null } | null) => {
        if (!cancelled && j?.version) setVersion(j.version);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <span className={className}>{version}</span>;
}
