import * as XLSX from 'xlsx';

export interface ParsedVoter {
  name?: string;
  email: string;
  phone?: string;
  valid: boolean;
  issue?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function parseVotersFile(fileBuffer: Buffer): Promise<ParsedVoter[]> {
  try {
    // Read the file
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    if (!workbook.SheetNames.length) {
      throw new Error('No sheets found in file');
    }

    // Parse the first sheet
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(firstSheet) as any[];

    // Normalize and validate the data
    const emailSet = new Set<string>();
    
    const parsedVoters = rawData.map((row) => {
      // Find columns regardless of case
      const emailKey = Object.keys(row).find(k => k.toLowerCase().includes('email'));
      const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('name'));
      const phoneKey = Object.keys(row).find(k => k.toLowerCase().includes('phone'));

      const email = emailKey ? String(row[emailKey]).trim() : '';
      const name = nameKey ? String(row[nameKey]).trim() : '';
      const phone = phoneKey ? String(row[phoneKey]).trim() : '';

      let valid = true;
      let issue = undefined;

      // Validation Rules
      if (!email) {
        valid = false;
        issue = 'Missing Email';
      } else if (!EMAIL_REGEX.test(email)) {
        valid = false;
        issue = 'Invalid Email Format';
      } else if (emailSet.has(email.toLowerCase())) {
        valid = false;
        issue = 'Duplicate Email in file';
      }

      if (valid) {
        emailSet.add(email.toLowerCase());
      }

      return {
        email: email.toLowerCase(),
        name,
        phone,
        valid,
        issue
      };
    });

    return parsedVoters;
  } catch (error: any) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse file: ' + error.message);
  }
}
