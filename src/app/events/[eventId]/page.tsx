import { prisma } from "@/lib/prisma";
import { Calendar, Clock, MapPin, Users, User, Star, LayoutGrid, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // Revalidate every minute to update "Live" status

export default async function EventDetail({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      sessions: {
        include: {
          room: true,
          speakers: {
            include: {
              speaker: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
      },
    },
  });

  if (!event) return notFound();

  const isLive = (session: any) => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* HEADER */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <span className="text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                ÉVÉNEMENT
              </span>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter max-w-4xl">
                {event.title}
              </h1>
            </div>

            <Link
              href={`/events/${eventId}/planning`}
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#2ecc71] transition duration-300"
            >
              <LayoutGrid className="w-5 h-5 text-[#2ecc71]" />
              <span className="font-black uppercase text-[10px] tracking-widest">Voir le planning global</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#2ecc71]" />
              <span>
                {new Date(event.startDate).toLocaleDateString('fr-FR')} -{" "}
                {new Date(event.endDate).toLocaleDateString('fr-FR')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#2ecc71]" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="mt-10 text-xl text-gray-400 max-w-4xl leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2ecc71]/10 blur-[150px] rounded-full -mr-64 -mt-64"></div>
      </div>

      {/* SESSIONS */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-black tracking-tight">
            Programme des sessions
          </h2>
          <span className="text-gray-500 font-black uppercase text-[10px] tracking-widest">
            {event.sessions.length} Sessions programmées
          </span>
        </div>

        <div className="grid gap-6">
          {event.sessions.map((session) => {
            const live = isLive(session);

            return (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className={`group block bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 transition duration-500 hover:border-[#2ecc71]/50 ${
                  live ? "ring-2 ring-[#2ecc71] bg-[#2ecc71]/5" : ""
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                      {live && (
                        <span className="bg-[#2ecc71] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                          En direct
                        </span>
                      )}

                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <Clock className="w-5 h-5 text-[#2ecc71]" />
                        {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -
                        {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <MapPin className="w-5 h-5 text-[#2ecc71]" />
                        {session.room.name}
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold mb-6 group-hover:text-[#2ecc71] transition duration-500">
                      {session.title}
                    </h3>

                    <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2ecc71]" />
                        {session.capacity || "Illimitée"}
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#2ecc71]" />
                        {session.speakers.map(s => s.speaker.name).join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full group-hover:bg-[#2ecc71] group-hover:text-black transition duration-500">
                      <ArrowRight className="w-6 h-6" />
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
