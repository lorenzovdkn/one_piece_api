import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.character.deleteMany();
  await prisma.affiliation.deleteMany();
  await prisma.users.deleteMany();

  // Reset auto increment
  await prisma.$executeRaw `DELETE FROM sqlite_sequence where name='character'`;
  await prisma.$executeRaw `DELETE FROM sqlite_sequence where name='affiliation'`;
  await prisma.$executeRaw `DELETE FROM sqlite_sequence where name='users'`;

  const affiliations = await prisma.affiliation.createMany({
    data: [
      { name: 'Straw Hat Pirates' },
      { name: 'Baggy\'s Delivery'}
    ],
  });

  console.log('Affiliations créées.');

  const strawHat = await prisma.affiliation.findUnique({
    where: { name: 'Straw Hat Pirates'},
  });

  const baggyDelivery = await prisma.affiliation.findUnique({
    where: { name: 'Baggy\'s Delivery' },
  });

  const characters = await prisma.character.createMany({
    data: [
      {
        name: 'Monkey D. Luffy',
        affiliationId: strawHat!.id,
        lifePoints: 1000,
        size: 1.74,
        age: 19,
        weight: 70,
        imageUrl: '',
      },
      {
        name: 'Baggy',
        affiliationId: baggyDelivery!.id,
        lifePoints: 500,
        size: 1.92,
        age: 39,
        weight: 50,
        imageUrl: '',
      }
    ],
  });

  console.log('Personnages créés.');

  const user = await prisma.users.createMany({
    data:[
      { email : 'admin@gmail.com', password: 'admin'},
    ]
  })

  console.log('Admin user created')

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
