"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Clock, MapPin, ArrowRight, Trash2 } from "lucide-react";

type Session = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: { name: string };
  event: { title: string };
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const storedIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (storedIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const promises = storedIds.map((id: string) =>
          fetch(`/api/sessions/${id}`).then((res) => res.json())
        );
        const data = await Promise.all(promises);
        setFavorites(data.filter((s) => !s.error));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = (id: string) => {
    const storedIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updatedIds = storedIds.filter((favId: string) => favId !== id);
    localStorage.setItem("favorites", JSON.stringify(updatedIds));
    setFavorites(favorites.filter((s) => s.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
            VOTRE ITINÉRAIRE
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
            Sessions Favorites
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl">
            Retrouvez ici toutes les sessions que vous avez marquées comme favorites pour ne rien manquer.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-white/10 rounded-[40px]">
            <Star className="w-16 h-16 text-white/10 mx-auto mb-6" />
            <p className="text-gray-500 text-lg mb-8">Vous n'avez pas encore de sessions favorites.</p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2ecc71] text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:opacity-90 transition"
            >
              Explorer le programme
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {favorites.map((session) => (
              <div
                key={session.id}
                className="group relative bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-[#2ecc71] transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-[#2ecc71]/10 text-[#2ecc71] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                      {session.event.title}
                    </span>
                    <h2 className="text-2xl font-bold mb-4">{session.title}</h2>
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
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => removeFavorite(session.id)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <Link
                      href={`/sessions/${session.id}`}
                      className="p-4 bg-[#2ecc71] text-black rounded-2xl hover:opacity-90 transition"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
