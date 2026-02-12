import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase, apiCall } from "../../utils/supabase";
import {
  Users,
  Mail,
  TrendingUp,
  Settings,
  LogOut,
  Zap,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Admin() {
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signin");
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch leads
  const { data: leadsData } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => apiCall("/leads"),
  });

  const leads = leadsData?.leads || [];
  const newLeads = leads.filter((l: any) => l.status === "new").length;
  const totalLeads = leads.length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src="https://ucarecdn.com/8796d3aa-4089-4859-87df-1772ce670f61/-/format/auto/"
                alt="Premunia Logo"
                className="h-8 w-auto"
              />
              <span className="text-slate-400">|</span>
              <h1 className="text-xl font-bold text-slate-800">
                Dashboard Admin
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-[#EE3B33] transition-colors"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Users className="text-[#F79E1B]" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {totalLeads}
              </span>
            </div>
            <h3 className="text-slate-600 font-medium">Total Leads</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Mail className="text-[#EE3B33]" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {newLeads}
              </span>
            </div>
            <h3 className="text-slate-600 font-medium">Nouveaux Leads</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {totalLeads > 0
                  ? Math.round((newLeads / totalLeads) * 100)
                  : 0}
                %
              </span>
            </div>
            <h3 className="text-slate-600 font-medium">Taux de nouveaux</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Actions rapides
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/leads")}
              className="p-6 bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl hover:shadow-lg transition-all group"
            >
              <FileText className="text-[#F79E1B] mb-3 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-slate-800 mb-1">Gérer les Leads</h3>
              <p className="text-sm text-slate-500">
                Voir et gérer tous vos prospects
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/settings")}
              className="p-6 bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl hover:shadow-lg transition-all group"
            >
              <Settings className="text-[#EE3B33] mb-3 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-slate-800 mb-1">Paramètres</h3>
              <p className="text-sm text-slate-500">
                Configurer le site et les textes
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/automation")}
              className="p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl hover:shadow-lg transition-all group"
            >
              <Zap className="text-[#880E4F] mb-3 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-slate-800 mb-1">Automatisation</h3>
              <p className="text-sm text-slate-500">
                Emails et workflows automatiques
              </p>
            </button>

            <button
              onClick={() => navigate("/")}
              className="p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl hover:shadow-lg transition-all group"
            >
              <Users className="text-slate-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-slate-800 mb-1">Voir le Site</h3>
              <p className="text-sm text-slate-500">
                Retour à la landing page
              </p>
            </button>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Derniers leads
          </h2>
          {leads.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p>Aucun lead pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-sm">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-sm">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-sm">
                      Profession
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-sm">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((lead: any) => (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {lead.first_name} {lead.last_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lead.email}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lead.profession}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            lead.status === "new"
                              ? "bg-orange-100 text-[#F79E1B]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {lead.status === "new" ? "Nouveau" : lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-sm">
                        {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {leads.length > 5 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/admin/leads")}
                className="text-[#EE3B33] font-semibold hover:underline"
              >
                Voir tous les leads →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
