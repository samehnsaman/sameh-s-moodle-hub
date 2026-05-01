import { useEffect, useState, useCallback } from "react";
import {
  DATA_SOURCE_EVENT,
  type DataMode,
  getApiBaseUrl,
  getDataMode,
} from "@/lib/data-source";

/**
 * Subscribes to data-source changes so components re-render and refetch
 * when the user toggles between mock and API.
 */
export function useDataSource() {
  const [mode, setMode] = useState<DataMode>("mock");
  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    const sync = () => {
      setMode(getDataMode());
      setBaseUrl(getApiBaseUrl());
    };
    sync();
    window.addEventListener(DATA_SOURCE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(DATA_SOURCE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { mode, baseUrl };
}

/**
 * Tiny data-fetching hook tied to the data source. When the user flips
 * the switch, the fetcher re-runs automatically.
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const { mode, baseUrl } = useDataSource();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const run = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, baseUrl, ...deps]);

  useEffect(() => run(), [run]);

  return { data, error, loading, refetch: run };
}
