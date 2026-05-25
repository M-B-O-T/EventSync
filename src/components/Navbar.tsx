"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Shield, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isAdminPath = pathname?.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminPath) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 h-20 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#2ecc71] rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-black" />
        </div>
        <span className="font-black text-xl tracking-tighter text-white italic">
          Event<span className="text-[#2ecc71]">Sync</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/#events-section"
          className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em]"
        >
          Événements
        </Link>

        <Link
          href="/favorites"
          className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em]"
        >
          Mes Favoris
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isLoginPage ? (
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest"
          >
            Retour au site
          </Link>
        ) : (
          <Link
            href="/admin/login"
            className="group flex items-center gap-2 bg-white/5 hover:bg-[#2ecc71] text-white hover:text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
          >
            <User className="w-3 h-3" />
            Connexion Admin
          </Link>
        )}
      </div>
    </nav>
  );
}