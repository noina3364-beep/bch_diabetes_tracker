export const COLUMN_MAPPING: Record<string, string[]> = {
  hn: ['hn', 'patient identifier', 'id', 'hn_no'],
  name: ['name', 'patient name', 'fullname', 'ชื่อ'],
  age: ['age', 'อายุ'],
  doctor: ['doctor', 'physician', 'doc', 'แพทย์'],
  location: ['location', 'unit', 'ward', 'site', 'หน่วยงาน'],
  date: ['date', 'visit date', 'collected date', 'วันที่'],
  hba1c: ['hba1c', 'hb a1c', 'hemoglobin a1c'],
  egfr: ['egfr', 'e gfr', 'estimated gfr'],
  ldl: ['ldl', 'ldl-c', 'ldl cholesterol'],
  foot: ['foot', 'foot exam', 'เท้า'],
  eye: ['eye', 'eye exam', 'ตา'],
  den: ['den', 'dental', 'dental exam', 'ฟัน'],
  fu: ['fu', 'follow up', 'followup', 'ติดตาม'],
};

export const TERMINAL_VALUES = ['', 'null', '-', 'x', 'none'];

export const CATEGORY_COLORS = {
  Normal: '#10b981', // green-500
  Abnormal: '#ef4444', // red-500
  'No Data': '#94a3b8', // slate-400
};
