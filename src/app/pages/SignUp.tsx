import React, { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { auth } from "../../utils/postgres";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const response = await auth.signUp(email, password, firstName, lastName);

      if (response.token) {
        toast.success("Compte créé avec succès !");
        navigate("/promote-admin");
      }
    } catch (error: any) {
      console.error("[SignUp] Error:", error);
      toast.error(error.message || "Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#EE3B33] to-[#880E4F] p-8 text-white text-center">
            <img
              src="https://ucarecdn.com/8796d3aa-4089-4859-87df-1772ce670f61/-/format/auto/"
              alt="Premunia Logo"
              className="h-10 w-auto mx-auto mb-4 brightness-0 invert"
            />
            <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
            <p className="opacity-90">Rejoignez l'espace professionnel</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSignUp} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

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
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Minimum 6 caractères
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#EE3B33] text-white rounded-xl font-bold text-lg hover:bg-[#880E4F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Création..." : "Créer mon compte"}
              {!loading && <ArrowRight size={20} />}
            </button>

            <div className="text-center space-y-2">
              <p className="text-slate-600 text-sm">
                Déjà un compte ?{" "}
                <a
                  href="/signin"
                  className="text-[#EE3B33] font-semibold hover:underline"
                >
                  Se connecter
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
