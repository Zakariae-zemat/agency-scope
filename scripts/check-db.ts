import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [agencies, contacts, contactsWithAgency] = await Promise.all([
    prisma.agency.count(),
    prisma.contact.count(),
    prisma.contact.count({ where: { agencyId: { not: null } } }),
  ]);

  console.log('\n=== Database Statistics ===');
  console.log(`Total Agencies: ${agencies}`);
  console.log(`Total Contacts: ${contacts}`);
  console.log(`Contacts with Agency: ${contactsWithAgency}`);
  console.log(`Contacts without Agency: ${contacts - contactsWithAgency}`);
  console.log(`Percentage with Agency: ${((contactsWithAgency / contacts) * 100).toFixed(1)}%`);

  // Sample some contacts with agencies
  const samplesWithAgency = await prisma.contact.findMany({
    where: { agencyId: { not: null } },
    take: 5,
    include: { agency: { select: { name: true } } },
  });

  console.log('\n=== Sample Contacts WITH Agency ===');
  samplesWithAgency.forEach((c) => {
    console.log(`${c.firstName} ${c.lastName} -> ${c.agency?.name}`);
  });

  // Sample some contacts without agencies
  const samplesWithoutAgency = await prisma.contact.findMany({
    where: { agencyId: null },
    take: 5,
  });

  console.log('\n=== Sample Contacts WITHOUT Agency ===');
  samplesWithoutAgency.forEach((c) => {
    console.log(`${c.firstName} ${c.lastName} (no agency)`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
