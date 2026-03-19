import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw, Gift, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { projectsService } from "@/services/apiService";

interface Reward {
  id: string;
  participant_id: string;
  project_id: string;
  phone_number: string;
  amount: string;
  currency: string;
  status: "sent" | "failed";
  created_at: string;
  participant_name?: string;
}

interface Project {
  id: string;
  title: string;
}

export default function AirtimeRewards() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [rewardsByProject, setRewardsByProject] = useState<Record<string, Reward[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pr = await projectsService.list();
      if (!pr.success) throw new Error((pr as any).error || "Failed to load projects");
      const projs: Project[] = (pr as any).data?.projects || [];
      setProjects(projs);

      const map: Record<string, Reward[]> = {};
      await Promise.all(
        projs.map(async (p) => {
          const r = await (projectsService as any).getRewards(p.id);
          map[p.id] = (r as any).data?.rewards || [];
        })
      );
      setRewardsByProject(map);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const allRewards = Object.values(rewardsByProject).flat();
  const sent = allRewards.filter((r) => r.status === "sent").length;
  const failed = allRewards.filter((r) => r.status === "failed").length;
  const totalAmount = allRewards
    .filter((r) => r.status === "sent")
    .reduce((s, r) => s + parseFloat(r.amount), 0);

  if (loading) {
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
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" /> Airtime Rewards
          </h1>
          <p className="text-sm text-muted-foreground">
            50 TZS sent automatically to participants on first response per project
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Rewards</p>
          <p className="text-2xl font-semibold">{allRewards.length}</p>
          <p className="text-xs text-muted-foreground mt-1">across {projects.length} projects</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Successfully Sent</p>
          <p className="text-2xl font-semibold text-green-600">{sent}</p>
          <p className="text-xs text-muted-foreground mt-1">{totalAmount.toFixed(0)} TZS disbursed</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Failed</p>
          <p className="text-2xl font-semibold text-red-500">{failed}</p>
          <p className="text-xs text-muted-foreground mt-1">may need retry</p>
        </div>
      </div>

      {/* Per-project tables */}
      {projects.map((project) => {
        const rewards = rewardsByProject[project.id] || [];
        if (rewards.length === 0) return null;
        return (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{project.title}</CardTitle>
              <CardDescription>{rewards.length} reward(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-sm">{r.phone_number}</TableCell>
                      <TableCell>{r.amount} {r.currency}</TableCell>
                      <TableCell>
                        {r.status === "sent" ? (
                          <Badge className="bg-green-100 text-green-800 gap-1">
                            <CheckCircle className="h-3 w-3" /> Sent
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 gap-1">
                            <XCircle className="h-3 w-3" /> Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

      {allRewards.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gift className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No rewards yet</p>
            <p className="text-sm text-muted-foreground">
              Rewards are sent automatically when participants submit their first response
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
