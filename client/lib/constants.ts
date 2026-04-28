

import type { ProductInfo, ChainEvent, GeoCoordinate } from "../types";


export const PRODUCT_DB: Record<string, ProductInfo> = {
  "TS-HUL-001-2024": {
    code: "TS-HUL-001-2024",
    name: "Dove Beauty Bar 100g",
    brand: "Dove / HUL",
    category: "Personal Care",
    sku: "DOV-BB-100-IND",
    registeredAt: "2024-01-15T08:00:00Z",
    manufacturingPlant: "HUL Silvassa Plant, Gujarat, India",
    batchId: "BATCH-HUL-2024-Q1-0412",
  },
  "TS-PEP-002-2024": {
    code: "TS-PEP-002-2024",
    name: "Lay's Classic Salted 52g",
    brand: "PepsiCo India",
    category: "Snacks & Beverages",
    sku: "LAY-CLS-52-IND",
    registeredAt: "2024-02-10T09:30:00Z",
    manufacturingPlant: "PepsiCo Pune Manufacturing Unit",
    batchId: "BATCH-PEP-2024-Q1-0218",
  },
  "TS-MRK-003-2024": {
    code: "TS-MRK-003-2024",
    name: "Dettol Original Liquid Soap 200ml",
    brand: "Reckitt Benckiser",
    category: "Health & Hygiene",
    sku: "DET-LIQ-200-IND",
    registeredAt: "2024-01-20T11:00:00Z",
    manufacturingPlant: "Reckitt Baddi Plant, Himachal Pradesh",
    batchId: "BATCH-RB-2024-Q1-0128",
  },
  "TS-COL-004-2024": {
    code: "TS-COL-004-2024",
    name: "Colgate MaxFresh 150g",
    brand: "Colgate-Palmolive India",
    category: "Oral Care",
    sku: "COL-MXF-150-IND",
    registeredAt: "2024-03-05T07:00:00Z",
    manufacturingPlant: "Colgate Aurangabad Plant, Maharashtra",
    batchId: "BATCH-COL-2024-Q1-0310",
  },
  "TS-NES-005-2024": {
    code: "TS-NES-005-2024",
    name: "Maggi 2-Minute Noodles 70g",
    brand: "Nestlé India",
    category: "Food & Nutrition",
    sku: "MAG-2MN-70-IND",
    registeredAt: "2024-02-28T10:00:00Z",
    manufacturingPlant: "Nestlé Nanjangud Plant, Karnataka",
    batchId: "BATCH-NES-2024-Q1-0305",
  },
  "TS-GSK-006-2024": {
    code: "TS-GSK-006-2024",
    name: "Horlicks Original 500g",
    brand: "GSK Consumer Healthcare",
    category: "Health Drinks",
    sku: "HOR-ORG-500-IND",
    registeredAt: "2024-01-08T06:00:00Z",
    manufacturingPlant: "HUL Nabha Plant, Punjab",
    batchId: "BATCH-GSK-2024-Q1-0115",
  },
  "TS-TSC-007-2024": {
    code: "TS-TSC-007-2024",
    name: "Tata Tea Premium 500g",
    brand: "Tata Consumer Products",
    category: "Beverages",
    sku: "TAT-TEA-500-IND",
    registeredAt: "2024-03-12T08:30:00Z",
    manufacturingPlant: "Tata Tea Munnar Blending Unit, Kerala",
    batchId: "BATCH-TSC-2024-Q1-0320",
  },
  "TS-ITC-008-2024": {
    code: "TS-ITC-008-2024",
    name: "Classmate Notebook 200 Pages",
    brand: "ITC Limited",
    category: "Stationery",
    sku: "CLS-NB-200-IND",
    registeredAt: "2024-02-14T09:00:00Z",
    manufacturingPlant: "ITC Bhadrachalam Paper Boards, Telangana",
    batchId: "BATCH-ITC-2024-Q1-0222",
  },
};


