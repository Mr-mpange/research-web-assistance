import { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, AlertCircle,
  ChevronDown, ChevronRight, User2, FlaskConical, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBackendApi } from "@/hooks/useBackendApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ResearchQuestion {
  id: string;
  title: string;
  title_sw?: string;
  category: string;
  description: string;
  question_text?: string;
  question_text_sw?: string;
  is_active: boolean;
  response_count?: number;
  created_at: string;
  language?: string;
  researcher_id?: string;
  researcher_name?: string;
}

interface Researcher {
  id: string;
  full_name: string;
  username: string;
  role: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_CLASSES: Record<string, string> = {
  Health: "badge-health",
  Infrastructure: "badge-infrastructure",
  Social: "badge-social",
  Economic: "badge-economic",
  Environment: "badge-environment",
};

function CategoryBadge({ category }: { category: string }) {
  const cls = CATEGORY_CLASSES[category] ?? "bg-muted text-muted-foreground border border-border";
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", cls)}>
      {category}
    </span>
  );
}

function LangBadge({ lang }: { lang?: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
      {lang === "sw" ? "🇰🇪 Kiswahili" : "🇬🇧 English"}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ResearchQuestions() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<ResearchQuestion[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ResearchQuestion | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [researcherFilter, setResearcherFilter] = useState<string>("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const isAdmin = user?.role === 'admin';
  const isResearcher = user?.role === 'researcher';
  const currentUserId = user?.id;

  const [formData, setFormData] = useState({
    title: "",
    title_sw: "",
    category: "",
    description: "",
    question_text: "",
    question_text_sw: "",
    language: "en",
    researcher_id: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loading, error, fetchQuestions, createQuestion, updateQuestion, deleteQuestion } = useBackendApi();
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
    loadResearchers();
  }, []);

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadResearchers = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const all: Researcher[] = Array.isArray(data) ? data : data.users || [];
      setResearchers(all.filter((u) => u.role === "researcher"));
    } catch {
      /* non-critical */
    }
  };

  const loadQuestions = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/cache/questions`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        await new Promise((r) => setTimeout(r, 500));
      } catch { /* non-critical */ }
    }

    const timestamp = Date.now();
    try {
      const response = await fetch(`${API_BASE_URL}/api/questions?_nocache=${timestamp}`, {
        headers: { Authorization: `Bearer ${token ?? ""}` },
      });
      const result = await response.json();
      if (result.success || result.data) {
        const questionsData = result.data?.questions || result.questions || [];
        if (Array.isArray(questionsData)) setQuestions(questionsData);
      }
    } catch (e) {
      console.error("Failed to load questions:", e);
    }
  };

  // ── Form validation ─────────────────────────────────────────────────────────

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.question_text.trim()) newErrors.question_text = "Question text is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (keepOpen = false) => {
    if (!validateForm()) return;

    // For researchers creating new questions, auto-assign to themselves
    let researcherId = formData.researcher_id;
    if (!editingQuestion && isResearcher && !isAdmin && currentUserId) {
      researcherId = currentUserId;
    }

    // Enrich with researcher_name
    const selectedResearcher = researchers.find((r) => r.id === researcherId);
    const payload = {
      ...formData,
      researcher_id: researcherId,
      researcher_name: selectedResearcher?.full_name ?? user?.full_name ?? "",
    };

    try {
      if (editingQuestion) {
        const result = await updateQuestion(editingQuestion.id, {
          ...payload,
          is_active: editingQuestion.is_active,
        });
        if (result.success) {
          toast({ title: "Success", description: "Question updated successfully" });
          await loadQuestions();
        } else {
          toast({ title: "Error", description: result.error || "Failed to update", variant: "destructive" });
        }
        closeDialog();
      } else {
        const result = await createQuestion({ ...payload, is_active: true });
        if (result.success) {
          toast({ title: "Success", description: "Question created successfully" });
          await loadQuestions();
          if (keepOpen) {
            // Reset form but keep dialog open for another entry
            setFormData({ title: "", title_sw: "", category: "", description: "", question_text: "", question_text_sw: "", language: "en", researcher_id: formData.researcher_id });
            setErrors({});
          } else {
            closeDialog();
          }
        } else {
          toast({ title: "Error", description: result.error || "Failed to create", variant: "destructive" });
        }
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    }
  };

  // ── CRUD helpers ────────────────────────────────────────────────────────────

  // Check if user can edit/delete a question
  const canModifyQuestion = (q: ResearchQuestion) => {
    if (isAdmin) return true; // Admins can modify any question
    if (isResearcher && q.researcher_id === currentUserId) return true; // Researchers can modify their own
    return false;
  };

  const handleEdit = (q: ResearchQuestion) => {
    if (!canModifyQuestion(q)) {
      toast({ 
        title: "Access Denied", 
        description: "You can only edit your own questions", 
        variant: "destructive" 
      });
      return;
    }
    
    setEditingQuestion(q);
    setFormData({
      title: q.title,
      title_sw: q.title_sw || "",
      category: q.category,
      description: q.description,
      question_text: q.question_text || "",
      question_text_sw: q.question_text_sw || "",
      language: q.language || "en",
      researcher_id: q.researcher_id || "",
    });
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (q: ResearchQuestion) => {
    if (!canModifyQuestion(q)) {
      toast({ 
        title: "Access Denied", 
        description: "You can only modify your own questions", 
        variant: "destructive" 
      });
      return;
    }
    
    const newStatus = !q.is_active;
    setQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, is_active: newStatus } : x)));
    try {
      const result = await updateQuestion(q.id, { is_active: newStatus });
      if (result.success) {
        toast({ title: "Success", description: `Question ${newStatus ? "activated" : "deactivated"}` });
        const token = localStorage.getItem("auth_token");
        if (token) {
          fetch(`${API_BASE_URL}/api/cache/questions`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => { });
        }
      } else {
        setQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, is_active: !newStatus } : x)));
        toast({ title: "Error", description: result.error || "Failed to update status", variant: "destructive" });
      }
    } catch {
      setQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, is_active: !newStatus } : x)));
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question && !canModifyQuestion(question)) {
      toast({ 
        title: "Access Denied", 
        description: "You can only delete your own questions", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!confirm("Are you sure you want to delete this question?")) return;
    const result = await deleteQuestion(id);
    if (result.success) {
      toast({ title: "Success", description: "Question deleted successfully" });
      await loadQuestions();
    } else {
      toast({ title: "Error", description: result.error || "Failed to delete", variant: "destructive" });
    }
  };

  const openNewDialog = () => {
    setEditingQuestion(null);
    setFormData({ title: "", title_sw: "", category: "", description: "", question_text: "", question_text_sw: "", language: "en", researcher_id: "" });
    setErrors({});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({ title: "", title_sw: "", category: "", description: "", question_text: "", question_text_sw: "", language: "en", researcher_id: "" });
    setEditingQuestion(null);
  };

  const toggleGroup = (key: string) =>
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Filtering & grouping ────────────────────────────────────────────────────

  // Filter questions based on user role
  let visibleQuestions = questions;
  
  // If researcher (not admin), only show their own questions
  if (isResearcher && !isAdmin && currentUserId) {
    visibleQuestions = questions.filter((q) => q.researcher_id === currentUserId);
  }

  const filtered = visibleQuestions.filter((q) => {
    const langOk = languageFilter === "all" || q.language === languageFilter;
    const resOk = researcherFilter === "all" || q.researcher_id === researcherFilter;
    return langOk && resOk;
  });

  // Group by researcher
  type Group = { key: string; label: string; questions: ResearchQuestion[] };

  const groupMap: Record<string, Group> = {};
  for (const q of filtered) {
    const key = q.researcher_id || "__unassigned__";
    const label = q.researcher_name ||
      researchers.find((r) => r.id === q.researcher_id)?.full_name ||
      (q.researcher_id ? q.researcher_id : "Unassigned");
    if (!groupMap[key]) groupMap[key] = { key, label, questions: [] };
    groupMap[key].questions.push(q);
  }

  // Assigned groups first, then unassigned
  const groups: Group[] = [
    ...Object.values(groupMap).filter((g) => g.key !== "__unassigned__"),
    ...(groupMap["__unassigned__"] ? [groupMap["__unassigned__"]] : []),
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="page-header-gradient flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Research Questions</h1>
            <p className="text-sm text-muted-foreground">
              Manage questions deployed to the voice & USSD system — grouped by researcher
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2">
          {/* Language filter */}
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="sw">🇰🇪 Kiswahili</SelectItem>
            </SelectContent>
          </Select>

          {/* Researcher filter - only show for admins */}
          {isAdmin && (
            <Select value={researcherFilter} onValueChange={setResearcherFilter}>
              <SelectTrigger className="w-[180px] h-9 text-sm">
                <SelectValue placeholder="All Researchers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Researchers</SelectItem>
                {researchers.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>
                ))}
                <SelectItem value="__unassigned__">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* New question dialog */}
          <Dialog open={isDialogOpen} onOpenChange={(o) => { if (!o) closeDialog(); else setIsDialogOpen(true); }}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog} className="h-9 gap-1.5">
                <Plus className="h-4 w-4" />
                New Question
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {editingQuestion ? "Edit Question" : "Create New Question"}
                </DialogTitle>
                <DialogDescription>
                  {editingQuestion
                    ? "Update the research question details."
                    : "Add a new research question to the voice / USSD survey system."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="title">Question Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Healthcare Access"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>

                {/* Assign to Researcher - only show for admins */}
                {isAdmin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="researcher">Assign to Researcher</Label>
                    <Select
                      value={formData.researcher_id}
                      onValueChange={(v) => setFormData({ ...formData, researcher_id: v })}
                    >
                      <SelectTrigger id="researcher">
                        <SelectValue placeholder="Select researcher (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">— No researcher —</SelectItem>
                        {researchers.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            <div className="flex items-center gap-2">
                              <User2 className="h-3.5 w-3.5 text-muted-foreground" />
                              {r.full_name}
                              <span className="text-xs text-muted-foreground">@{r.username}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      USSD flow will present this question under the chosen researcher's group.
                    </p>
                  </div>
                )}

                {/* Info for researchers */}
                {isResearcher && !isAdmin && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This question will be automatically assigned to you.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Category + Language side-by-side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Economic">Economic</SelectItem>
                        <SelectItem value="Environment">Environment</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(v) => setFormData({ ...formData, language: v })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="sw">🇰🇪 Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose and scope..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                </div>

                {/* Question text */}
                <div className="space-y-1.5">
                  <Label htmlFor="question_text">Question Text</Label>
                  <Textarea
                    id="question_text"
                    placeholder="The actual question asked to participants..."
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                    rows={2}
                  />
                  {errors.question_text && <p className="text-xs text-destructive">{errors.question_text}</p>}
                </div>

                {/* Swahili translation */}
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    🇰🇪 Kiswahili Translation (optional)
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="title_sw">Swahili Title</Label>
                    <Input
                      id="title_sw"
                      placeholder="e.g., Upatikanaji wa Huduma za Afya"
                      value={formData.title_sw}
                      onChange={(e) => setFormData({ ...formData, title_sw: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="question_text_sw">Swahili Question Text</Label>
                    <Textarea
                      id="question_text_sw"
                      placeholder="Swali halisi linaulizwa kwa washiriki..."
                      value={formData.question_text_sw}
                      onChange={(e) => setFormData({ ...formData, question_text_sw: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                {!editingQuestion && (
                  <Button variant="secondary" onClick={() => handleSubmit(true)}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Save & Add Another
                  </Button>
                )}
                <Button onClick={() => handleSubmit()}>
                  {editingQuestion ? "Save Changes" : "Create Question"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Error Alert ── */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ── Summary Stats ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {isResearcher && !isAdmin ? "My Questions" : "Total Questions"}
          </p>
          <p className="mt-1 text-3xl font-bold text-foreground">{visibleQuestions.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active Questions</p>
          <p className="mt-1 text-3xl font-bold text-success">{visibleQuestions.filter((q) => q.is_active).length}</p>
        </div>
        {isAdmin && (
          <>
            <div className="stat-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Researchers</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{researchers.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">with assigned questions</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unassigned</p>
              <p className="mt-1 text-3xl font-bold text-warning">
                {questions.filter((q) => !q.researcher_id).length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">no researcher assigned</p>
            </div>
          </>
        )}
        {isResearcher && !isAdmin && (
          <>
            <div className="stat-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Responses</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {visibleQuestions.reduce((sum, q) => sum + (q.response_count || 0), 0)}
              </p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avg per Question</p>
              <p className="mt-1 text-3xl font-bold text-primary">
                {visibleQuestions.length > 0 
                  ? Math.round(visibleQuestions.reduce((sum, q) => sum + (q.response_count || 0), 0) / visibleQuestions.length)
                  : 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Grouped question sections ── */}
      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <FlaskConical className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No questions match your filters.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNewDialog}>
            <Plus className="mr-2 h-4 w-4" />Add Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const isCollapsed = collapsedGroups[group.key] ?? false;
            const isUnassigned = group.key === "__unassigned__";
            return (
              <div key={group.key} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">

                {/* Group header */}
                <button
                  className="researcher-group-header w-full"
                  onClick={() => toggleGroup(group.key)}
                >
                  {/* Avatar circle */}
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    isUnassigned
                      ? "bg-muted text-muted-foreground"
                      : "bg-gradient-to-br from-primary to-accent text-white"
                  )}>
                    {isUnassigned
                      ? <Users className="h-4 w-4" />
                      : group.label.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 text-left">
                    <p className={cn(
                      "text-sm font-semibold",
                      isUnassigned ? "text-muted-foreground italic" : "text-foreground"
                    )}>
                      {isUnassigned ? "Unassigned Questions" : group.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {group.questions.length} question{group.questions.length !== 1 ? "s" : ""}
                      {" · "}
                      {group.questions.filter((q) => q.is_active).length} active
                    </p>
                  </div>

                  {/* Question count badge */}
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {group.questions.length}
                  </span>

                  {isCollapsed
                    ? <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  }
                </button>

                {/* Questions table */}
                {!isCollapsed && (
                  <div className="border-t border-border">
                    <Table className="data-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Language</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Responses</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.questions.map((q) => (
                          <TableRow key={q.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium text-foreground">{q.title}</TableCell>
                            <TableCell>
                              <CategoryBadge category={q.category} />
                            </TableCell>
                            <TableCell>
                              <LangBadge lang={q.language} />
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-muted-foreground text-xs">
                              {q.description}
                            </TableCell>
                            <TableCell className="text-sm">
                              {(q.response_count || 0).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <span className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                q.is_active
                                  ? "bg-success/10 text-success"
                                  : "bg-muted text-muted-foreground"
                              )}>
                                {q.is_active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {canModifyQuestion(q) ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={cn(
                                        "h-7 w-7 rounded-lg",
                                        q.is_active ? "hover:bg-success/10" : "hover:bg-destructive/10"
                                      )}
                                      onClick={() => handleToggleStatus(q)}
                                      title={q.is_active ? "Deactivate" : "Activate"}
                                    >
                                      {q.is_active
                                        ? <ToggleRight className="h-4 w-4 text-success" />
                                        : <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                      }
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-lg hover:bg-muted"
                                      onClick={() => handleEdit(q)}
                                      title="Edit"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                                      onClick={() => handleDelete(q.id)}
                                      title="Delete"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </>
                                ) : (
                                  <span className="text-xs text-muted-foreground italic px-2">
                                    View only
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
