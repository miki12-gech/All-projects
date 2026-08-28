// src/features/member-affairs/memberAffairsApi.ts
import apiClient from '@/api';
import { useAuthStore } from '@/store/authStore';

export const memberAffairsApi = {
  // Pending approvals
  getPending: () => apiClient.instance.get('/member-affairs/pending'),
  approve: (userId: string, preferredClassId?: string) =>
    apiClient.instance.post(`/member-affairs/approve/${userId}`, { preferredClassId }),
  reject: (userId: string, reason: string) =>
    apiClient.instance.post(`/member-affairs/reject/${userId}`, { reason }),

  // Member census
  listMembers: (params?: { search?: string; serviceClassId?: string; academicYear?: number; department?: string }) =>
    apiClient.instance.get('/member-affairs/members', { params }),
  updateMember: (id: string, data: any) => apiClient.instance.patch(`/member-affairs/members/${id}`, data),
  getMember: (id: string) => apiClient.instance.get(`/member-affairs/members/${id}`),

  // Spiritual assignments
  getUnassignedSpiritual: () => apiClient.instance.get('/member-affairs/unassigned-spiritual'),
  getSpiritualCandidates: (role: 'priest' | 'deacon' | 'spiritual') =>
    apiClient.instance.get('/member-affairs/spiritual-candidates', { params: { role } }),
  assignSpiritual: (memberId: string, role: string, valueId: string) =>
    apiClient.instance.post(`/member-affairs/assign-spiritual/${memberId}`, { role, valueId }),

  // Batch assignment
  batchAssign: (memberIds: string[], serviceClassId: string) =>
    apiClient.instance.post('/member-affairs/batch-assign', { memberIds, serviceClassId }),

  // Sub‑classes
  getSubClasses: (serviceClassId: string) => apiClient.instance.get(`/member-affairs/sub-classes/${serviceClassId}`),
  createSubClass: (serviceClassId: string, data: { sub_class_name: string; sub_chair_id?: string; sub_secretary_id?: string }) =>
    apiClient.instance.post(`/member-affairs/sub-classes/${serviceClassId}`, data),
  deleteSubClass: (id: string) => apiClient.instance.delete(`/member-affairs/sub-classes/${id}`),
  addMemberToSubClass: (subClassId: string, userId: string) =>
    apiClient.instance.post(`/member-affairs/sub-classes/${subClassId}/members`, { userId }),
  removeMemberFromSubClass: (subClassId: string, userId: string) =>
    apiClient.instance.delete(`/member-affairs/sub-classes/${subClassId}/members/${userId}`),

  // Documents (Plans & Reports) – for service managers (with class ID)
  getDocuments: (serviceClassId: string, type: 'PLAN' | 'REPORT') =>
    apiClient.instance.get(`/member-affairs/documents/${serviceClassId}/${type}`),
  uploadDocument: (serviceClassId: string, data: any) =>
    apiClient.instance.post(`/member-affairs/documents/${serviceClassId}`, data),
  // NEW: update document
  updateDocument: (id: string, data: any) =>
    apiClient.instance.patch(`/member-affairs/documents/${id}`, data),

  // Secretariat endpoints (no class ID)
  uploadSecretariatDocument: (data: any) =>
    apiClient.instance.post('/member-affairs/documents/secretariat', data),
  getSecretariatDocuments: (type: 'PLAN' | 'REPORT') =>
    apiClient.instance.get(`/member-affairs/documents/secretariat/${type}`),

  // Document approval & interactions
  getDocument: (id: string) => apiClient.instance.get(`/member-affairs/documents/${id}`),
  approveDocument: (id: string) => apiClient.instance.post(`/member-affairs/documents/${id}/approve`),
  rejectDocument: (id: string, reason: string) => apiClient.instance.post(`/member-affairs/documents/${id}/reject`, { reason }),
  addComment: (documentId: string, content: string, parentId?: string) =>
    apiClient.instance.post(`/member-affairs/documents/${documentId}/comments`, { content, parentId }),
  deleteComment: (commentId: string) => apiClient.instance.delete(`/member-affairs/documents/comments/${commentId}`),
  addReaction: (documentId: string, reactionType: 'LIKE' | 'STAR') =>
    apiClient.instance.post(`/member-affairs/documents/${documentId}/reactions`, { reactionType }),
  removeReaction: (documentId: string) => apiClient.instance.delete(`/member-affairs/documents/${documentId}/reactions`),
  // Updated delete – now passing userId and role in body (controller uses it)
  deleteDocument: (id: string) => apiClient.instance.delete(`/member-affairs/documents/${id}`),

  // Service classes (for dropdowns)
  getServiceClasses: () => apiClient.instance.get('/classes'),

  // Notifications – now use object with documentId and excludeUserId
  notifyChairmanOfPendingDocument: () =>
    apiClient.instance.post('/member-affairs/notifications/document-pending'),
  notifyDocumentApproved: (data: { documentId: string; excludeUserId?: string }) =>
    apiClient.instance.post('/member-affairs/notifications/document-approved', data),
  notifyDocumentRejected: (userId: string, documentTitle: string, reason: string) =>
    apiClient.instance.post('/member-affairs/notifications/document-rejected', { userId, documentTitle, reason }),
  notifyCommentAdded: (userId: string, documentTitle: string) =>
    apiClient.instance.post('/member-affairs/notifications/comment-added', { userId, documentTitle }),
  notifyReactionAdded: (userId: string, documentTitle: string) =>
    apiClient.instance.post('/member-affairs/notifications/reaction-added', { userId, documentTitle }),
};

export const useMemberAffairsClassId = () => {
  const { user } = useAuthStore();
  return user?.service_class_id;
};