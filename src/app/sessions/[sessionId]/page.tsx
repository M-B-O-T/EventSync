import { prisma } from "@/lib/prisma";
import { Clock, MapPin, Users, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import QuestionList from "@/components/QuestionList";
import { notFound } from "next/navigation";
import FavoriteButton from "./FavoriteButton";

export const revalidate = 60;
export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      event: true,
      room: true,
      speakers: {
        include: {
          speaker: true,
        },
      },
      questions: {
        orderBy: {
          votes: "desc",
        },
      },
    },
  });

  if (!session) {
    return notFound();
  }

  const isLive = () => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  };

  const live = isLive();

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href={`/events/${session.eventId}`}
          className="mb-10 inline-flex items-center gap-2 text-[#2ecc71] uppercase tracking-[0.3em] text-xs font-black"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au programme
        </Link>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-[32px] p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#2ecc71] uppercase text-[10px] tracking-[0.3em] font-black">
                  SESSION
                </span>
                {live && (
                  <span className="bg-[#2ecc71] text-black px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                    LIVE
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                {session.title}
              </h1>
            </div>
            
            <FavoriteButton sessionId={session.id} />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">
              <p className="text-gray-300 text-lg leading-relaxed mb-8">{session.description}</p>

              <div className="space-y-4 text-xs uppercase tracking-[0.2em] text-gray-400 font-black">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2ecc71]" />
                  {new Date(session.startTime).toLocaleString("fr-FR")} -{" "}
                  {new Date(session.endTime).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2ecc71]" />
                  <Link href={`/rooms/${session.roomId}`} className="hover:text-white transition underline decoration-[#2ecc71]/30">
                    {session.room.name}
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#2ecc71]" />
                  Capacité: {session.capacity ?? "Illimitée"}
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">
              <h2 className="text-sm font-black text-gray-500 mb-6 uppercase tracking-[0.2em]">
                Intervenants
              </h2>

              <div className="space-y-4">
                {session.speakers.map(({ speaker }) => (
                  <Link
                    key={speaker.id}
                    href={`/speakers/${speaker.id}`}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-[#2ecc71] transition group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition">
                      {speaker.photoUrl ? (
                        <img src={speaker.photoUrl} alt={speaker.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-white/20" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold group-hover:text-[#2ecc71] transition">{speaker.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{speaker.bio || "Speaker"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
              Questions & Réponses
              {!live && <span className="text-xs font-medium text-gray-500">(Disponible uniquement en live)</span>}
            </h2>
            <QuestionList
              questions={session.questions.map(q => ({...q, createdAt: q.createdAt.toISOString()}))}
              sessionId={session.id}
              isLive={live}
            />
          </div>
        </div>
      </div>
    </div>
  );
}