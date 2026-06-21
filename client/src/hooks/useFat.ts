import { useState, useEffect } from "react";
import type { FatInfo } from "../models/fat";

interface UseFatResult {
  data: FatInfo | null;
  loading: boolean;
  error: string | null;
}

export function useFat(page: number, pageSize: number): UseFatResult {
  const [data, setData] = useState<FatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const ge = page * pageSize;
    const le = ge + pageSize;
    const params = new URLSearchParams({ ge: String(ge), le: String(le) });

    setLoading(true);
    setError(null);

    fetch(`${apiUrl}/?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json() as Promise<FatInfo>;
      })
      .then((json) => setData(json))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  return { data, loading, error };
}
