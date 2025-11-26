import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

interface AgencyRow {
  id: string;
  name: string;
  state?: string;
  state_code?: string;
  type?: string;
  population?: string;
  website?: string;
  total_schools?: string;
  total_students?: string;
  mailing_address?: string;
  grade_span?: string;
  locale?: string;
  csa_cbsa?: string;
  domain_name?: string;
  physical_address?: string;
  phone?: string;
  status?: string;
  student_teacher_ratio?: string;
  supervisory_union?: string;
  county?: string;
  created_at?: string;
  updated_at?: string;
}

interface ContactRow {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  title?: string;
  email_type?: string;
  contact_form_url?: string;
  department?: string;
  agency_id?: string;
  firm_id?: string;
  created_at?: string;
  updated_at?: string;
}

function parseFloat(value: string | undefined): number | null {
  if (!value || value.trim() === '') return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

function parseInt(value: string | undefined): number | null {
  if (!value || value.trim() === '') return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

async function readCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: T) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function main() {
  console.log('Starting database seed...\n');

  // Clear existing data
  console.log('Cleaning existing data...');
  await prisma.contactView.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.user.deleteMany();
  console.log('Existing data cleared\n');

  // Import agencies
  console.log('Importing agencies...');
  const agenciesPath = path.join(process.cwd(), 'prisma/data/agencies_agency_rows.csv');
  const agencyRows = await readCSV<AgencyRow>(agenciesPath);
  
  let agenciesImported = 0;
  const agencyIdMap = new Map<string, string>();

  for (const row of agencyRows) {
    try {
      const agency = await prisma.agency.create({
        data: {
          id: row.id,
          name: row.name,
          state: row.state || null,
          stateCode: row.state_code || null,
          type: row.type || null,
          population: parseInt(row.population),
          website: row.website || null,
          totalSchools: parseInt(row.total_schools),
          totalStudents: parseInt(row.total_students),
          mailingAddress: row.mailing_address || null,
          gradeSpan: row.grade_span || null,
          locale: row.locale || null,
          csaCbsa: row.csa_cbsa || null,
          domainName: row.domain_name || null,
          physicalAddress: row.physical_address || null,
          phone: row.phone || null,
          status: row.status || null,
          studentTeacherRatio: parseFloat(row.student_teacher_ratio),
          supervisoryUnion: row.supervisory_union || null,
          county: row.county || null,
        },
      });
      agencyIdMap.set(row.id, agency.id);
      agenciesImported++;
    } catch (error) {
      console.error(`Error importing agency ${row.name}:`, error);
    }
  }
  console.log(`Imported ${agenciesImported}/${agencyRows.length} agencies\n`);

  // Import contacts
  console.log('Importing contacts...');
  const contactsPath = path.join(process.cwd(), 'prisma/data/contacts_contact_rows.csv');
  const contactRows = await readCSV<ContactRow>(contactsPath);
  
  let contactsImported = 0;
  let contactsWithoutAgency = 0;

  for (const row of contactRows) {
    try {
      // Check if agency exists
      const agencyId = row.agency_id && agencyIdMap.has(row.agency_id) 
        ? row.agency_id 
        : null;

      if (!agencyId && row.agency_id) {
        contactsWithoutAgency++;
      }

      await prisma.contact.create({
        data: {
          id: row.id,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email || null,
          phone: row.phone || null,
          title: row.title || null,
          emailType: row.email_type || null,
          contactFormUrl: row.contact_form_url || null,
          department: row.department || null,
          agencyId: agencyId,
          firmId: row.firm_id || null,
        },
      });
      contactsImported++;
    } catch (error) {
      console.error(`Error importing contact ${row.first_name} ${row.last_name}:`, error);
    }
  }
  
  console.log(`Imported ${contactsImported}/${contactRows.length} contacts`);
  console.log(`  ${contactsWithoutAgency} contacts without matching agency (handled gracefully)\n`);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
