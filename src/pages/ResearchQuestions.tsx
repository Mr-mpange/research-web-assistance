import { useState } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  status: "active" | "inactive";
  responses: number;
  createdAt: string;
}

const initialQuestions: ResearchQuestion[] = [
  {
    id: "RQ-001",
    title: "Healthcare Access",
    category: "Health",
    description: "Questions about access to healthcare facilities, services, and medication in the respondent's community.",
    status: "active",
    responses: 342,
    createdAt: "2024-01-01",
  },
  {
    id: "RQ-002",
    title: "Water & Sanitation",
    category: "Infrastructure",
    description: "Questions about water sources, quality, and sanitation facilities available to households.",
    status: "active",
    responses: 287,
    createdAt: "2024-01-01",
  },
  {
    id: "RQ-003",
    title: "Education",
    category: "Social",
    description: "Questions about access to education, school facilities, and learning outcomes.",
    status: "active",
    responses: 198,
    createdAt: "2024-01-05",
  },
  {
    id: "RQ-004",
    title: "Income & Livelihood",
    category: "Economic",
    description: "Questions about household income sources, employment, and economic challenges.",
    status: "active",
    responses: 156,
    createdAt: "2024-01-08",
  },
  {
    id: "RQ-005",
    title: "Food Security",
    category: "Health",
    description: "Questions about food availability, nutrition, and meal frequency.",
    status: "inactive",
    responses: 45,
    createdAt: "2024-01-10",
  },
];

export default function ResearchQuestions() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ResearchQuestion | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id
            ? { ...q, ...formData }
            : q
        )
      );
    } else {
      const newQuestion: ResearchQuestion = {
        id: `RQ-${String(questions.length + 1).padStart(3, "0")}`,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        status: "active",
        responses: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setQuestions([...questions, newQuestion]);
    }

    setIsDialogOpen(false);
    setFormData({ title: "", category: "", description: "" });
    setEditingQuestion(null);
  };

  const handleEdit = (question: ResearchQuestion) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      category: question.category,
      description: question.description,
    });
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, status: q.status === "active" ? "inactive" : "active" }
          : q
      )
    );
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const openNewDialog = () => {
    setEditingQuestion(null);
    setFormData({ title: "", category: "", description: "" });
    setErrors({});
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Research Questions</h1>
          <p className="text-sm text-muted-foreground">
            Manage research questions deployed to the voice system
          </p>
        </div>
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

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
          <p className="text-2xl font-semibold">{questions.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Active Questions</p>
          <p className="text-2xl font-semibold">
            {questions.filter((q) => q.status === "active").length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Responses</p>
          <p className="text-2xl font-semibold">
            {questions.reduce((sum, q) => sum + q.responses, 0).toLocaleString()}
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
              <TableHead>Description</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{question.title}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                    {question.category}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {question.description}
                </TableCell>
                <TableCell>{question.responses.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      question.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {question.status === "active" ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleStatus(question.id)}
                      title={question.status === "active" ? "Deactivate" : "Activate"}
                    >
                      {question.status === "active" ? (
                        <ToggleRight className="h-4 w-4 text-success" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
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
