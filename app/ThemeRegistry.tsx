"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import type { EmotionCache } from "@emotion/cache";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const inserted = React.useRef<string[]>([]);

  const cache = React.useMemo<EmotionCache>(() => {
    const cache = createCache({
      key: "mui",
      prepend: true,
    });

    cache.compat = true;

    const prevInsert = cache.insert;

    cache.insert = (...args: Parameters<typeof prevInsert>) => {
      const serialized = args[1];

      if (cache.inserted[serialized.name] === undefined) {
        inserted.current.push(serialized.name);
      }

      return prevInsert(...args);
    };

    return cache;
  }, []);

  useServerInsertedHTML(() => {
    const styles = inserted.current.map((name) => cache.inserted[name]);

    inserted.current = [];

    return (
      <style
        data-emotion="mui"
        dangerouslySetInnerHTML={{ __html: styles.join("") }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
