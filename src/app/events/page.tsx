import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowRight, Search, Calendar } from "lucide-react";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      _count: {
        select: {
          sessions: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  const now = new Date();

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-20">
          <span className="text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">
            DÉCOUVREZ
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8">
            EventSync
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            La plateforme dynamique pour naviguer dans vos événements et interagir en direct avec les sessions.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {events.map((event) => {
            const isPast = new Date(event.endDate) < now;
            const isOngoing = new Date(event.startDate) <= now && new Date(event.endDate) >= now;

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group relative bg-white/5 border border-white/10 rounded-[48px] overflow-hidden hover:border-[#2ecc71]/50 transition duration-500"
              >
                <div className="p-10 md:p-14">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex flex-col gap-2">
                      {isOngoing && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2ecc71] text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                          <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
                          En cours
                        </span>
                      )}
                      {isPast && (
                        <span className="inline-flex items-center px-4 py-1.5 bg-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full w-fit">
                          Terminé
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                      {event._count.sessions} Sessions
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 group-hover:text-[#2ecc71] transition duration-500">
                    {event.title}
                  </h2>

                  <p className="text-gray-400 text-lg mb-10 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">
                      <Calendar className="w-5 h-5 text-[#2ecc71]" />
                      {new Date(event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">
                      <MapPin className="w-5 h-5 text-[#2ecc71]" />
                      {event.location}
                    </div>
                  </div>

                  <div className="mt-14 flex items-center gap-4 text-[#2ecc71] font-black uppercase text-xs tracking-widest group-hover:translate-x-2 transition duration-500">
                    Explorer le programme <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ecc71]/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>
              </Link>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-[48px]">
            <p className="text-gray-500 text-xl">Aucun événement n'est programmé pour le moment.</p>
          </div>
        )}

      </div>
    </div>
  );
}
