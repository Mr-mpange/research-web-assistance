import { Search, Filter, Mail, Phone, MapPin, Loader2, AlertCircle, User2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBackendApi } from "@/hooks/useBackendApi";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
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

interface Participant {
  phone_number: string;
  total_responses: number;
  last_response_date: string;
  response_types: string[];
  questions_answered: number;
  researcher_ids: string[];
  researcher_names: string[];
  question_groups: string[];
}

interface Researcher {
  id: string;
  full_name: string;
  username: string;
  role: string;
}

export default function Participants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [researcherFilter, setResearcherFilter] = useState("all");
  const { loading, error, fetchResponses } = useBackendApi();
  const { toast } = useToast();

  useEffect(() => {
    loadResearchers();
    loadQuestions();
    loadParticipants();
  }, []);

  const loadResearchers = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const all: Researcher[] = Array.isArray(data) ? data : data.users || [];
      setResearchers(all.filter((u) => u.role === "researcher"));
    } catch {
      /* non-critical */
    }
  };

  const loadQuestions = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const questionsData = data.data?.questions || data.questions || [];
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
    } catch {
      /* non-critical */
    }
  };

  const loadParticipants = async () => {
    const result = await fetchResponses({
      page: 1,
      limit: 100,
      _t: Date.now() // Cache busting
    } as any);

    if (result.success) {
      // Handle different response formats
      let responses = [];
      
      if ((result as any).responses) {
        // Format: { success: true, responses: [...] }
        responses = (result as any).responses;
      } else if ((result as any).data?.responses) {
        // Format: { success: true, data: { responses: [...] } }
        responses = (result as any).data.responses;
      } else if ((result as any).data && Array.isArray((result as any).data)) {
        // Format: { success: true, data: [...] }
        responses = (result as any).data;
      }
      
      if (Array.isArray(responses) && responses.length > 0) {
        // Group responses by phone number
        const participantMap = new Map<string, Participant>();
        
        responses.forEach((r: any) => {
          const phone = r.phone_number || "Unknown";
          
          if (!participantMap.has(phone)) {
            participantMap.set(phone, {
              phone_number: phone,
              total_responses: 0,
              last_response_date: r.created_at,
              response_types: [],
              questions_answered: 0,
              researcher_ids: [],
              researcher_names: [],
              question_groups: [],
            });
          }
          
          const participant = participantMap.get(phone)!;
          participant.total_responses++;
          
          if (!participant.response_types.includes(r.response_type)) {
            participant.response_types.push(r.response_type);
          }
          
          // Find the question to get researcher info
          if (r.question_id) {
            const question = questions.find((q: any) => q.id === r.question_id);
            if (question) {
              if (question.researcher_id && !participant.researcher_ids.includes(question.researcher_id)) {
                participant.researcher_ids.push(question.researcher_id);
              }
              if (question.researcher_name && !participant.researcher_names.includes(question.researcher_name)) {
                participant.researcher_names.push(question.researcher_name);
              }
              if (question.title && !participant.question_groups.includes(question.title)) {
                participant.question_groups.push(question.title);
              }
            }
          }
          
          if (new Date(r.created_at) > new Date(participant.last_response_date)) {
            participant.last_response_date = r.created_at;
          }
        });
        
        setParticipants(Array.from(participantMap.values()));
      } else {
        console.log('No responses found or invalid format:', result);
        setParticipants([]);
      }
    } else {
      console.error('Failed to fetch responses:', result);
      setParticipants([]);
    }
  };

  const handleContact = (phone: string) => {
    toast({
      title: "Contact Participant",
      description: `SMS/Call feature for ${phone} coming soon`,
    });
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = p.phone_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || p.response_types.includes(typeFilter);
    const matchesResearcher = researcherFilter === "all" || 
      p.researcher_ids.includes(researcherFilter) ||
      (researcherFilter === "__unassigned__" && p.researcher_ids.length === 0);
    return matchesSearch && matchesType && matchesResearcher;
  });

  if (loading && participants.length === 0) {
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
        <h1 className="text-xl font-semibold text-foreground">Participants</h1>
        <p className="text-sm text-muted-foreground">
          Manage research participants and consent records — Real-time data
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
          <p className="text-2xl font-semibold">{participants.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Voice Participants</p>
          <p className="text-2xl font-semibold">
            {participants.filter((p) => p.response_types.includes("voice")).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">USSD Participants</p>
          <p className="text-2xl font-semibold">
            {participants.filter((p) => p.response_types.includes("ussd")).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Researchers Active</p>
          <p className="text-2xl font-semibold">
            {new Set(participants.flatMap(p => p.researcher_ids)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="voice">Voice Only</SelectItem>
            <SelectItem value="ussd">USSD Only</SelectItem>
          </SelectContent>
        </Select>
        <Select value={researcherFilter} onValueChange={setResearcherFilter}>
          <SelectTrigger className="w-48">
            <User2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Researchers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Researchers</SelectItem>
            {researchers.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>
            ))}
            <SelectItem value="__unassigned__">Unassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Participants Table */}
      <div className="rounded-md border bg-card">
        <Table className="data-table">
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Researcher(s)</TableHead>
              <TableHead>Question Groups</TableHead>
              <TableHead>Response Types</TableHead>
              <TableHead>Total Responses</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No participants found
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants.map((participant, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{participant.phone_number}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {participant.researcher_names.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {participant.researcher_names.map((name, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <User2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 max-w-xs">
                      {participant.question_groups.slice(0, 2).map((group, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium truncate"
                        >
                          {group}
                        </span>
                      ))}
                      {participant.question_groups.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{participant.question_groups.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {participant.response_types.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{participant.total_responses}</TableCell>
                  <TableCell>
                    {new Date(participant.last_response_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleContact(participant.phone_number)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredParticipants.length} of {participants.length} participants
      </p>

      {/* Info */}
      {participants.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Participants are grouped by the researcher's questions they answered. Each participant may respond to multiple researchers' question groups.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
