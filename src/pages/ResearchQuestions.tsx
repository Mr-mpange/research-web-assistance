import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBackendApi } from "@/hooks/useBackendApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
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

interface ResearchQuestion {
  id: string;
  title: string;
  category: string;
  description: string;
  question_text?: string;
  is_active: boolean;
  response_count?: number;
  created_at: string;
}

export default function ResearchQuestions() {
  const [questions, setQuestions] = useState<ResearchQuestion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ResearchQuestion | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    question_text: "",
    language: "en",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loading, error, fetchQuestions, createQuestion, updateQuestion, deleteQuestion } = useBackendApi();
  const { toast } = useToast();

  // Load questions from backend
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    // Add timestamp to bypass cache
    const result = await fetchQuestions({ _t: Date.now() } as any);
    if (result.success) {
      const questionsData = (result as any).data?.questions || (result as any).data || [];
      if (Array.isArray(questionsData)) {
        setQuestions(questionsData);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.question_text.trim()) {
      newErrors.question_text = "Question text is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingQuestion) {
        const result = await updateQuestion(editingQuestion.id, {
          ...formData,
          is_active: editingQuestion.is_active,
        });
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Question updated successfully",
          });
          await loadQuestions();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update question",
            variant: "destructive",
          });
        }
      } else {
        const result = await createQuestion({
          ...formData,
          is_active: true,
        });
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Question created successfully",
          });
          await loadQuestions();
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create question",
            variant: "destructive",
          });
        }
      }

      setIsDialogOpen(false);
      setFormData({ title: "", category: "", description: "", question_text: "", language: "en" });
      setEditingQuestion(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (question: ResearchQuestion) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      category: question.category,
      description: question.description,
      question_text: question.question_text || "",
      language: (question as any).language || "en",
    });
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (question: ResearchQuestion) => {
    const newStatus = !question.is_active;
    const result = await updateQuestion(question.id, {
      is_active: newStatus,
    });
    
    if (result.success) {
      toast({
        title: "Success",
        description: `Question ${newStatus ? 'activated' : 'deactivated'}`,
      });
      await loadQuestions();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update question status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    const result = await deleteQuestion(id);
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      await loadQuestions();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const openNewDialog = () => {
    setEditingQuestion(null);
    setFormData({ title: "", category: "", description: "", question_text: "", language: "en" });
    setErrors({});
    setIsDialogOpen(true);
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Research Questions</h1>
          <p className="text-sm text-muted-foreground">
            Manage research questions deployed to the voice system — Real-time data
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sw">Kiswahili</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New Question
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Create New Question"}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion
                  ? "Update the research question details."
                  : "Add a new research question to the voice survey system."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Healthcare Access"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Economic">Economic</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sw">Kiswahili</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  USSD users will see questions in their selected language
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and scope of this research question..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="question_text">Question Text</Label>
                <Textarea
                  id="question_text"
                  placeholder="The actual question that will be asked to participants..."
                  value={formData.question_text}
                  onChange={(e) =>
                    setFormData({ ...formData, question_text: e.target.value })
                  }
                  rows={2}
                />
                {errors.question_text && (
                  <p className="text-xs text-destructive">{errors.question_text}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingQuestion ? "Save Changes" : "Create Question"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
          <p className="text-2xl font-semibold">{questions.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Active Questions</p>
          <p className="text-2xl font-semibold">
            {questions.filter((q) => q.is_active).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">English Questions</p>
          <p className="text-2xl font-semibold">
            {questions.filter((q) => (q as any).language === 'en').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Kiswahili Questions</p>
          <p className="text-2xl font-semibold">
            {questions.filter((q) => (q as any).language === 'sw').length}
          </p>
        </div>
      </div>

      {/* Questions Table */}
      <div className="rounded-md border bg-card">
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
            {questions
              .filter((q) => languageFilter === "all" || (q as any).language === languageFilter)
              .map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{question.title}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                    {question.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-1 text-xs font-medium">
                    {(question as any).language === 'sw' ? '🇰🇪 Kiswahili' : '🇬🇧 English'}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {question.description}
                </TableCell>
                <TableCell>{(question.response_count || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      question.is_active
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {question.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        question.is_active 
                          ? "hover:bg-success/10" 
                          : "hover:bg-destructive/10"
                      }`}
                      onClick={() => handleToggleStatus(question)}
                      title={question.is_active ? "Deactivate" : "Activate"}
                    >
                      {question.is_active ? (
                        <ToggleRight className="h-4 w-4 text-success" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(question)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
