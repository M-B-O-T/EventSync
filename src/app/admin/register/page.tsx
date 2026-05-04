"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  Calendar,
  Loader2,
  UserPlus,
} from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      setSuccess("Compte créé avec succès !");

      setTimeout(() => {
        router.push("/admin/login");
      }, 1500);

    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2ecc71]/10 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-md">

        <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[40px] backdrop-blur-2xl shadow-2xl">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#2ecc71] rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="text-black w-8 h-8" />
            </div>

            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              Inscription
            </h1>

            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">
              EventSync Admin Panel
            </p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-2xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-[#2ecc71] text-[10px] font-black uppercase rounded-2xl text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">

            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#2ecc71]/30"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="Mot de passe"
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#2ecc71]/30"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#2ecc71]/30"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2ecc71] text-black font-black py-4 rounded-2xl uppercase text-[11px] tracking-[0.2em] hover:bg-green-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Créer un compte
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[10px] mb-3">
              Déjà un compte ?
            </p>

            <Link
              href="/admin/login"
              className="text-[#2ecc71] text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Se connecter
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}