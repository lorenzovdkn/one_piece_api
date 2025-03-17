import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Définition des personnages avec leurs images locales, affiliations et primes
const MAX_INT = 2147483647; // Valeur max d'un Int en Prisma (SQLite, PostgreSQL, MySQL)
const BASE_IMAGE_URL = "http://localhost:3000/images/"; // URL publique pour accéder aux images

const charactersData = [
  {
    name: "Monkey D. Luffy",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(1500000000, MAX_INT),
    size: 1.74,
    age: 19,
    weight: 64,
    image: "luffy.png",
  },
  {
    name: "Roronoa Zoro",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(320000000, MAX_INT),
    size: 1.81,
    age: 21,
    weight: 85,
    image: "zoro.png",
  },
  {
    name: "Nami",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(66000000, MAX_INT),
    size: 1.7,
    age: 20,
    weight: 58,
    image: "nami.png",
  },
  {
    name: "Usopp",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(200000000, MAX_INT),
    size: 1.76,
    age: 19,
    weight: 65,
    image: "usopp.png",
  },
  {
    name: "Sanji",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(330000000, MAX_INT),
    size: 1.8,
    age: 21,
    weight: 69,
    image: "sanji.png",
  },
  {
    name: "Tony Tony Chopper",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(100, MAX_INT),
    size: 0.9,
    age: 17,
    weight: 20,
    image: "chopper.png",
  },
  {
    name: "Nico Robin",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(130000000, MAX_INT),
    size: 1.88,
    age: 30,
    weight: 62,
    image: "robin.png",
  },
  {
    name: "Franky",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(94000000, MAX_INT),
    size: 2.4,
    age: 36,
    weight: 300,
    image: "franky.png",
  },
  {
    name: "Brook",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(83000000, MAX_INT),
    size: 2.77,
    age: 90,
    weight: 0,
    image: "brook.png",
  },
  {
    name: "Jinbe",
    affiliation: "Straw Hat Pirates",
    bounty: Math.min(438000000, MAX_INT),
    size: 3.01,
    age: 46,
    weight: 275,
    image: "jinbe.png",
  },
  {
    name: "Boa Hancock",
    affiliation: "Kuja Pirates",
    bounty: Math.min(800000000, MAX_INT),
    size: 1.91,
    age: 31,
    weight: 61,
    image: "boa_hancock.png",
  },
  {
    name: "Shanks",
    affiliation: "Red Hair Pirates",
    bounty: Math.min(4048900000, MAX_INT),
    size: 1.99,
    age: 39,
    weight: 82,
    image: "shanks.png",
  },
];

async function main() {
  console.log("🧹 Nettoyage de la base de données...");
  await prisma.character.deleteMany();
  await prisma.affiliation.deleteMany();
  await prisma.users.deleteMany();

  console.log("🚀 Création des affiliations...");
  const affiliations: Record<string, number> = {};
  for (const character of charactersData) {
    if (!affiliations[character.affiliation]) {
      const affiliation = await prisma.affiliation.create({
        data: { name: character.affiliation },
      });
      affiliations[character.affiliation] = affiliation.id;
    }
  }

  console.log("✨ Ajout des personnages...");
  for (const character of charactersData) {
    await prisma.character.create({
      data: {
        name: character.name,
        affiliationId: affiliations[character.affiliation],
        lifePoints: character.bounty,
        size: character.size,
        age: character.age,
        weight: character.weight,
        imageUrl: `${BASE_IMAGE_URL}${character.image}`,
      },
    });
    console.log(`✅ Ajouté : ${character.name}`);
  }

  console.log("👤 Ajout de l'utilisateur admin...");
  await prisma.users.create({
    data: {
      email: "admin@gmail.com",
      password: "admin",
    },
  });
  console.log("✅ Utilisateur admin ajouté avec succès !");

  console.log("🎉 Personnages et utilisateur admin ajoutés avec succès !");
}

main()
  .catch((error) => console.error("❌ Erreur principale :", error))
  .finally(() => prisma.$disconnect());
