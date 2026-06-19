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
}