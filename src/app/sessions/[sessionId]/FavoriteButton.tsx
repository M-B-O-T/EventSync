"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function FavoriteButton({ sessionId }: { sessionId: string }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFav(favorites.includes(sessionId));
  }, [sessionId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;
    if (favorites.includes(sessionId)) {
      updated = favorites.filter((id: string) => id !== sessionId);
    } else {
      updated = [...favorites, sessionId];
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFav(!isFav);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition flex items-center gap-2 ${
        isFav
          ? "bg-[#2ecc71] text-black"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      <Star className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
      {isFav ? "Dans mes favoris" : "Ajouter aux favoris"}
    </button>
  );
}
