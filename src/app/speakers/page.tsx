import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { User, ArrowRight } from "lucide-react";

export default async function SpeakersPage() {
  const speakers = await prisma.speaker.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
            INTERVENANTS
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            Experts & Speakers
          </h1>
          <p className="mt-4 text-gray-400 max-w-3xl">
            Découvrez les experts qui partagent leurs connaissances lors de nos événements.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((speaker) => (
            <Link
              key={speaker.id}
              href={`/speakers/${speaker.id}`}
              className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-[#2ecc71] transition"
            >
              <div className="relative w-24 h-24 mb-6 mx-auto">
                {speaker.photoUrl ? (
                  <img
                    src={speaker.photoUrl}
                    alt={speaker.name}
                    className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#2ecc71] transition duration-500"></div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-black text-white group-hover:text-[#2ecc71] transition">
                  {speaker.name}
                </h2>
                <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mt-2 line-clamp-2">
                  {speaker.bio || "Intervenant"}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex justify-center">
                <span className="text-[#2ecc71] font-black uppercase text-[10px] tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  Voir le profil <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
