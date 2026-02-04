import { FileText, Download, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Report {
  id: string;
  name: string;
  type: "weekly" | "monthly" | "custom";
  generatedAt: string;
  size: string;
  format: "pdf" | "csv" | "xlsx";
}

const reports: Report[] = [
  {
    id: "RPT-001",
    name: "Weekly Summary - Week 2, January 2024",
    type: "weekly",
    generatedAt: "2024-01-15 09:30",
    size: "2.4 MB",
    format: "pdf",
  },
  {
    id: "RPT-002",
    name: "Voice Records Export - January 2024",
    type: "monthly",
    generatedAt: "2024-01-14 14:22",
    size: "8.1 MB",
    format: "csv",
  },
  {
    id: "RPT-003",
    name: "Participant Demographics Report",
    type: "custom",
    generatedAt: "2024-01-13 11:15",
    size: "1.2 MB",
    format: "xlsx",
  },
  {
    id: "RPT-004",
    name: "Weekly Summary - Week 1, January 2024",
    type: "weekly",
    generatedAt: "2024-01-08 09:30",
    size: "2.1 MB",
    format: "pdf",
  },
  {
    id: "RPT-005",
    name: "Healthcare Access Analysis",
    type: "custom",
    generatedAt: "2024-01-05 16:45",
    size: "3.7 MB",
    format: "pdf",
  },
];

const formatIcons = {
  pdf: "📄",
  csv: "📊",
  xlsx: "📈",
};

export default function Reports() {
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredReports =
    typeFilter === "all"
      ? reports
      : reports.filter((r) => r.type === typeFilter);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Reports & Exports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and download research data reports
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold">Weekly Summary</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Generate this week's summary report
          </p>
          <Button variant="outline" size="sm">
            Generate Report
          </Button>
        </div>
        <div className="stat-card flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold">Export All Data</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Download complete dataset as CSV
          </p>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
        <div className="stat-card flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold">Custom Report</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Create a report with custom parameters
          </p>
          <Button variant="outline" size="sm">
            Create Custom
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Reports</h2>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-md border bg-card p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-lg">
                  {formatIcons[report.format]}
                </div>
                <div>
                  <p className="text-sm font-medium">{report.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Generated: {report.generatedAt}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                    <span>•</span>
                    <span className="uppercase">{report.format}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredReports.length} of {reports.length} reports
      </p>
    </div>
  );
}
