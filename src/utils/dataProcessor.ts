import * as XLSX from 'xlsx';
import { COLUMN_MAPPING, TERMINAL_VALUES } from '../constants';
import { NormalizedPatient, PatientRecord } from '../types';
import { parseISO, isValid } from 'date-fns';

export function parseExcel(file: ArrayBuffer): PatientRecord[] {
  const workbook = XLSX.read(file, { type: 'array' });
  const sheetName = workbook.SheetNames.includes('dm') 
    ? 'dm' 
    : workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

  return jsonData.map(row => {
    const record: any = {};
    const keys = Object.keys(row);

    for (const [standardKey, options] of Object.entries(COLUMN_MAPPING)) {
      const sourceKey = keys.find(k => 
        (options as string[]).includes(k.toLowerCase().trim())
      );
      if (sourceKey) {
        record[standardKey] = row[sourceKey];
      }
    }
    return record as PatientRecord;
  });
}

function parseNumeric(val: any): number | null {
  if (val === undefined || val === null) return null;
  const s = String(val).toLowerCase().trim();
  if (TERMINAL_VALUES.includes(s)) return null;
  const num = parseFloat(s);
  return isNaN(num) ? null : num;
}

function parseBoolean(val: any): boolean | null {
  if (val === undefined || val === null) return null;
  const s = String(val).toLowerCase().trim();
  if (TERMINAL_VALUES.includes(s)) return null;
  if (['yes', 'y', '1', 'true', 'done', 'checked'].includes(s)) return true;
  if (['no', 'n', '0', 'false', 'not done'].includes(s)) return false;
  return null;
}

function parseDate(val: any): Date {
  if (!val) return new Date(0);
  if (val instanceof Date) return val;
  
  // Excel numeric date
  if (typeof val === 'number') {
    return XLSX.SSF.parse_date_code(val) as unknown as Date; // This is a bit rough but works for XLSX type
  }

  const d = parseISO(String(val));
  return isValid(d) ? d : new Date(0);
}

function parseOptionalDate(val: any): Date | null {
  if (!val || TERMINAL_VALUES.includes(String(val).toLowerCase().trim())) return null;
  if (val instanceof Date) return val;
  
  if (typeof val === 'number') {
    try {
      const d = XLSX.SSF.parse_date_code(val);
      return new Date(d.y, d.m - 1, d.d);
    } catch {
      return null;
    }
  }

  const d = parseISO(String(val));
  return isValid(d) ? d : null;
}

export function normalizeData(records: PatientRecord[]): NormalizedPatient[] {
  const patientsMap = new Map<string, PatientRecord>();

  // Group by HN and take latest
  records.forEach(record => {
    if (!record.hn) return;
    const hn = String(record.hn).trim();
    const date = parseDate(record.date);
    const existing = patientsMap.get(hn);
    
    if (!existing || date > parseDate(existing.date)) {
      patientsMap.set(hn, { ...record, date });
    }
  });

  return Array.from(patientsMap.values()).map(record => {
    const hba1c = parseNumeric(record.hba1c);
    const egfr = parseNumeric(record.egfr);
    const ldl = parseNumeric(record.ldl);
    const foot = parseBoolean(record.foot);
    const eye = parseBoolean(record.eye);
    const den = parseBoolean(record.den);
    const fu = parseOptionalDate(record.fu);

    const has_hba1c = hba1c !== null;
    const has_egfr = egfr !== null;
    const has_ldl = ldl !== null;
    const has_foot = foot === true;
    const has_eye = eye === true;
    const has_den = den === true;
    const has_fu = fu !== null;

    // Strict completeness: HbA1c, eGFR, LDL, Foot, Eye
    const is_complete = has_hba1c && has_egfr && has_ldl && has_foot && has_eye;

    let hba1c_category: NormalizedPatient['hba1c_category'] = 'No Data';
    if (hba1c !== null) {
      if (hba1c < 7) hba1c_category = 'Normal';
      else hba1c_category = 'Abnormal';
    }

    let egfr_category: NormalizedPatient['egfr_category'] = 'No Data';
    if (egfr !== null) {
      if (egfr >= 60) egfr_category = 'Normal';
      else egfr_category = 'Abnormal';
    }

    return {
      hn: String(record.hn),
      name: record.name ? String(record.name) : '-',
      age: record.age ? String(record.age) : '-',
      doctor: record.doctor ? String(record.doctor) : 'Unassigned',
      location: record.location ? String(record.location) : 'Main',
      date: record.date as Date,
      hba1c,
      egfr,
      ldl,
      foot,
      eye,
      den,
      fu,
      has_hba1c,
      has_egfr,
      has_ldl,
      has_foot,
      has_eye,
      has_den,
      has_fu,
      is_complete,
      hba1c_category,
      egfr_category,
    };
  });
}
