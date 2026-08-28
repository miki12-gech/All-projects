"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function DepartmentAnnouncements() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: announcements } = useQuery({
    queryKey: ["announcements", "department", user?.service_class_id],
    queryFn: () =>
      apiClient.instance.get("/announcements", { params: { class_id: user?.service_class_id } }),
    enabled: !!user?.service_class_id,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiClient.instance.post("/announcements", {
        title,
        content,
        is_public: false,
        target_class_id: user?.service_class_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setOpen(false);
      setTitle("");
      setContent("");
    },
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Post Announcement</Button>
      </div>
      <div className="space-y-4">
        {announcements?.data.items?.map((a: any) => (
          <div key={a.id} className="border rounded-lg p-4">
            <h3 className="font-bold">{a.title}</h3>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: a.content }} />
            <div className="text-xs text-muted-foreground mt-2">{new Date(a.published_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Content (HTML supported)" rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
          <DialogFooter><Button onClick={() => createMutation.mutate()}>Post</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}