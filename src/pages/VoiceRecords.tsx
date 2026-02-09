import { useState, useEffect } from "react";
import { Search, Filter, Play, FileText, Download, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBackendApi } from "@/hooks/useBackendApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface VoiceRecord {
  id: string;
  created_at: string;
  phone_number: string;
  question_title?: string;
  response_type: string;
  audio_file_path?: string;
  transcribed_text?: string;
  summary_text?: string;
}

export default function VoiceRecords() {
  const [voiceRecords, setVoiceRecords] = useState<VoiceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [questionFilter, setQuestionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, error, fetchResponses } = useBackendApi();

  useEffect(() => {
    loadVoiceRecords();
  }, [currentPage]);

  const loadVoiceRecords = async () => {
    const result = await fetchResponses({
      page: currentPage,
      limit: 50,
      type: 'voice',
      includeAI: true,
    });

    if (result.success && result.data) {
      const responses = result.data.responses || result.data;
      if (Array.isArray(responses)) {
        setVoiceRecords(responses);
      }
      
      if (result.data.pagination) {
        setTotalPages(result.data.pagination.pages || 1);
      }
    }
  };

  const filteredRecords = voiceRecords.filter((record) => {
    const matchesSearch =
      record.phone_number?.includes(searchQuery) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesQuestion =
      questionFilter === "all" || record.question_title === questionFilter;
    return matchesSearch && matchesQuestion;
  });

  const getStatus = (record: VoiceRecord) => {
    if (record.summary_text) return "completed";
    if (record.transcribed_text) return "processing";
    return "pending";
  };

  const statusStyles = {
    completed: "bg-success/10 text-success",
    processing: "bg-warning/10 text-warning",
    pending: "bg-muted text-muted-foreground",
  };

  if (loading && voiceRecords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Voice Records</h1>
        <p className="text-sm text-muted-foreground">
          Manage and review all recorded voice interviews — Real-time data
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by phone or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={questionFilter} onValueChange={setQuestionFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by question" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              <SelectItem value="Healthcare Access">Healthcare Access</SelectItem>
              <SelectItem value="Water & Sanitation">Water & Sanitation</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Income & Livelihood">Income & Livelihood</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table className="data-table">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Research Question</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => {
              const status = getStatus(record);
              const date = new Date(record.created_at).toLocaleDateString();
              
              return (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{date}</TableCell>
                  <TableCell>{record.phone_number || 'N/A'}</TableCell>
                  <TableCell>{record.question_title || 'N/A'}</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        statusStyles[status]
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {record.audio_file_path && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {record.transcribed_text && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredRecords.length} of {voiceRecords.length} records (Page {currentPage} of {totalPages})
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