const MANUFACTURE_NODES: Record<string, GeoCoordinate> = {
  "Personal Care": {
    lat: 20.2827,
    lng: 73.0169,
    country: "India",
    city: "Silvassa, Gujarat",
  },
  "Snacks & Beverages": {
    lat: 18.5204,
    lng: 73.8567,
    country: "India",
    city: "Pune, Maharashtra",
  },
  "Health & Hygiene": {
    lat: 31.1048,
    lng: 76.7426,
    country: "India",
    city: "Baddi, HP",
  },
  "Oral Care": {
    lat: 19.8762,
    lng: 75.3433,
    country: "India",
    city: "Aurangabad, Maharashtra",
  },
  "Food & Nutrition": {
    lat: 12.1144,
    lng: 76.6725,
    country: "India",
    city: "Nanjangud, Karnataka",
  },
  "Health Drinks": {
    lat: 30.376,
    lng: 76.1348,
    country: "India",
    city: "Nabha, Punjab",
  },
  Beverages: {
    lat: 10.0889,
    lng: 77.0595,
    country: "India",
    city: "Munnar, Kerala",
  },
  Stationery: {
    lat: 17.6688,
    lng: 80.8834,
    country: "India",
    city: "Bhadrachalam, Telangana",
  },
};

export function buildSupplyChain(
  product: ProductInfo,
  scanLocation: GeoCoordinate
): ChainEvent[] {
  const mfgLoc =
    MANUFACTURE_NODES[product.category] ?? MANUFACTURE_NODES["Food & Nutrition"];
  const base = Date.now() - 90 * 24 * 60 * 60 * 1000; // 90 days ago

  const events: ChainEvent[] = [
    {
      id: `EVT-MFG-${product.batchId}`,
      stage: "MANUFACTURE",
      location: mfgLoc,
      timestamp: new Date(base).toISOString(),
      actor: product.manufacturingPlant,
      verified: true,
      blockHash: `0x${hashString(product.batchId + "MFG")}`,
    },
    {
      id: `EVT-QC-${product.batchId}`,
      stage: "QUALITY_CHECK",
      location: mfgLoc,
      timestamp: new Date(base + 2 * 24 * 3600000).toISOString(),
      actor: `${product.brand} QA Division`,
      verified: true,
      blockHash: `0x${hashString(product.batchId + "QC")}`,
    },
    {
      id: `EVT-DIST-${product.batchId}`,
      stage: "DISTRIBUTION",
      location: { lat: 19.076, lng: 72.8777, country: "India", city: "Mumbai" },
      timestamp: new Date(base + 7 * 24 * 3600000).toISOString(),
      actor: "National Logistics Hub — JNPT Mumbai",
      verified: true,
      blockHash: `0x${hashString(product.batchId + "DIST")}`,
    },
    {
      id: `EVT-RETAIL-${product.batchId}`,
      stage: "RETAIL",
      location: scanLocation,
      timestamp: new Date(base + 14 * 24 * 3600000).toISOString(),
      actor: "Authorized Retail Partner",
      verified: true,
      blockHash: `0x${hashString(product.batchId + "RETAIL")}`,
    },
    {
      id: `EVT-SCAN-${Date.now()}`,
      stage: "SCAN",
      location: scanLocation,
      timestamp: new Date().toISOString(),
      actor: "TrueScan Consumer App",
      verified: true,
      blockHash: `0x${hashString(product.batchId + Date.now())}`,
    },
  ];

  return events;
}


function hashString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, "a").slice(0, 64);
}


export const SCAN_LOCATIONS: GeoCoordinate[] = [
  { lat: 28.6139, lng: 77.209, country: "India", city: "New Delhi" },
  { lat: 19.076, lng: 72.8777, country: "India", city: "Mumbai" },
  { lat: 12.9716, lng: 77.5946, country: "India", city: "Bengaluru" },
  { lat: 13.0827, lng: 80.2707, country: "India", city: "Chennai" },
  { lat: 17.385, lng: 78.4867, country: "India", city: "Hyderabad" },
  { lat: 22.5726, lng: 88.3639, country: "India", city: "Kolkata" },
  { lat: 23.0225, lng: 72.5714, country: "India", city: "Ahmedabad" },
  { lat: 18.5204, lng: 73.8567, country: "India", city: "Pune" },
  { lat: 26.8467, lng: 80.9462, country: "India", city: "Lucknow" },
  { lat: 21.1458, lng: 79.0882, country: "India", city: "Nagpur" },
];

export const PRODUCT_CODES = Object.keys(PRODUCT_DB);
