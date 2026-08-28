"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { memberAffairsApi } from "./memberAffairsApi";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Users, Edit2 } from "lucide-react";
import { useState } from "react";
import EditMemberModal from "./EditMemberModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MemberCensus() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [serviceClassFilter, setServiceClassFilter] = useState("all");
  const [academicYearFilter, setAcademicYearFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const { data: serviceClasses } = useQuery({
    queryKey: ["service-classes"],
    queryFn: async () => {
      const res = await memberAffairsApi.getServiceClasses();
      return res.data;
    },
  });

  const { data: members, isLoading } = useQuery({
    queryKey: ["member-affairs", "members", search, serviceClassFilter, academicYearFilter],
    queryFn: async () => {
      const res = await memberAffairsApi.listMembers({
        search: search || undefined,
        serviceClassId: serviceClassFilter !== "all" ? serviceClassFilter : undefined,
        academicYear: academicYearFilter !== "all" ? parseInt(academicYearFilter) : undefined,
      });
      return res.data;
    },
  });

  const exportCsv = () => {
    if (!members) return;
    const headers = ["Full Name", "Email", "University ID", "Department", "Year", "Service Class"];
    const rows = members.map((m: any) => [
      m.full_name_three_parts,
      m.email,
      m.university_id || "",
      m.academic_dept || "",
      m.academic_year || "",
      m.service_classes?.class_name_amharic || "",
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `member-census-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]" /></div>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center bg-white dark:bg-[#1C1C1F] p-3 rounded-xl border border-border">
        <div className="relative flex-1 min-w-45">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={serviceClassFilter} onValueChange={setServiceClassFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Class" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {serviceClasses?.map((cls: any) => <SelectItem key={cls.id} value={cls.id}>{cls.class_name_amharic}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Year" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {[1,2,3,4,5].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> Export</Button>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members?.map((m: any) => (
          <Card key={m.id} className="group cursor-pointer hover:shadow-md transition-all hover:-translate-y-1" onClick={() => setSelectedMember(m)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{m.full_name_three_parts}</h3>
                  <p className="text-sm text-muted-foreground truncate">{m.email}</p>
                </div>
                <Badge variant="secondary" className="bg-[#C9A227]/10 text-[#C9A227]">{m.service_classes?.class_name_amharic || "Unassigned"}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>📚 {m.academic_dept || "—"}</span>
                <span>🎓 Year {m.academic_year || "—"}</span>
                <span>🆔 {m.university_id || "—"}</span>
                <span>📞 {m.phone_number || "—"}</span>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition"><Edit2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {members?.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground">No members found.</div>}
      </div>

      {selectedMember && (
        <EditMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} onSuccess={() => queryClient.invalidateQueries({ queryKey: ["member-affairs", "members"] })} />
      )}
    </div>
  );
}