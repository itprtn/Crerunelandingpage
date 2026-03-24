import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../utils/supabase";
import { Save, Globe, Phone, MapPin, Type } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

export default function AdminSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/signin");
    };
    checkAuth();
  }, [navigate]);

  // Fetch settings from Supabase
  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();
      
      if (error && error.code !== "PGRST116") {
        console.error("[v0] Error fetching settings:", error);
        throw error;
      }
      return data;
    },
  });

  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        hero_title: settings.hero_title || "",
        hero_subtitle: settings.hero_subtitle || "",
        contact_email: settings.contact_email || "",
        contact_phone: settings.contact_phone || "",
        contact_address: settings.contact_address || "",
      });
    }
  }, [settings]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (settings?.id) {
        // Update existing
        const { error } = await supabase
          .from("site_settings")
          .update(data)
          .eq("id", settings.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase.from("site_settings").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Parametres enregistres");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <AdminLayout title="Parametres" subtitle="Configurez les informations de votre site">
      <form onSubmit={handleSubmit} className="max-w-3xl">
        {/* Hero Section Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-[#F79E1B] to-[#EE3B33]">
            <div className="flex items-center gap-3 text-white">
              <Type size={24} />
              <div>
                <h2 className="text-lg font-bold">Textes de la page d'accueil</h2>
                <p className="text-white/80 text-sm">Personnalisez le contenu hero de votre landing page</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-[#EE3B33] rounded-full mx-auto"></div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Titre principal
                </label>
                <input
                  type="text"
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="Preparez votre retraite sans sacrifier votre present"
                />
                <p className="text-xs text-slate-400 mt-1">Le titre principal affiche en haut de la page</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sous-titre
                </label>
                <textarea
                  value={formData.hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all resize-none"
                  placeholder="Le Plan Epargne Retraite (PER) sur-mesure..."
                />
                <p className="text-xs text-slate-400 mt-1">Description qui apparait sous le titre principal</p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-700 to-slate-800">
            <div className="flex items-center gap-3 text-white">
              <Globe size={24} />
              <div>
                <h2 className="text-lg font-bold">Informations de contact</h2>
                <p className="text-white/80 text-sm">Ces informations apparaissent dans le footer et la page de contact</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Globe size={16} className="text-slate-400" />
                Email de contact
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                placeholder="contact@premunia.fr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                Telephone
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                placeholder="01 00 00 00 00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                Adresse
              </label>
              <input
                type="text"
                value={formData.contact_address}
                onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                placeholder="828 Av. Roger Salengro, 92370 Chaville"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="flex-1 py-3 px-6 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-[#EE3B33] to-[#F79E1B] text-white rounded-xl hover:opacity-90 transition-opacity font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {updateMutation.isPending ? "Enregistrement..." : "Enregistrer les parametres"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
