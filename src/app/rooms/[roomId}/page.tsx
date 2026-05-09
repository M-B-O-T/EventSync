import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, User, ArrowLeft } from "lucide-react";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      sessions: {
        include: {
          speakers: {
            include: {
              speaker: true,
            },
          },
          event: true,
        },
        orderBy: {
          startTime: "asc",
        },
      },
    },
  });

  if (!room) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Salle non trouvée</div>;

  const isLive = (session: any) => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/events"
          className="mb-10 inline-flex items-center gap-2 text-[#2ecc71] uppercase tracking-[0.3em] text-xs font-black"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux événements
        </Link>

        <div className="mb-16">
          <span className="text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
            SALLE
          </span>
          <h1 className="text-5xl font-black tracking-tighter">{room.name}</h1>
          <p className="text-gray-400 mt-4">Planning complet pour cette salle.</p>
        </div>

        <div className="space-y-6">
          {room.sessions.length === 0 && (
            <p className="text-gray-500 text-center py-20 bg-white/5 border border-white/10 rounded-[40px]">
              Aucune session programmée dans cette salle.
            </p>
          )}
          {room.sessions.map((session) => {
            const live = isLive(session);
            return (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className={`group block bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-[#2ecc71] transition ${
                  live ? "ring-2 ring-[#2ecc71] bg-[#2ecc71]/5" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <Clock className="w-4 h-4 text-[#2ecc71]" />
                        {new Date(session.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {new Date(session.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {live && (
                        <span className="px-3 py-1 bg-[#2ecc71] text-black text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                          Live
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-4 group-hover:text-[#2ecc71] transition">
                      {session.title}
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <User className="w-4 h-4 text-[#2ecc71]" />
                      {session.speakers.map((s: any) => s.speaker.name).join(", ")}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition">
                      {session.event.title}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
