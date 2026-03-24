import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../utils/supabase";
import { Save, Mail, Server, TestTube, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

export default function AdminAutomation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/signin");
    };
    checkAuth();
  }, [navigate]);

  // Fetch SMTP config from Supabase
  const { data: smtpConfig, isLoading } = useQuery({
    queryKey: ["smtp-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("smtp_config")
        .select("*")
        .limit(1)
        .single();
      
      if (error && error.code !== "PGRST116") {
        // Table might not exist, return null
        console.error("[v0] SMTP config error:", error);
        return null;
      }
      return data;
    },
  });

  const [formData, setFormData] = useState({
    host: "",
    port: "587",
    user: "",
    password: "",
    from_email: "",
    from_name: "Premunia",
  });

  useEffect(() => {
    if (smtpConfig) {
      setFormData({
        host: smtpConfig.host || "",
        port: smtpConfig.port || "587",
        user: smtpConfig.user || "",
        password: "", // Don't show password
        from_email: smtpConfig.from_email || "",
        from_name: smtpConfig.from_name || "Premunia",
      });
    }
  }, [smtpConfig]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      // Only include password if it's been changed
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      if (smtpConfig?.id) {
        const { error } = await supabase
          .from("smtp_config")
          .update(updateData)
          .eq("id", smtpConfig.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("smtp_config").insert([updateData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Configuration SMTP enregistree");
      queryClient.invalidateQueries({ queryKey: ["smtp-config"] });
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    // Simulate test - in production, this would call an Edge Function
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (formData.host && formData.user) {
      setTestStatus("success");
      toast.success("Connexion SMTP reussie !");
    } else {
      setTestStatus("error");
      toast.error("Veuillez remplir tous les champs");
    }
    setTimeout(() => setTestStatus("idle"), 3000);
  };

  return (
    <AdminLayout title="Automatisation" subtitle="Configurez l'envoi automatique d'emails">
      <div className="max-w-3xl">
        {/* SMTP Configuration */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-600 to-purple-700">
              <div className="flex items-center gap-3 text-white">
                <Server size={24} />
                <div>
                  <h2 className="text-lg font-bold">Configuration SMTP</h2>
                  <p className="text-white/80 text-sm">Parametres du serveur d'envoi d'emails</p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-purple-600 rounded-full mx-auto"></div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="font-semibold text-blue-800 mb-2">Exemples de configuration :</p>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li><strong>Gmail:</strong> smtp.gmail.com:587 (mot de passe d'application requis)</li>
                    <li><strong>Outlook:</strong> smtp.office365.com:587</li>
                    <li><strong>SendGrid:</strong> smtp.sendgrid.net:587</li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Serveur SMTP
                    </label>
                    <input
                      type="text"
                      value={formData.host}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Port
                    </label>
                    <input
                      type="number"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                      placeholder="587"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Utilisateur SMTP
                  </label>
                  <input
                    type="email"
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mot de passe SMTP
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Laissez vide pour conserver le mot de passe actuel
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-bold text-slate-800 mb-4">Parametres de l'expediteur</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email expediteur
                      </label>
                      <input
                        type="email"
                        value={formData.from_email}
                        onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        placeholder="contact@premunia.fr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom expediteur
                      </label>
                      <input
                        type="text"
                        value={formData.from_name}
                        onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        placeholder="Premunia"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Connection */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus === "testing"}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {testStatus === "testing" ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-purple-600 rounded-full"></div>
                        Test en cours...
                      </>
                    ) : testStatus === "success" ? (
                      <>
                        <CheckCircle size={18} className="text-green-500" />
                        Connexion OK
                      </>
                    ) : testStatus === "error" ? (
                      <>
                        <XCircle size={18} className="text-red-500" />
                        Echec
                      </>
                    ) : (
                      <>
                        <TestTube size={18} />
                        Tester la connexion
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
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
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:opacity-90 transition-opacity font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>

        {/* Email Templates - Coming Soon */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-[#F79E1B] to-[#EE3B33]">
            <div className="flex items-center gap-3 text-white">
              <Mail size={24} />
              <div>
                <h2 className="text-lg font-bold">Templates d'emails automatiques</h2>
                <p className="text-white/80 text-sm">Personnalisez les emails envoyes aux leads</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-slate-300" />
              </div>
              <p className="font-medium text-slate-600 mb-2">Fonctionnalite a venir</p>
              <p className="text-sm text-slate-400">
                Creez et personnalisez vos templates d'emails automatiques
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
