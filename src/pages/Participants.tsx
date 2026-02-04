import { Search, Filter, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
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

interface Participant {
  id: string;
  phoneNumber: string;
  location: string;
  county: string;
  totalCalls: number;
  lastContact: string;
  consent: "given" | "pending" | "withdrawn";
}

const participants: Participant[] = [
  {
    id: "P-001",
    phoneNumber: "+254 712 345 678",
    location: "Kibera, Nairobi",
    county: "Nairobi",
    totalCalls: 5,
    lastContact: "2024-01-15",
    consent: "given",
  },
  {
    id: "P-002",
    phoneNumber: "+254 733 456 789",
    location: "Kisumu Central",
    county: "Kisumu",
    totalCalls: 3,
    lastContact: "2024-01-15",
    consent: "given",
  },
  {
    id: "P-003",
    phoneNumber: "+254 722 567 890",
    location: "Mombasa Island",
    county: "Mombasa",
    totalCalls: 7,
    lastContact: "2024-01-14",
    consent: "given",
  },
  {
    id: "P-004",
    phoneNumber: "+254 745 678 901",
    location: "Eldoret Town",
    county: "Uasin Gishu",
    totalCalls: 2,
    lastContact: "2024-01-14",
    consent: "pending",
  },
  {
    id: "P-005",
    phoneNumber: "+254 701 789 012",
    location: "Nakuru Town",
    county: "Nakuru",
    totalCalls: 4,
    lastContact: "2024-01-13",
    consent: "given",
  },
  {
    id: "P-006",
    phoneNumber: "+254 718 890 123",
    location: "Garissa Town",
    county: "Garissa",
    totalCalls: 1,
    lastContact: "2024-01-12",
    consent: "withdrawn",
  },
];

const consentStyles = {
  given: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  withdrawn: "bg-destructive/10 text-destructive",
};

export default function Participants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countyFilter, setCountyFilter] = useState("all");

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.phoneNumber.includes(searchQuery) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCounty = countyFilter === "all" || p.county === countyFilter;
    return matchesSearch && matchesCounty;
  });

  const counties = [...new Set(participants.map((p) => p.county))];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Participants</h1>
        <p className="text-sm text-muted-foreground">
          Manage research participants and consent records
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
          <p className="text-2xl font-semibold">{participants.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Active Consent</p>
          <p className="text-2xl font-semibold">
            {participants.filter((p) => p.consent === "given").length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Counties Covered</p>
          <p className="text-2xl font-semibold">{counties.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Interactions</p>
          <p className="text-2xl font-semibold">
            {participants.reduce((sum, p) => sum + p.totalCalls, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by phone or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={countyFilter} onValueChange={setCountyFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by county" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Counties</SelectItem>
            {counties.map((county) => (
              <SelectItem key={county} value={county}>
                {county}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Participants Table */}
      <div className="rounded-md border bg-card">
        <Table className="data-table">
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>County</TableHead>
              <TableHead>Total Calls</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Consent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{participant.phoneNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{participant.location}</span>
                  </div>
                </TableCell>
                <TableCell>{participant.county}</TableCell>
                <TableCell>{participant.totalCalls}</TableCell>
                <TableCell>{participant.lastContact}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize ${
                      consentStyles[participant.consent]
                    }`}
                  >
                    {participant.consent}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredParticipants.length} of {participants.length} participants
      </p>
    </div>
  );
}
