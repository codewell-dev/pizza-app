"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = React.useState(() => {
    const cache = createCache({ key: "mui", prepend: true });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const styles = Object.values(cache.inserted).join(" ");
    return (
      <style data-emotion="mui" dangerouslySetInnerHTML={{ __html: styles }} />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
