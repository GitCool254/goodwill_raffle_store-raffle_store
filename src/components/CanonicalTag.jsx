// src/components/CanonicalTag.jsx
//
// Reusable canonical + robots tag helper.
// Uses react-helmet-async, which is already mounted via HelmetProvider in main.jsx.
//
// Usage:
//   <CanonicalTag path="/balaclava" />
//   <CanonicalTag path="/tickets" noindex />
//
// - `path` must start with "/". If omitted, defaults to the homepage.
// - `noindex` adds <meta name="robots" content="noindex, nofollow" />
//   for pages that should not appear in search results
//   (e.g., per-user ticket view, verification page).

import { Helmet } from "react-helmet-async";

const BASE_URL = "https://goodwillstores.vercel.app";

export default function CanonicalTag({ path = "/", noindex = false }) {
  // Normalize the path: ensure it starts with a single "/"
  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "/";

  const url = `${BASE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;

  return (
    <Helmet>
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
