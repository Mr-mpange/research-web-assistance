import { Search, Filter, Mail, Phone, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBackendApi } from "@/hooks/useBackendApi";
import { useToast } from "@/hooks/use-toast";
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
}

export default function Participants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { loading, error, fetchResponses } = useBackendApi();
  const { toast } = useToast();

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    const result = await fetchResponses({
      page: 1,
      limit: 100, // Reduced from 1000 to avoid rate limiting
    });

    if (result.success) {
      const responses = (result as any).data?.responses || (result as any).data || [];
      
      if (Array.isArray(responses)) {
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
            });
          }
          
          const participant = participantMap.get(phone)!;
          participant.total_responses++;
          
          if (!participant.response_types.includes(r.response_type)) {
            participant.response_types.push(r.response_type);
          }
          
          if (new Date(r.created_at) > new Date(participant.last_response_date)) {
            participant.last_response_date = r.created_at;
          }
        });
        
        setParticipants(Array.from(participantMap.values()));
      }
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
    return matchesSearch && matchesType;
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
          <p className="text-sm font-medium text-muted-foreground">Total Interactions</p>
          <p className="text-2xl font-semibold">
            {participants.reduce((sum, p) => sum + p.total_responses, 0)}
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
      </div>

      {/* Participants Table */}
      <div className="rounded-md border bg-card">
        <Table className="data-table">
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Response Types</TableHead>
              <TableHead>Total Responses</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
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
            Participant data is aggregated from all responses. Each unique phone number represents one participant.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
