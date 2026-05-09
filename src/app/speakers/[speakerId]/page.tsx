import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { User, Globe, AtSign, ArrowLeft, Clock, MapPin } from "lucide-react";

export default async function SpeakerDetailPage({
  params,
}: {
  params: Promise<{ speakerId: string }>;
}) {
  const { speakerId } = await params;

  const speaker = await prisma.speaker.findUnique({
    where: { id: speakerId },
    include: {
      sessions: {
        include: {
          session: {
            include: {
              room: true,
              event: true,
            },
          },
        },
      },
    },
  });

  if (!speaker) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Intervenant non trouvé</div>;

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href="/speakers"
          className="mb-10 inline-flex items-center gap-2 text-[#2ecc71] uppercase tracking-[0.3em] text-xs font-black"
        >
          <ArrowLeft className="w-4 h-4" /> Tous les intervenants
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Sidebar Profil */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 text-center">
                <div className="relative w-40 h-40 mx-auto mb-8">
                  {speaker.photoUrl ? (
                    <img
                      src={speaker.photoUrl}
                      alt={speaker.name}
                      className="w-full h-full object-cover rounded-full grayscale"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full border-4 border-[#2ecc71]/20"></div>
                </div>

                <h1 className="text-3xl font-black tracking-tight mb-2">
                  {speaker.name}
                </h1>
                <p className="text-[#2ecc71] text-[10px] uppercase tracking-[0.3em] font-black mb-8">
                  Intervenant
                </p>

                <div className="flex justify-center gap-4">
                  <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition">
                    <AtSign className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition">
                    <AtSign className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
                Biographie
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                {speaker.bio || "Aucune biographie disponible pour le moment."}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-8">
                Sessions & Interventions
              </h2>
              <div className="space-y-4">
                {speaker.sessions.map(({ session }) => (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="group block bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#2ecc71] transition"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full text-[10px] font-black uppercase tracking-widest">
                        {session.event.title}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-[#2ecc71] transition">
                      {session.title}
                    </h3>
                    <div className="flex flex-wrap gap-6 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#2ecc71]" />
                        {new Date(session.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#2ecc71]" />
                        {session.room.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
