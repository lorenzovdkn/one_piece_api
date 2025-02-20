import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  await prisma.character.deleteMany();
  await prisma.affiliation.deleteMany();
  await prisma.users.deleteMany();
  await prisma.deck.deleteMany();

  // Reset auto increment
  await prisma.$executeRaw `DELETE FROM sqlite_sequence where name='character'`;
  await prisma.$executeRaw `DELETE FROM sqlite_sequence where name='affiliation'`;
  await prisma.$executeRaw `DELETE FROM sqlite_sequence where name='users'`;
  await prisma.$executeRaw `DELETE FROM sqlite_sequence where name='deck'`;

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
        name: 'Zoro',
        affiliationId: strawHat!.id,
        lifePoints: 950,
        size: 1.78,
        age: 21,
        weight: 85,
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

  const passwordCrypted = await bcrypt.hash('admin', saltRounds);
  
  const user = await prisma.users.createMany({
    data:[
      { email : 'admin@gmail.com', password: passwordCrypted}
    ]
  })

  console.log('Admin user created')

  const adminUser = await prisma.users.findUnique({
    where: { email: 'admin@gmail.com' },
  });

  const luffy = await prisma.character.findUnique({
    where: { name: 'Monkey D. Luffy' },
  });

  const baggy = await prisma.character.findUnique({
    where: { name: 'Baggy' },
  });

  const zoro = await prisma.character.findUnique({
    where: { name: 'Zoro' },
  });

  // Création d'un deck et association des personnages
  await prisma.deck.create({
    data: {
      name: 'Favorite Deck',
      owner: { connect: { id: adminUser!.id } },
      characters: { connect: [{ id: luffy!.id }, { id: baggy!.id }, { id : zoro!.id }] },
    },
  });

  await prisma.deck.create({
    data: {
      name: 'Samurai Deck',
      owner: { connect: { id: adminUser!.id } },
      characters: { connect: [{ id: zoro!.id }] },
    },
  });

  console.log('Deck créé.');
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
