import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle2, Loader2, AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBackendApi } from "@/hooks/useBackendApi";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  title: string;
  title_sw?: string;
  question_text: string;
  question_text_sw?: string;
  question_type: "text" | "voice" | "multiple_choice";
  language: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  researcher_name: string;
}

type Step = "phone" | "questions" | "done";

export default function ProjectQuestionFlow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchProject, fetchProjectQuestions, submitProjectResponse, loading } = useBackendApi();

  const [project, setProject] = useState<Project | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchProject(id), fetchProjectQuestions(id)]).then(([pr, qr]: any[]) => {
      if (pr.success) setProject(pr.data?.project);
      if (qr.success) setQuestions(qr.data?.questions || []);
    });
  }, [id]);

  const handlePhoneSubmit = () => {
    if (!phone.trim() || phone.length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError(null);
    setStep("questions");
  };

  const currentQuestion = questions[currentIdx];
  const progress = questions.length ? Math.round(((currentIdx) / questions.length) * 100) : 0;

  const handleAnswer = async () => {
    if (!currentQuestion || !id) return;
    const answer = answers[currentQuestion.id] || "";
    if (!answer.trim()) {
      setError("Please provide an answer before continuing.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const result: any = await submitProjectResponse(id, {
      question_id: currentQuestion.id,
      phone_number: phone,
      response_text: answer,
      name: name || undefined,
    });

    setSubmitting(false);

    if (!result.success) {
      toast({ title: "Error", description: result.error || "Failed to submit answer.", variant: "destructive" });
      return;
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setStep("done");
    }
  };

  if (!project && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive" className="max-w-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Project not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">by {project.researcher_name}</p>
        </div>

        {/* Phone step */}
        {step === "phone" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Before we start</CardTitle>
              <CardDescription>Enter your phone number to track your responses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {/* Language selector */}
              <div className="space-y-1">
                <Label>Language / Lugha</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      lang === "en"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("sw")}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      lang === "sw"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    🇰🇪 Kiswahili
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">{lang === "sw" ? "Nambari ya Simu *" : "Phone Number *"}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    className="pl-9"
                    placeholder="+255700000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">{lang === "sw" ? "Jina (si lazima)" : "Name (optional)"}</Label>
                <Input
                  id="name"
                  placeholder={lang === "sw" ? "Jina lako" : "Your name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handlePhoneSubmit}>
                {lang === "sw" ? "Anza Utafiti" : "Start Survey"} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Questions step */}
        {step === "questions" && currentQuestion && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  {lang === "sw" ? "Swali" : "Question"} {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 mb-3" />
              <CardTitle className="text-base">
                {lang === "sw" && currentQuestion.title_sw
                  ? currentQuestion.title_sw
                  : currentQuestion.title}
              </CardTitle>
              {(currentQuestion.question_text || currentQuestion.question_text_sw) && (
                <CardDescription>
                  {lang === "sw" && currentQuestion.question_text_sw
                    ? currentQuestion.question_text_sw
                    : currentQuestion.question_text}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Textarea
                placeholder={lang === "sw" ? "Andika jibu lako hapa..." : "Type your answer here..."}
                rows={4}
                value={answers[currentQuestion.id] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
                }
              />
              <Button className="w-full" onClick={handleAnswer} disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {currentIdx + 1 < questions.length
                  ? (lang === "sw" ? "Swali Lijalo" : "Next Question")
                  : (lang === "sw" ? "Wasilisha" : "Submit")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Done step */}
        {step === "done" && (
          <Card className="text-center">
            <CardContent className="py-12 space-y-4">
              <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold">
                {lang === "sw" ? "Asante sana!" : "Thank you!"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {lang === "sw"
                  ? "Majibu yako yamehifadhiwa. Tunashukuru ushiriki wako."
                  : "Your responses have been recorded. We appreciate your participation."}
              </p>
              <Button variant="outline" onClick={() => navigate("/marketplace")}>
                {lang === "sw" ? "Tazama Miradi Mingine" : "Browse More Projects"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
