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
  LogIn,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
        return;
      }

      if (!data.token) {
        setError("Token manquant");
        return;
      }

      localStorage.setItem("token", data.token);

      router.replace("/admin");
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

          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#2ecc71] rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="text-black w-8 h-8" />
            </div>

            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              Connexion
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] text-center rounded-2xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full bg-white/5 rounded-2xl py-4 pl-14 pr-6 text-white"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="Mot de passe"
                required
                className="w-full bg-white/5 rounded-2xl py-4 pl-14 pr-6 text-white"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2ecc71] text-black py-4 rounded-2xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 text-center">
            <Link href="/admin/register" className="text-[#2ecc71] text-sm">
              Créer un compte
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}