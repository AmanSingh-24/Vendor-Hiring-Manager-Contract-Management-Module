import { PrismaClient, OpeningStatus, Role, AuthProvider } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Find an existing Hiring Manager
  let hiringManager = await prisma.user.findFirst({
    where: { role: Role.HIRING_MANAGER },
  });

  let tenant;

  if (hiringManager) {
    console.log(`Found existing Hiring Manager: ${hiringManager.email} with ID: ${hiringManager.id}`);
    tenant = await prisma.tenants.findUnique({
      where: { tenantId: hiringManager.tenantId },
    });
    
    if (!tenant) {
      tenant = await prisma.tenants.create({
        data: {
          tenantId: hiringManager.tenantId,
          companyName: 'Bruce Wayne Corp (Recovered)',
        },
      });
    }
  } else {
    // 1. Create the tenant "Bruce Wayne Corp"
    tenant = await prisma.tenants.create({
      data: {
        companyName: 'Bruce Wayne Corp',
      },
    });
    console.log(`Created Tenant: ${tenant.companyName} with ID: ${tenant.tenantId}`);

    // 2. Create a Hiring Manager user for this tenant to own the openings
    hiringManager = await prisma.user.create({
      data: {
        email: 'hiringmanager@brucewayne.corp',
        username: 'bruce_hm',
        firstName: 'Bruce',
        lastName: 'Wayne',
        role: Role.HIRING_MANAGER,
        tenantId: tenant.tenantId,
        provider: AuthProvider.KEYCLOAK,
        profileComplete: true,
      },
    });
    console.log(`Created Hiring Manager: ${hiringManager.email} with ID: ${hiringManager.id}`);
  }

  // 3. Create at least 12 openings with varying parameters
  const openingsData = [
    { title: 'Senior Software Engineer', expMin: 5, expMax: 8, location: 'Remote', contractType: 'C2H' },
    { title: 'Junior Frontend Developer', expMin: 1, expMax: 3, location: 'Onsite', contractType: 'Contract' },
    { title: 'Cloud Architect', expMin: 8, expMax: 12, location: 'Remote', contractType: 'Contract' },
    { title: 'DevOps Engineer', expMin: 4, expMax: 7, location: 'Hybrid', contractType: 'Full-time' },
    { title: 'Data Scientist', expMin: 3, expMax: 6, location: 'Remote', contractType: 'C2H' },
    { title: 'Product Manager', expMin: 5, expMax: 10, location: 'Onsite', contractType: 'Full-time' },
    { title: 'UX Designer', expMin: 2, expMax: 5, location: 'Remote', contractType: 'Contract' },
    { title: 'Quality Assurance Engineer', expMin: 2, expMax: 4, location: 'Hybrid', contractType: 'C2H' },
    { title: 'Backend Developer (Node.js)', expMin: 3, expMax: 6, location: 'Remote', contractType: 'Contract' },
    { title: 'Security Consultant', expMin: 6, expMax: 10, location: 'Onsite', contractType: 'Contract' },
    { title: 'Machine Learning Engineer', expMin: 4, expMax: 8, location: 'Remote', contractType: 'Full-time' },
    { title: 'IT Support Specialist', expMin: 1, expMax: 3, location: 'Onsite', contractType: 'Contract' },
  ];

  for (const op of openingsData) {
    await prisma.opening.create({
      data: {
        tenantId: tenant.tenantId,
        title: op.title,
        description: `We are looking for a skilled ${op.title} to join our team.`,
        location: op.location,
        contractType: op.contractType,
        hiringManagerId: hiringManager.id,
        experienceMin: op.expMin,
        experienceMax: op.expMax,
        status: OpeningStatus.OPEN,
      },
    });
  }

  console.log(`Successfully seeded ${openingsData.length} openings for Bruce Wayne Corp.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
