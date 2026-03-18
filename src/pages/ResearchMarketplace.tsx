import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, BookOpen, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBackendApi } from "@/hooks/useBackendApi";

interface Project {
  id: string;
  title: string;
  description: string;
  researcher_name: string;
  question_count: number;
  response_count: number;
  created_at: string;
}

export default function ResearchMarketplace() {
  const navigate = useNavigate();
  const { fetchProjects, loading, error } = useBackendApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects().then((r: any) => {
      if (r.success) setProjects(r.data?.projects || []);
    });
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.researcher_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary/5 border-b py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Research Marketplace</h1>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Browse active research projects and share your insights.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search projects or researchers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No projects found.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card key={project.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-snug">{project.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  {project.researcher_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {project.description || "No description provided."}
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {project.question_count} questions
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.response_count} responses
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  Participate <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
