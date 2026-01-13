import { ListingType } from '@/lib/api';

export interface FilterSchema {
  name: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'range' | 'multiselect';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface FilterSchemaResponse {
  filters: FilterSchema[];
}

export interface RangeValue {
  min?: number;
  max?: number;
}

export type DynamicFilterValue = string | number | string[] | RangeValue;

export interface DynamicFilters {
  [key: string]: DynamicFilterValue;
}
