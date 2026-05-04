"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsAdmin(loggedIn);
    };

    checkAuth();
    window.addEventListener("loginStateChange", checkAuth);
    return () => window.removeEventListener("loginStateChange", checkAuth);
  }, []);

  const isControlPanel = isAdmin && (pathname?.startsWith("/admin") || pathname === "/favorites");

  return (
    <footer className={`bg-[#0a0a0a] border-t border-white/5 py-12 px-8 transition-all duration-300 ${isControlPanel ? "ml-72" : "ml-0"}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        <div className="max-w-xs">
          <Link href="/" className="group">
            <span className="text-white font-black italic text-xl tracking-tighter">
              EventSync<span className="text-[#2ecc71]">.</span>
            </span>
          </Link>
          <p className="text-gray-500 text-xs mt-2 leading-relaxed uppercase tracking-wider font-bold">
            Gestion d'événements & PostgreSQL
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end text-left md:text-right">
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
            © {currentYear} TOUS DROITS RÉSERVÉS
          </p>
          
          {isControlPanel ? (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2ecc71]"></div>
              <span className="text-[#2ecc71] text-[9px] font-black uppercase tracking-widest">
                Session Administrateur Active
              </span>
            </div>
          ) : (
            <p className="text-gray-600 text-[9px] uppercase tracking-widest mt-1 font-bold">
              HEI Madagascar — Projet L2 Informatique
            </p>
          )}
        </div>

      </div>
    </footer>
  );
}