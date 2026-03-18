import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Brain, Eye, Loader2, AlertCircle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useBackendApi } from "@/hooks/useBackendApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  researcher_name: string;
  researcher_id: string;
  question_count: number;
  response_count: number;
  is_active: boolean;
  created_at: string;
}

export default function Projects() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { fetchProjects, createProject, updateProject, deleteProject, loading, error } = useBackendApi();

  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r: any = await fetchProjects();
    if (r.success) setProjects(r.data?.projects || []);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: "", description: "" }); setDialogOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm({ title: p.title, description: p.description || "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    const r: any = editing
      ? await updateProject(editing.id, form)
      : await createProject(form);
    setSaving(false);
    if (r.success) {
      toast({ title: editing ? "Project updated" : "Project created" });
      setDialogOpen(false);
      load();
    } else {
      toast({ title: "Error", description: r.error, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const r: any = await deleteProject(id);
    if (r.success) { toast({ title: "Project deleted" }); load(); }
    else toast({ title: "Error", description: r.error, variant: "destructive" });
  };

  const myProjects = user?.role === "admin"
    ? projects
    : projects.filter((p) => p.researcher_id === user?.id);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">My Projects</h1>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> New Project
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && myProjects.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No projects yet. Create your first research project.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {myProjects.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-snug">{p.title}</CardTitle>
                <Badge variant={p.is_active ? "default" : "secondary"} className="text-xs shrink-0">
                  {p.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="text-xs">{p.researcher_name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {p.description || "No description."}
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="text-xs">{p.question_count} questions</Badge>
                <Badge variant="outline" className="text-xs">{p.response_count} responses</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => navigate(`/project/${p.id}`)}>
                <Eye className="h-3.5 w-3.5 mr-1" /> Preview
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/projects/${p.id}/insights`)}>
                <Brain className="h-3.5 w-3.5 mr-1" /> Insights
              </Button>
              <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "New Research Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Urban Health Survey 2026"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                placeholder="What is this research about?"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
