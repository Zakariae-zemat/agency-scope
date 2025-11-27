'use server';

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function exportAgenciesToCSV(filters?: { search?: string; state?: string }) {
  await requireAuth();

  const where = {
    AND: [
      filters?.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' as const } },
              { county: { contains: filters.search, mode: 'insensitive' as const } },
            ],
          }
        : {},
      filters?.state ? { state: { equals: filters.state, mode: 'insensitive' as const } } : {},
    ],
  };

  const agencies = await prisma.agency.findMany({
    where,
    select: {
      name: true,
      state: true,
      stateCode: true,
      type: true,
      population: true,
      website: true,
      county: true,
      phone: true,
    },
    orderBy: { name: 'asc' },
  });

  const headers = ['Name', 'State', 'State Code', 'Type', 'Population', 'Website', 'County', 'Phone'];
  const rows = agencies.map((agency) => [
    agency.name,
    agency.state || '',
    agency.stateCode || '',
    agency.type || '',
    agency.population || '',
    agency.website || '',
    agency.county || '',
    agency.phone || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export async function exportContactsToCSV(filters?: { search?: string; agency?: string }) {
  await requireAuth();

  const where = {
    AND: [
      filters?.search
        ? {
            OR: [
              { firstName: { contains: filters.search, mode: 'insensitive' as const } },
              { lastName: { contains: filters.search, mode: 'insensitive' as const } },
              { title: { contains: filters.search, mode: 'insensitive' as const } },
              { department: { contains: filters.search, mode: 'insensitive' as const } },
            ],
          }
        : {},
      filters?.agency
        ? {
            agency: {
              name: { contains: filters.agency, mode: 'insensitive' as const },
            },
          }
        : {},
    ],
  };

  const contacts = await prisma.contact.findMany({
    where,
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      title: true,
      department: true,
      agency: {
        select: {
          name: true,
          state: true,
        },
      },
    },
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
  });

  const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Title', 'Department', 'Agency', 'State'];
  const rows = contacts.map((contact) => [
    contact.firstName,
    contact.lastName,
    contact.email || '',
    contact.phone || '',
    contact.title || '',
    contact.department || '',
    contact.agency?.name || '',
    contact.agency?.state || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}
