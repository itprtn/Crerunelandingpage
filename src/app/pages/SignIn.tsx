import React, { useState } from "react";
import { supabase } from "../../utils/supabase";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Connexion réussie !");
      navigate("/admin");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header avec la couleur Premunia */}
          <div className="bg-gradient-to-r from-[#EE3B33] to-[#880E4F] p-8 text-white text-center">
            <img
              src="https://ucarecdn.com/8796d3aa-4089-4859-87df-1772ce670f61/-/format/auto/"
              alt="Premunia Logo"
              className="h-10 w-auto mx-auto mb-4 brightness-0 invert"
            />
            <h1 className="text-2xl font-bold mb-2">Espace Professionnel</h1>
            <p className="opacity-90">Connectez-vous à votre compte</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSignIn} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#EE3B33] text-white rounded-xl font-bold text-lg hover:bg-[#880E4F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Connexion..." : "Se connecter"}
              {!loading && <ArrowRight size={20} />}
            </button>

            <div className="text-center space-y-2">
              <p className="text-slate-600 text-sm">
                Pas encore de compte ?{" "}
                <a
                  href="/signup"
                  className="text-[#EE3B33] font-semibold hover:underline"
                >
                  Créer un compte
                </a>
              </p>
              <a
                href="/"
                className="text-slate-500 text-sm hover:text-[#EE3B33] transition-colors"
              >
                ← Retour à l'accueil
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
