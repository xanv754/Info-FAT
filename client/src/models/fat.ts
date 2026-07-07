export interface FatRecord {
  id: number;
  serial: string;
  fat: string | null;
  state: string;
  region: string;
  municipality: string;
  parish: string;
  ip: string;
  address: string | null;
  card: number;
  port: number;
  acronym: string;
  odn_gda: string;
  zone_gda: string;
  status_crm: string;
}

export interface FatInfo {
  items: FatRecord[];
  total_items: number;
  total: number;
}
