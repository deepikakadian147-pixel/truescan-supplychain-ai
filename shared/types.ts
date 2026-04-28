export type ScanStatus = 'AUTHENTIC' | 'SUSPICIOUS' | 'COUNTERFEIT';

export interface ScanResult {
  scanId: string;
  timestamp: string;
  status: ScanStatus;
  confidence: number;
  anomalyFlags: string[];
}
