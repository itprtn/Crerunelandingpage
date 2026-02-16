import React, { useState } from "react";
import { auth } from "../../utils/postgres";
import { toast } from "sonner";
import { Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";

export default function PromoteAdmin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePromote = async () => {
    setLoading(true);
    try {
      // Call API to promote user to admin
      await fetch('/api/auth/promote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success("Vous êtes maintenant administrateur !");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (error: any) {
      console.error("[PromoteAdmin] Error:", error);
      toast.error(error.message || "Erreur lors de la promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F79E1B] to-[#EE3B33] p-8 text-white text-center">
            <Shield size={48} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">
              Promotion Administrateur
            </h1>
            <p className="opacity-90">Configuration initiale du système</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4">
              <AlertTriangle className="text-[#F79E1B] shrink-0" size={24} />
              <div className="text-sm text-slate-700">
                <p className="font-bold mb-2">⚠️ Page de configuration unique</p>
                <p className="mb-2">
                  Cette page permet de promouvoir le premier utilisateur en
                  administrateur. Elle ne doit être utilisée qu'une seule fois.
                </p>
                <p className="font-semibold text-[#EE3B33]">
                  IMPORTANT : Supprimez cette page après utilisation pour des
                  raisons de sécurité !
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Étapes suivantes :</h3>
              <ol className="space-y-3 list-decimal list-inside text-slate-600">
                <li>Cliquez sur le bouton ci-dessous pour devenir admin</li>
                <li>Accédez au dashboard admin</li>
                <li className="font-semibold text-[#EE3B33]">
                  Supprimez le fichier /src/app/pages/PromoteAdmin.tsx
                </li>
                <li>Configurez vos paramètres SMTP dans l'espace admin</li>
              </ol>
            </div>

            <button
              onClick={handlePromote}
              disabled={loading}
              className="w-full py-4 bg-[#EE3B33] text-white rounded-xl font-bold text-lg hover:bg-[#880E4F] transition-all disabled:opacity-50"
            >
              {loading ? "Promotion en cours..." : "Me promouvoir en Admin"}
            </button>

            <div className="text-center">
              <a
                href="/"
                className="text-slate-500 text-sm hover:text-[#EE3B33] transition-colors"
              >
                ← Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
