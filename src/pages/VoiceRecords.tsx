import { useState } from "react";
import { Search, Filter, Play, FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  date: string;
  phoneNumber: string;
  question: string;
  duration: string;
  status: "completed" | "processing" | "pending";
}

const voiceRecords: VoiceRecord[] = [
  {
    id: "VR-001",
    date: "2024-01-15",
    phoneNumber: "+254 712 345 678",
    question: "Healthcare Access",
    duration: "3:42",
    status: "completed",
  },
  {
    id: "VR-002",
    date: "2024-01-15",
    phoneNumber: "+254 733 456 789",
    question: "Water & Sanitation",
    duration: "2:18",
    status: "completed",
  },
  {
    id: "VR-003",
    date: "2024-01-14",
    phoneNumber: "+254 722 567 890",
    question: "Healthcare Access",
    duration: "4:55",
    status: "processing",
  },
  {
    id: "VR-004",
    date: "2024-01-14",
    phoneNumber: "+254 745 678 901",
    question: "Education",
    duration: "3:11",
    status: "completed",
  },
  {
    id: "VR-005",
    date: "2024-01-14",
    phoneNumber: "+254 701 789 012",
    question: "Income & Livelihood",
    duration: "5:23",
    status: "completed",
  },
  {
    id: "VR-006",
    date: "2024-01-13",
    phoneNumber: "+254 718 890 123",
    question: "Healthcare Access",
    duration: "2:45",
    status: "pending",
  },
  {
    id: "VR-007",
    date: "2024-01-13",
    phoneNumber: "+254 729 901 234",
    question: "Water & Sanitation",
    duration: "4:02",
    status: "completed",
  },
  {
    id: "VR-008",
    date: "2024-01-12",
    phoneNumber: "+254 736 012 345",
    question: "Education",
    duration: "3:28",
    status: "completed",
  },
];

const statusStyles = {
  completed: "bg-success/10 text-success",
  processing: "bg-warning/10 text-warning",
  pending: "bg-muted text-muted-foreground",
};

export default function VoiceRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [questionFilter, setQuestionFilter] = useState<string>("all");

  const filteredRecords = voiceRecords.filter((record) => {
    const matchesSearch =
      record.phoneNumber.includes(searchQuery) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesQuestion =
      questionFilter === "all" || record.question === questionFilter;
    return matchesSearch && matchesQuestion;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Voice Records</h1>
        <p className="text-sm text-muted-foreground">
          Manage and review all recorded voice interviews
        </p>
      </div>

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
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.date}</TableCell>
                <TableCell>{record.phoneNumber}</TableCell>
                <TableCell>{record.question}</TableCell>
                <TableCell>{record.duration}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      statusStyles[record.status]
                    }`}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredRecords.length} of {voiceRecords.length} records
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
