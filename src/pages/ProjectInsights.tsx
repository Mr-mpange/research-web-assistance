import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Brain, RefreshCw, Loader2, AlertCircle, TrendingUp, MessageSquare, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBackendApi } from "@/hooks/useBackendApi";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface AISummary {
  id: string;
  question_id: string | null;
  question_title: string | null;
  summary_text: string;
  insights_json: {
    themes?: Array<{ theme: string; percentage: number; keywords: string[] }>;
    sentiment?: string;
    key_insights?: string[];
  };
  created_at: string;
}

interface Question {
  id: string;
  title: string;
}

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "bg-green-100 text-green-800",
  negative: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-700",
};

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export default function ProjectInsights() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const {
    fetchProjectQuestions,
    fetchProjectAISummary,
    generateProjectAI,
    loading,
  } = useBackendApi();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [summaries, setSummaries] = useState<AISummary[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("all");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProjectQuestions(id).then((r: any) => {
      if (r.success) setQuestions(r.data?.questions || []);
    });
    loadSummaries();
  }, [id]);

  const loadSummaries = async () => {
    if (!id) return;
    const qid = selectedQuestion !== "all" ? selectedQuestion : undefined;
    const r: any = await fetchProjectAISummary(id, qid);
    if (r.success) setSummaries(r.data?.summaries || []);
    else setError(r.error || "Failed to load summaries");
  };

  useEffect(() => { loadSummaries(); }, [selectedQuestion]);

  const handleGenerate = async () => {
    if (!id) return;
    setGenerating(true);
    const qid = selectedQuestion !== "all" ? selectedQuestion : undefined;
    const r: any = await generateProjectAI(id, qid);
    setGenerating(false);
    if (r.success) {
      toast({ title: "AI summary generated" });
      loadSummaries();
    } else {
      toast({ title: "Failed", description: r.error, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">AI Insights</h1>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filter by question" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              {questions.map((q) => (
                <SelectItem key={q.id} value={q.id}>{q.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={generating || loading} size="sm">
            {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Generate AI
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !generating && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && summaries.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Brain className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No AI summaries yet. Click "Generate AI" to analyze responses.</p>
          </CardContent>
        </Card>
      )}

      {summaries.map((s) => {
        const insights = s.insights_json || {};
        const themes = insights.themes || [];
        const keyInsights = insights.key_insights || [];
        const sentiment = insights.sentiment || "neutral";

        return (
          <Card key={s.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle className="text-base">
                    {s.question_title || "Project-Level Summary"}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Generated {new Date(s.created_at).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge className={SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS.neutral}>
                  {sentiment}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Summary text */}
              <div className="flex gap-2">
                <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed">{s.summary_text}</p>
              </div>

              {/* Key insights */}
              {keyInsights.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Key Insights
                  </p>
                  <ul className="space-y-1">
                    {keyInsights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Themes chart */}
              {themes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <BarChart2 className="inline h-3.5 w-3.5 mr-1" />
                    Theme Distribution
                  </p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={themes} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="theme" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: any) => `${v}%`} />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                        {themes.map((_: any, i: number) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {themes.flatMap((t: any) => t.keywords || []).slice(0, 12).map((kw: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
