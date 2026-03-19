import { useState, useEffect, useCallback } from "react";
import { Brain, Loader2, AlertCircle, RefreshCw, TrendingUp, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectsService } from "@/services/apiService";

interface Insight {
  summary: string;
  themes: Array<{ theme: string; percentage: number; keywords: string[] }>;
  sentiment: "positive" | "negative" | "neutral";
  key_insights: string[];
}

interface AISummary {
  id: string;
  project_id: string;
  question_id: string | null;
  summary_text: string;
  insights_json: string | Insight;
  created_at: string;
  question_title?: string;
}

interface Project {
  id: string;
  title: string;
  question_count: number;
  response_count: number;
}

interface Question {
  id: string;
  title: string;
  question_text: string;
}

function parseInsights(raw: string | Insight | null): Insight | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw as Insight;
  try { return JSON.parse(raw); } catch { return null; }
}

const sentimentColor = (s: string) =>
  s === "positive" ? "bg-green-100 text-green-800" :
  s === "negative" ? "bg-red-100 text-red-800" :
  "bg-gray-100 text-gray-700";

const sentimentEmoji = (s: string) =>
  s === "positive" ? "😊" : s === "negative" ? "😟" : "😐";

function SummaryCard({ summary }: { summary: AISummary }) {
  const [expanded, setExpanded] = useState(false);
  const insights = parseInsights(summary.insights_json);

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold">
              {summary.question_title || "Project-level Summary"}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {new Date(summary.created_at).toLocaleString()}
            </CardDescription>
          </div>
          {insights?.sentiment && (
            <Badge className={sentimentColor(insights.sentiment)}>
              {sentimentEmoji(insights.sentiment)} {insights.sentiment}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{summary.summary_text}</p>

        {insights && (
          <>
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? "Hide details" : "Show details"}
            </button>

            {expanded && (
              <div className="space-y-3 pt-1">
                {insights.key_insights?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Key Insights
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {insights.key_insights.map((k, i) => (
                        <li key={i} className="text-xs text-muted-foreground">{k}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {insights.themes?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Themes
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {insights.themes.map((t, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {t.theme} {t.percentage != null ? `(${t.percentage}%)` : ""}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AISummaries() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [summariesByProject, setSummariesByProject] = useState<Record<string, AISummary[]>>({});
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoadingAll(true);
    setError(null);
    try {
      const res = await projectsService.list();
      if (!res.success) throw new Error((res as any).error || "Failed to load projects");
      const projs: Project[] = (res as any).data?.projects || [];
      setProjects(projs);

      // Load summaries for each project
      const map: Record<string, AISummary[]> = {};
      await Promise.all(
        projs.map(async (p) => {
          const r = await projectsService.getAISummary(p.id);
          map[p.id] = (r as any).data?.summaries || [];
        })
      );
      setSummariesByProject(map);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingAll(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const generateForProject = async (projectId: string) => {
    setGenerating(g => ({ ...g, [projectId]: true }));
    try {
      // Get questions for this project
      const qRes = await projectsService.getQuestions(projectId);
      const questions: Question[] = (qRes as any).data?.questions || [];

      // Generate project-level summary
      await projectsService.generateAI(projectId, undefined);

      // Generate per-question summaries
      for (const q of questions) {
        await projectsService.generateAI(projectId, q.id);
      }

      // Reload summaries for this project
      const r = await projectsService.getAISummary(projectId);
      setSummariesByProject(prev => ({ ...prev, [projectId]: (r as any).data?.summaries || [] }));

      toast({ title: "AI summaries generated", description: `Done for ${questions.length} question(s)` });
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(g => ({ ...g, [projectId]: false }));
    }
  };

  const generateAll = async () => {
    setGeneratingAll(true);
    for (const p of projects) {
      await generateForProject(p.id);
    }
    setGeneratingAll(false);
    toast({ title: "All summaries generated" });
  };

  const totalSummaries = Object.values(summariesByProject).reduce((s, arr) => s + arr.length, 0);

  if (loadingAll) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">AI Summaries</h1>
          <p className="text-sm text-muted-foreground">
            Gemini-generated insights from research responses, grouped by project
          </p>
        </div>
        <Button
          onClick={generateAll}
          disabled={generatingAll || projects.length === 0}
          size="sm"
          className="gap-2"
        >
          {generatingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
          Generate All
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Projects</p>
          <p className="text-2xl font-semibold">{projects.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Summaries</p>
          <p className="text-2xl font-semibold">{totalSummaries}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Positive Sentiment</p>
          <p className="text-2xl font-semibold">
            {Object.values(summariesByProject).flat().filter(s => {
              const ins = parseInsights(s.insights_json);
              return ins?.sentiment === "positive";
            }).length}
          </p>
        </div>
      </div>

      {/* Per-project sections */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No projects found</p>
          </CardContent>
        </Card>
      ) : (
        projects.map(project => {
          const summaries = summariesByProject[project.id] || [];
          const isGenerating = generating[project.id];

          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{project.title}</CardTitle>
                    <CardDescription>
                      {project.question_count} question(s) · {project.response_count} response(s) · {summaries.length} summary(ies)
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateForProject(project.id)}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    {isGenerating
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <RefreshCw className="h-3 w-3" />}
                    {isGenerating ? "Generating…" : summaries.length > 0 ? "Regenerate" : "Generate"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {summaries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No summaries yet. Click Generate to process responses with AI.
                  </p>
                ) : (
                  summaries.map(s => <SummaryCard key={s.id} summary={s} />)
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
