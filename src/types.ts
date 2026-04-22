export interface PatientRecord {
  hn: string;
  name?: string;
  age?: number;
  doctor?: string;
  location?: string;
  date: Date;
  hba1c?: number;
  egfr?: number;
  ldl?: number;
  foot?: string; // 'yes', 'no', or missing
  eye?: string; // 'yes', 'no', or missing
  den?: string; // 'yes', 'no', or missing
  fu?: string; // 'yes', 'no', or missing
  [key: string]: any;
}

export interface NormalizedPatient {
  hn: string;
  name: string;
  age: string;
  doctor: string;
  location: string;
  date: Date;
  hba1c: number | null;
  egfr: number | null;
  ldl: number | null;
  foot: boolean | null;
  eye: boolean | null;
  den: boolean | null;
  fu: Date | null;
  has_hba1c: boolean;
  has_egfr: boolean;
  has_ldl: boolean;
  has_foot: boolean;
  has_eye: boolean;
  has_den: boolean;
  has_fu: boolean;
  is_complete: boolean;
  hba1c_category: 'Normal' | 'Abnormal' | 'No Data';
  egfr_category: 'Normal' | 'Abnormal' | 'No Data';
}

export interface DashboardMetrics {
  totalPatients: number;
  hba1cCoverage: number;
  egfrCoverage: number;
  ldlCoverage: number;
  screeningCoverage: number; // avg of Foot + Eye
  dentalCoverage: number;
  hba1cDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  missingItems: {
    field: string;
    count: number;
  }[];
}
