import { useState, useEffect } from "react";
import type { FatInfo } from "../models/fat";

export interface FilterEntry {
  column: string;
  value: string;
}

const COLUMN_MAP: Record<string, string> = {
  serial: "SERIAL_MODEM",
  fat: "FAT",
  state: "ESTADO",
  region: "REGION",
  municipality: "MUNICIPIO",
  parish: "PARROQUIA",
  ip: "OLT",
  address: "CQE",
  card: "SLOT",
  port: "PUERTO",
  acronym: "ACRONIMO",
};

interface UseFilteredFatResult {
  data: FatInfo | null;
  loading: boolean;
  error: string | null;
}

export function useFilteredFat(
  filters: FilterEntry[],
  page: number,
  pageSize: number,
): UseFilteredFatResult {
  const [data, setData] = useState<FatInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    const activeFilters: FilterEntry[] = JSON.parse(filtersKey);

    if (activeFilters.length === 0) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const mapped = activeFilters
      .filter((f) => f.column in COLUMN_MAP)
      .map((f) => ({ name: COLUMN_MAP[f.column], value: f.value }));

    if (mapped.length === 0) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const ge = page * pageSize;
      const le = ge + pageSize;

      const params = new URLSearchParams({ ge: String(ge), le: String(le) });
      mapped.forEach((m) => params.append("name_columns", m.name));
      mapped.forEach((m) => params.append("values", m.value));

      fetch(`${apiUrl}/filter?${params}`)
        .then((res) => {
          if (!res.ok)
            throw new Error(`Error ${res.status}: ${res.statusText}`);
          return res.json() as Promise<FatInfo>;
        })
        .then((json) => setData(json))
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [filtersKey, page, pageSize]);

  return { data, loading, error };
}
