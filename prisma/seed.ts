import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("admin123", saltRounds);

  await prisma.questionVote.deleteMany();
  await prisma.question.deleteMany();
  await prisma.speakerSession.deleteMany();
  await prisma.session.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.room.deleteMany();
  await prisma.event.deleteMany();
  await prisma.admin.deleteMany();

  await prisma.admin.create({
    data: {
      email: "admin@eventsync.com",
      password: hashedPassword,
    },
  });

  const rooms = await Promise.all([
    prisma.room.create({ data: { name: "Grande Aula" } }),
    prisma.room.create({ data: { name: "Salle Prototype" } }),
    prisma.room.create({ data: { name: "Lab Digital" } }),
    prisma.room.create({ data: { name: "Open Space A" } }),
    prisma.room.create({ data: { name: "Auditorium" } }),
  ]);

  const speakers = await Promise.all([
    prisma.speaker.create({
      data: {
        name: "Alice Freeman",
        bio: "Senior Architect chez Global Cloud Solutions.",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
        socialLinks: { twitter: "@alice_arch", linkedin: "alice-freeman" },
      },
    }),
    prisma.speaker.create({
      data: {
        name: "Bob Martin",
        bio: "Consultant en Clean Code et auteur de plusieurs ouvrages techniques.",
        photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
        socialLinks: { twitter: "@unclebob", website: "https://cleancoder.com" },
      },
    }),
    prisma.speaker.create({
      data: {
        name: "Carla Diaz",
        bio: "Lead Designer spécialisée dans les interfaces futuristes.",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
        socialLinks: { instagram: "@carla_design" },
      },
    }),
    prisma.speaker.create({
      data: {
        name: "Dan Wilson",
        bio: "Expert en cybersécurité et hacking éthique.",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
        socialLinks: { github: "danwilson-sec" },
      },
    }),
  ]);

  
  const today = new Date("2026-05-05T00:00:00Z");

  const eventLive = await prisma.event.create({
    data: {
      title: "EventSync Live Demo Day",
      description: "L'événement de lancement en direct pour tester toutes les fonctionnalités de la plateforme. Posez vos questions, votez et naviguez !",
      location: "HEI Antananarivo & En Ligne",
      imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200",
      startDate: today,
      endDate: new Date("2026-05-06T18:00:00Z"),
    },
  });

  const eventFuture = await prisma.event.create({
    data: {
      title: "Next.js Conf 2026",
      description: "La conférence annuelle sur l'écosystème Next.js. Préparez-vous pour le futur du Web.",
      location: "San Francisco, USA",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200",
      startDate: new Date("2026-10-20T09:00:00Z"),
      endDate: new Date("2026-10-22T17:00:00Z"),
    },
  });

  const eventPast = await prisma.event.create({
    data: {
      title: "DevFest 2025",
      description: "Retour sur les moments forts du DevFest de l'année dernière.",
      location: "Lyon, France",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200",
      startDate: new Date("2025-11-15T08:00:00Z"),
      endDate: new Date("2025-11-16T18:00:00Z"),
    },
  });


  await prisma.session.create({
    data: {
      title: "Ouverture & Keynote",
      description: "Cérémonie d'ouverture et présentation des nouveautés.",
      startTime: new Date("2026-05-05T08:00:00Z"),
      endTime: new Date("2026-05-05T09:30:00Z"),
      capacity: 500,
      eventId: eventLive.id,
      roomId: rooms[0].id,
      speakers: { create: [{ speakerId: speakers[0].id }] },
    },
  });

  const now = new Date();
  const startTimeLive = new Date("2026-05-05T10:00:00Z"); // Adjusted to be "live" during demo if current time is around midday
  const endTimeLive = new Date("2026-05-05T18:00:00Z");

  const sLive = await prisma.session.create({
    data: {
      title: "Démonstration Interactive en Direct",
      description: "Une session conçue pour tester le système de Q&A. Posez vos questions ici !",
      startTime: startTimeLive,
      endTime: endTimeLive,
      capacity: 200,
      eventId: eventLive.id,
      roomId: rooms[1].id,
      speakers: { create: [{ speakerId: speakers[1].id }, { speakerId: speakers[2].id }] },
    },
  });

  await prisma.session.create({
    data: {
      title: "Atelier Cybersécurité",
      description: "Apprenez à sécuriser vos applications en temps réel.",
      startTime: new Date("2026-05-05T14:00:00Z"),
      endTime: new Date("2026-05-05T16:00:00Z"),
      capacity: 30,
      eventId: eventLive.id,
      roomId: rooms[2].id,
      speakers: { create: [{ speakerId: speakers[3].id }] },
    },
  });

  console.log("💬 Ajout des questions et votes...");
  const q1 = await prisma.question.create({
    data: {
      content: "Peut-on poser des questions sans être connecté ?",
      author: "Curieux_99",
      votes: 15,
      sessionId: sLive.id,
    },
  });

  const q2 = await prisma.question.create({
    data: {
      content: "Est-ce que l'anonymat est vraiment garanti ?",
      author: null, // Anonyme
      votes: 8,
      sessionId: sLive.id,
    },
  });

  const q3 = await prisma.question.create({
    data: {
      content: "Quelles sont les prochaines évolutions de la plateforme ?",
      author: "Admin_Test",
      votes: 3,
      sessionId: sLive.id,
    },
  });

  await prisma.questionVote.createMany({
    data: [
      { questionId: q1.id, userId: "user_fake_1" },
      { questionId: q1.id, userId: "user_fake_2" },
      { questionId: q2.id, userId: "user_fake_1" },
    ],
  });

  console.log(`
🚀 SEED TERMINÉ AVEC SUCCÈS !
--------------------------------------
Admin Email: admin@eventsync.com
Admin Password: admin123
Événement Live: ${eventLive.title}
--------------------------------------
`);
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
