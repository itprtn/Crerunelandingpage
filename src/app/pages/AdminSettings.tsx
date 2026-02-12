import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/supabase";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AdminSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiCall("/settings"),
  });

  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
  });

  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      apiCall("/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success("Paramètres enregistrés");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <img
              src="https://ucarecdn.com/8796d3aa-4089-4859-87df-1772ce670f61/-/format/auto/"
              alt="Premunia Logo"
              className="h-8 w-auto"
            />
            <span className="text-slate-400">|</span>
            <h1 className="text-xl font-bold text-slate-800">Paramètres</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-[#F79E1B] to-[#EE3B33] text-white">
            <h2 className="text-2xl font-bold">Configuration du site</h2>
            <p className="opacity-90 mt-1">
              Personnalisez les textes de votre landing page
            </p>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Chargement...</div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Titre principal (Hero)
                </label>
                <input
                  type="text"
                  value={formData.hero_title}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="Préparez votre retraite sans sacrifier votre présent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sous-titre (Hero)
                </label>
                <textarea
                  value={formData.hero_subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_subtitle: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="Le Plan Épargne Retraite (PER) sur-mesure..."
                />
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6">
                <h3 className="font-bold text-slate-800 mb-4">
                  Informations de contact
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                      placeholder="contact@premunia.fr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                      placeholder="01 00 00 00 00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={formData.contact_address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                      placeholder="828 Av. Roger Salengro, 92370 Chaville"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="flex-1 py-3 px-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 py-3 px-6 bg-[#EE3B33] text-white rounded-xl hover:bg-[#880E4F] transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
