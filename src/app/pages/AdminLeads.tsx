import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, apiCall } from "../../utils/supabase";
import { ArrowLeft, Search, Trash2, Edit, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AdminLeads() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ status: "", notes: "" });

  // Fetch leads
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => apiCall("/leads"),
  });

  const leads = leadsData?.leads || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (leadId: string) => apiCall(`/leads/${leadId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Lead supprimé");
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      setSelectedLead(null);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiCall(`/leads/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success("Lead mis à jour");
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      setEditMode(false);
    },
  });

  const filteredLeads = leads.filter(
    (lead: any) =>
      lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.profession?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Gestion des Leads
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Rechercher un lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none transition-all"
            />
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">
              {filteredLeads.length} lead{filteredLeads.length > 1 ? "s" : ""}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Chargement...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Aucun lead trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-sm">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-sm">
                      Contact
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
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead: any) => (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">
                          {lead.first_name} {lead.last_name}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail size={14} />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={14} />
                            {lead.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {lead.profession}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            lead.status === "new"
                              ? "bg-orange-100 text-[#F79E1B]"
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
                            ? "Contacté"
                            : lead.status === "converted"
                            ? "Converti"
                            : lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-sm">
                        {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(lead)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Êtes-vous sûr de vouloir supprimer ce lead ?"
                                )
                              ) {
                                deleteMutation.mutate(lead.id);
                              }
                            }}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
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
      </div>

      {/* Edit Modal */}
      {editMode && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              Modifier le lead : {selectedLead.first_name}{" "}
              {selectedLead.last_name}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Statut
                </label>
                <select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none"
                >
                  <option value="new">Nouveau</option>
                  <option value="contacted">Contacté</option>
                  <option value="converted">Converti</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editData.notes}
                  onChange={(e) =>
                    setEditData({ ...editData, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#EE3B33]/20 focus:border-[#EE3B33] outline-none"
                  placeholder="Ajouter des notes..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-2 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1 py-2 px-4 bg-[#EE3B33] text-white rounded-lg hover:bg-[#880E4F] transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? "Mise à jour..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
