import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.room.createMany({
    data: [
      { name: "Room A" },
      { name: "Room B" },
    ],
    skipDuplicates: true,
  });

  const roomA = await prisma.room.findFirst({ where: { name: "Room A" } });
  const roomB = await prisma.room.findFirst({ where: { name: "Room B" } });

  const event = await prisma.event.create({
    data: {
      title: "Tech Conference 2026",
      description: "Event de test pour EventSync",
      location: "Antananarivo",
      startDate: new Date("2026-06-01T09:00:00Z"),
      endDate: new Date("2026-06-01T18:00:00Z"),
    },
  });

  const speaker = await prisma.speaker.create({
    data: {
      name: "John Doe",
      bio: "Backend Engineer",
      photoUrl: null,
      socialLinks: {},
    },
  });

  const session1 = await prisma.session.create({
    data: {
      title: "Intro Next.js",
      description: "Session d'introduction",
      startTime: new Date("2026-06-01T09:00:00Z"),
      endTime: new Date("2026-06-01T10:00:00Z"),
      capacity: 100,
      eventId: event.id,
      roomId: roomA!.id,
    },
  });

  const session2 = await prisma.session.create({
    data: {
      title: "Prisma Deep Dive",
      description: "ORM avancé",
      startTime: new Date("2026-06-01T10:30:00Z"),
      endTime: new Date("2026-06-01T12:00:00Z"),
      capacity: 80,
      eventId: event.id,
      roomId: roomB!.id,
    },
  });

  await prisma.speakerSession.createMany({
    data: [
      {
        speakerId: speaker.id,
        sessionId: session1.id,
      },
      {
        speakerId: speaker.id,
        sessionId: session2.id,
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        content: "C'est quoi Next.js App Router ?",
        author: "User1",
        sessionId: session1.id,
        votes: 3,
      },
      {
        content: "Prisma est-il mieux que Sequelize ?",
        author: "User2",
        sessionId: session2.id,
        votes: 5,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });