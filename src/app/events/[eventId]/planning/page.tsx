import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, MapPin, ArrowLeft } from "lucide-react";

export default async function GlobalPlanningPage({
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

  if (!event) return <div>Événement non trouvé</div>;

  const rooms = Array.from(new Set(event.sessions.map((s) => s.room.name))).sort();
  
  // Group sessions by time slot
  const timeSlots: { [key: string]: { [key: string]: any } } = {};
  
  event.sessions.forEach((session) => {
    const timeKey = new Date(session.startTime).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    if (!timeSlots[timeKey]) {
      timeSlots[timeKey] = {};
    }
    timeSlots[timeKey][session.room.name] = session;
  });

  const sortedTimeSlots = Object.keys(timeSlots).sort();

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href={`/events/${eventId}`}
          className="mb-10 inline-flex items-center gap-2 text-[#2ecc71] uppercase tracking-[0.3em] text-xs font-black"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'événement
        </Link>

        <h1 className="text-5xl font-black mb-4 tracking-tighter">Planning Global</h1>
        <p className="text-gray-400 mb-12">Consultez l'ensemble des sessions par salle et par horaire.</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-white/10 text-left text-gray-500 uppercase tracking-[0.2em] text-[10px]">
                  Horaire
                </th>
                {rooms.map((room) => (
                  <th
                    key={room}
                    className="p-4 border-b border-white/10 text-left text-[#2ecc71] uppercase tracking-[0.2em] text-[10px]"
                  >
                    {room}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedTimeSlots.map((time) => (
                <tr key={time} className="border-b border-white/5">
                  <td className="p-4 font-black text-sm align-top whitespace-nowrap">
                    {time}
                  </td>
                  {rooms.map((room) => {
                    const session = timeSlots[time][room];
                    return (
                      <td key={room} className="p-2 align-top min-w-[200px]">
                        {session ? (
                          <Link
                            href={`/sessions/${session.id}`}
                            className="block p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#2ecc71] transition group"
                          >
                            <h3 className="font-bold text-sm mb-2 group-hover:text-[#2ecc71]">
                              {session.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                              {session.speakers.map((s: any) => s.speaker.name).join(", ")}
                            </div>
                          </Link>
                        ) : (
                          <div className="h-full min-h-[80px] rounded-2xl border border-dashed border-white/5"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
