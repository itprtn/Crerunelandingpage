import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../utils/supabase";
import { Search, Trash2, Edit, Phone, Mail, X, Filter } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

export default function AdminLeads() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ status: "", notes: "" });

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/signin");
    };
    checkAuth();
  }, [navigate]);

  // Fetch leads directly from Supabase
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("[v0] Error fetching leads:", error);
        throw error;
      }
      return data || [];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", leadId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead supprime");
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      setSelectedLead(null);
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("leads")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead mis a jour");
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      setEditMode(false);
      setSelectedLead(null);
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filter leads
  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch =
      lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.profession?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (lead: any) => {
    setSelectedLead(lead);
    setEditData({ status: lead.status || "new", notes: lead.notes || "" });
    setEditMode(true);
  };

  const handleUpdate = () => {
    if (selectedLead) {
      updateMutation.mutate({ id: selectedLead.id, data: editData });
    }
  };

  const statusCounts = {
    all: leads.length,
    new: leads.filter((l: any) => l.status === "new").length,
    contacted: leads.filter((l: any) => l.status === "contacted").length,
    converted: leads.filter((l: any) => l.status === "converted").length,
  };

  return (
    <AdminLayout title="Gestion des Leads" subtitle={`${leads.length} prospect${leads.length > 1 ? "s" : ""} au total`}>
      {/* Filters Row */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou profession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <div className="flex gap-2">
              {[
                { value: "all", label: "Tous", color: "slate" },
                { value: "new", label: "Nouveaux", color: "orange" },
                { value: "contacted", label: "Contactes", color: "blue" },
                { value: "converted", label: "Convertis", color: "green" },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status.value
                      ? status.color === "orange"
                        ? "bg-orange-100 text-orange-600"
                        : status.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : status.color === "green"
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status.label} ({statusCounts[status.value as keyof typeof statusCounts]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-[#EE3B33] rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4">Chargement...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Aucun lead trouve</p>
            <p className="text-slate-400 text-sm mt-1">Essayez d'ajuster vos filtres</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Nom</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Profession</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead: any) => (
                  <tr
                    key={lead.id}
                    className="border-t border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">
                        {lead.first_name} {lead.last_name}
                      </div>
                      {lead.notes && (
                        <p className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">
                          {lead.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#EE3B33] transition-colors"
                        >
                          <Mail size={14} />
                          {lead.email}
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#EE3B33] transition-colors"
                        >
                          <Phone size={14} />
                          {lead.phone}
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{lead.profession}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          lead.status === "new"
                            ? "bg-orange-100 text-orange-600"
                            : lead.status === "contacted"
                            ? "bg-blue-100 text-blue-600"
                            : lead.status === "converted"
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {lead.status === "new"
                          ? "Nouveau"
                          : lead.status === "contacted"
                          ? "Contacte"
                          : lead.status === "converted"
                          ? "Converti"
                          : lead.status || "Nouveau"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">
                      {new Date(lead.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(lead)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Supprimer ce lead ?")) {
                              deleteMutation.mutate(lead.id);
                            }
                          }}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editMode && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Modifier le lead</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {selectedLead.first_name} {selectedLead.last_name}
                </p>
              </div>
              <button
                onClick={() => setEditMode(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Lead Info Summary */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Email</span>
                    <p className="font-medium text-slate-700">{selectedLead.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Telephone</span>
                    <p className="font-medium text-slate-700">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Profession</span>
                    <p className="font-medium text-slate-700">{selectedLead.profession}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Date</span>
                    <p className="font-medium text-slate-700">
                      {new Date(selectedLead.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Statut
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: "new", label: "Nouveau", color: "orange" },
                    { value: "contacted", label: "Contacte", color: "blue" },
                    { value: "converted", label: "Converti", color: "green" },
                    { value: "rejected", label: "Rejete", color: "red" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setEditData({ ...editData, status: status.value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                        editData.status === status.value
                          ? status.color === "orange"
                            ? "bg-orange-100 border-orange-400 text-orange-600"
                            : status.color === "blue"
                            ? "bg-blue-100 border-blue-400 text-blue-600"
                            : status.color === "green"
                            ? "bg-green-100 border-green-400 text-green-600"
                            : "bg-red-100 border-red-400 text-red-600"
                          : "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all resize-none"
                  placeholder="Ajouter des notes sur ce lead..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-3 px-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-[#EE3B33] to-[#F79E1B] text-white rounded-xl hover:opacity-90 transition-opacity font-bold disabled:opacity-50"
              >
                {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
