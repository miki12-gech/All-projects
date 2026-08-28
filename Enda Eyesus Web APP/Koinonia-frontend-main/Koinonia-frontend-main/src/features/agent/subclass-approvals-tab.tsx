"use client";

import { useState, useEffect } from "react";
import { CheckCircle, CircleCheck, CircleX } from "lucide-react";

export function SubClassApprovalsTab() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/admin/subclasses/pending-approvals', {
        credentials: 'include'
      });
      const data = await response.json();
      setApprovals(data.data || []);
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/v1/admin/subclasses/${id}/approve`, {
        method: 'PATCH',
        credentials: 'include'
      });
      fetchPendingApprovals();
    } catch (error) {
      console.error('Failed to approve subclass:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/v1/admin/subclasses/${id}/reject`, {
        method: 'PATCH',
        credentials: 'include'
      });
      fetchPendingApprovals();
    } catch (error) {
      console.error('Failed to reject subclass:', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading pending approvals...</div>;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <h3 className="text-lg font-bold text-[#0F3D2E] dark:text-[#D4AF37]">Sub‑Class Approvals ({approvals.length})</h3>
      <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Review and approve or reject pending sub‑class creation and leadership changes.</p>

      {approvals.length === 0 ? (
        <div className="bg-[#F8F5F0] dark:bg-[#0E0E0F] rounded-xl p-8 text-center border border-[#ddd8d0] dark:border-[#2a2a2d]">
          <CheckCircle className="h-8 w-8 text-[#0F3D2E] dark:text-[#1E4D3A] mx-auto mb-3 opacity-50" />
          <p className="text-[#6b6b6b] dark:text-[#B0B0B0] font-medium">No pending sub‑class approvals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map(approval => (
            <div key={approval.id} className="bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-md font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{approval.sub_class_name}</h4>
                  <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Class: {approval.service_classes?.class_name_amharic || 'N/A'}</p>
                </div>
                <span className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0]">
                  {new Date(approval.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {approval.users_sub_classes_sub_chair_idTousers && (
                <div className="mb-2">
                  <span className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0]">Sub‑Chair: </span>
                  <span className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5]">{approval.users_sub_classes_sub_chair_idTousers.full_name_three_parts}</span>
                </div>
              )}
              {approval.users_sub_classes_sub_vice_idTousers && (
                <div className="mb-2">
                  <span className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0]">Sub‑Vice: </span>
                  <span className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5]">{approval.users_sub_classes_sub_vice_idTousers.full_name_three_parts}</span>
                </div>
              )}
              {approval.users_sub_classes_sub_secretary_idTousers && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0]">Sub‑Secretary: </span>
                  <span className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5]">{approval.users_sub_classes_sub_secretary_idTousers.full_name_three_parts}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApprove(approval.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0F3D2E] dark:bg-[#1E4D3A] text-[#C9A227] dark:text-[#D4AF37] py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all"
                >
                  <CircleCheck className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => handleReject(approval.id)}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#7A1C1C]/30 text-[#7A1C1C] dark:text-[#f87171] py-2 rounded-lg text-xs font-bold hover:bg-[#7A1C1C]/10 transition-all"
                >
                  <CircleX className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}