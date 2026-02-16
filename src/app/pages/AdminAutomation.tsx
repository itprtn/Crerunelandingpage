import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/postgres";
import { ArrowLeft, Save, Mail, Server } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AdminAutomation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch SMTP config
  const { data: smtpConfig, isLoading } = useQuery({
    queryKey: ["smtp-config"],
    queryFn: () => apiCall("/smtp-config"),
  });

  const [formData, setFormData] = useState({
    host: "",
    port: "587",
    user: "",
    password: "",
    from_email: "",
    from_name: "Premunia",
  });

  React.useEffect(() => {
    if (smtpConfig) {
      setFormData({
        ...smtpConfig,
        password: "", // Don't show password for security
      });
    }
  }, [smtpConfig]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      apiCall("/smtp-config", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success("Configuration SMTP enregistrée");
      queryClient.invalidateQueries({ queryKey: ["smtp-config"] });
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
            <h1 className="text-xl font-bold text-slate-800">
              Automatisation Email
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SMTP Configuration */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-[#880E4F] to-[#E91E63] text-white">
            <div className="flex items-center gap-3 mb-2">
              <Server size={28} />
              <h2 className="text-2xl font-bold">Configuration SMTP</h2>
            </div>
            <p className="opacity-90">
              Configurez votre serveur d'envoi d'emails
            </p>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Chargement...</div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-slate-700">
                <p className="font-semibold mb-2">💡 Exemples de configuration :</p>
                <ul className="space-y-1 text-sm">
                  <li>
                    <strong>Gmail:</strong> smtp.gmail.com:587 (nécessite un mot
                    de passe d'application)
                  </li>
                  <li>
                    <strong>Outlook:</strong> smtp.office365.com:587
                  </li>
                  <li>
                    <strong>SendGrid:</strong> smtp.sendgrid.net:587
                  </li>
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
                    onChange={(e) =>
                      setFormData({ ...formData, host: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                    placeholder="smtp.gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    value={formData.port}
                    onChange={(e) =>
                      setFormData({ ...formData, port: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                    placeholder="587"
                    required
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
                  onChange={(e) =>
                    setFormData({ ...formData, user: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mot de passe SMTP
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Laissez vide pour conserver le mot de passe actuel
                </p>
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6">
                <h3 className="font-bold text-slate-800 mb-4">
                  Paramètres de l'expéditeur
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email de l'expéditeur
                    </label>
                    <input
                      type="email"
                      value={formData.from_email}
                      onChange={(e) =>
                        setFormData({ ...formData, from_email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                      placeholder="contact@premunia.fr"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nom de l'expéditeur
                    </label>
                    <input
                      type="text"
                      value={formData.from_name}
                      onChange={(e) =>
                        setFormData({ ...formData, from_name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
                      placeholder="Premunia"
                      required
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
                  {updateMutation.isPending
                    ? "Enregistrement..."
                    : "Enregistrer"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Email Template (Future feature) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-[#F79E1B] to-[#EE3B33] text-white">
            <div className="flex items-center gap-3 mb-2">
              <Mail size={28} />
              <h2 className="text-2xl font-bold">Template d'email automatique</h2>
            </div>
            <p className="opacity-90">Email envoyé automatiquement aux nouveaux leads</p>
          </div>

          <div className="p-8">
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-500">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">Fonctionnalité à venir</p>
              <p className="text-sm">
                Prochainement : créez et personnalisez vos templates d'emails
                automatiques
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
