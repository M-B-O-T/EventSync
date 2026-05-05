"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Search, LayoutGrid } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  _count?: { sessions: number };
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && window.location.hash === "#events-section") {
      const element = document.getElementById("events-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [loading]);

  const now = new Date();

  const filteredEvents = events
    .filter((e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((e) => {
      if (activeCategory === "Tous") return true;
      if (activeCategory === "À venir") return new Date(e.startDate) > now;
      if (activeCategory === "Passés") return new Date(e.endDate) < now;
      return true;
    });

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden px-6 pt-40 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-50"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-[#2ecc71]/10 text-[#2ecc71] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#2ecc71]/20 uppercase tracking-[0.2em] mb-8">
            • Plateforme EventSync
          </span>

          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-white mb-10">
            Vivez vos <br />
            <span className="text-[#2ecc71] italic">événements</span> <br />
            en temps réel
          </h1>

          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 max-w-2xl overflow-hidden shadow-2xl">
            <Search className="w-5 h-5 text-white/30 ml-6" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              className="flex-1 bg-transparent px-4 py-6 text-sm text-white placeholder-white/40 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-[#2ecc71] text-black font-black px-8 py-6 uppercase text-xs tracking-widest">
              Rechercher
            </button>
          </div>
        </div>
      </section>

      <section id="events-section" className="py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div>
              <span className="text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.3em] block mb-2">
                Catalogue
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                Tous les événements
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                {filteredEvents.length} événements disponibles
              </p>
            </div>

            <div className="flex bg-white/5 backdrop-blur p-1.5 rounded-2xl border border-white/10">
              {["Tous", "À venir", "Passés"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase transition ${
                    activeCategory === tab
                      ? "bg-[#2ecc71] text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-full hover:scale-[1.02] transition"
              >
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute top-6 left-6 z-10 bg-[#2ecc71] text-black text-[10px] font-black px-4 py-2 rounded-full uppercase">
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>

                  <img
                    src={
                      event.imageUrl ||
                      "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070"
                    }
                    className="w-full h-full object-cover"
                    alt={event.title}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                  <div className="absolute bottom-8 left-8">
                    <h3 className="text-2xl font-black text-white">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-gray-400 mb-4 text-xs uppercase">
                    <MapPin className="w-4 h-4 text-[#2ecc71]" />
                    <span>{event.location}</span>
                  </div>

                  <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-[#2ecc71]/50" />
                      {event._count?.sessions || 0} SESSIONS
                    </span>

                    <Link
                      href={`/events/${event.id}`}
                      className="text-[#2ecc71] font-black flex items-center gap-2 uppercase text-[10px] hover:gap-3 transition-all"
                    >
                      Programme <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}