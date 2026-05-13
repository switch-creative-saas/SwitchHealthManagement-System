/** Cross-module integration — EMR, Lab, Pharmacy, Telemedicine */

export const SENTINEL_CLINICAL_EVENT = 'switch-health:sentinel-clinical';
export const SENTINEL_LAB_EVENT = 'switch-health:sentinel-lab';
export const SENTINEL_PHARMACY_EVENT = 'switch-health:sentinel-pharmacy';

export interface SentinelClinicalPayload {
  patientSwitchId: string;
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  facilityName?: string;
  state?: string;
  lga?: string;
}

export interface SentinelLabPayload {
  orderId: string;
  patientName: string;
  tests: { name: string; value: string; interpretation?: string; flaggedPositive?: boolean }[];
  state?: string;
  lga?: string;
}

export interface SentinelPharmacyPayload {
  itemName: string;
  sku?: string;
  quantityInStock: number;
  reorderLevel: number;
  facilityName?: string;
}
