import { useState } from "react";
import { Download, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TranscriptRecord {
  id: string;
  date: string;
  phoneNumber: string;
  question: string;
  transcript: string;
  summary: string;
  keyPoints: string[];
}

const transcripts: TranscriptRecord[] = [
  {
    id: "TR-001",
    date: "2024-01-15",
    phoneNumber: "+254 712 345 678",
    question: "Healthcare Access",
    transcript: `Interviewer: Good morning, thank you for participating in our research survey. Can you tell me about your experience accessing healthcare services in your community?

Respondent: Good morning. Well, the nearest health center is about 15 kilometers from our village. We usually have to take a matatu, which costs around 200 shillings each way. For many families, this is a significant expense.

Interviewer: I understand. How often do you or your family members visit the health center?

Respondent: We try to go at least once a month for my mother who has diabetes. But sometimes we skip visits because of the cost. The medication is also expensive when it's not available at the public facility.

Interviewer: Are there any community health workers in your area?

Respondent: Yes, we have two CHWs who visit homes. They help with basic health education and can treat minor ailments. They're very helpful, especially for mothers with young children. But for serious conditions, we still need to travel to the health center.

Interviewer: What improvements would you like to see in healthcare access?

Respondent: I think having a dispensary closer to our village would help a lot. Also, if the government could provide transport subsidies for medical visits, that would reduce our burden. And of course, ensuring medicines are always available at the public facilities.`,
    summary: `The respondent describes significant healthcare access challenges in their rural community. The nearest health center is 15km away, requiring transportation costs of 400 KES round-trip. This expense causes some families to skip medical visits.

Key barriers identified include distance to facilities, transportation costs, and medication availability. Community health workers provide valuable local support for basic care and health education.

The respondent suggests three improvements: establishing a local dispensary, providing transport subsidies for medical visits, and ensuring consistent medication supply at public facilities.`,
    keyPoints: [
      "Nearest health center is 15km away",
      "Transportation costs 400 KES round-trip",
      "Monthly visits for chronic disease management",
      "2 community health workers serve the area",
      "Medication shortages at public facilities",
      "Requests: local dispensary, transport subsidies, consistent drug supply",
    ],
  },
  {
    id: "TR-002",
    date: "2024-01-15",
    phoneNumber: "+254 733 456 789",
    question: "Water & Sanitation",
    transcript: `Interviewer: Thank you for joining us. Can you describe the water situation in your household?

Respondent: Our main water source is a borehole about 500 meters from our home. My children fetch water every morning before school. We use about 60 liters per day for cooking, drinking, and washing.

Interviewer: Is the water from the borehole treated or safe to drink?

Respondent: The borehole was drilled by an NGO three years ago. They tested the water and said it was safe. But we still boil water for drinking, especially for the younger children. During the dry season, the water level drops and we sometimes have to wait in long queues.

Interviewer: What about sanitation facilities in your home?

Respondent: We have a pit latrine that we built ourselves. It's about 20 meters from the house. We try to keep it clean, but it fills up every two years or so, and then we have to dig a new one.

Interviewer: Are there any improvements you'd like to see?

Respondent: A piped water connection would be wonderful, but I know that's expensive. At least if the borehole could be upgraded to serve more people during dry season. For sanitation, training on how to build better latrines that last longer would help.`,
    summary: `The household relies on an NGO-installed borehole 500m from home, using approximately 60 liters daily. Water is boiled before drinking as a safety precaution. Dry season brings reduced water availability and longer wait times.

Sanitation consists of a self-built pit latrine requiring replacement every two years. The respondent demonstrates good hygiene awareness through boiling practices and latrine maintenance.

Priority improvements include borehole capacity upgrades for dry season demand and community training on durable latrine construction techniques.`,
    keyPoints: [
      "Borehole water source 500m from home",
      "60 liters daily consumption",
      "Water boiled for drinking safety",
      "Dry season creates water scarcity",
      "Pit latrine replaced every 2 years",
      "Requests: borehole upgrade, latrine construction training",
    ],
  },
];

export default function Transcriptions() {
  const [selectedTranscript, setSelectedTranscript] = useState(transcripts[0]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Transcriptions & Summaries</h1>
          <p className="text-sm text-muted-foreground">
            Review transcribed interviews and AI-generated summaries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Record Selector */}
      <div className="flex items-center gap-4">
        <Select
          value={selectedTranscript.id}
          onValueChange={(id) => {
            const transcript = transcripts.find((t) => t.id === id);
            if (transcript) setSelectedTranscript(transcript);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {transcripts.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.id} - {t.date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Record 1 of {transcripts.length}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid gap-4 rounded-md border bg-card p-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">Phone Number</p>
          <p className="text-sm font-medium">{selectedTranscript.phoneNumber}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">Date</p>
          <p className="text-sm font-medium">{selectedTranscript.date}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">Research Question</p>
          <p className="text-sm font-medium">{selectedTranscript.question}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">Record ID</p>
          <p className="text-sm font-medium">{selectedTranscript.id}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transcript Panel */}
        <div className="rounded-md border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Full Transcript</h3>
            <Button variant="ghost" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
          <ScrollArea className="h-96 p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {selectedTranscript.transcript}
            </div>
          </ScrollArea>
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          <div className="rounded-md border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">AI-Generated Summary</h3>
              <Button variant="ghost" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <ScrollArea className="h-48 p-4">
              <div className="text-sm leading-relaxed text-foreground">
                {selectedTranscript.summary}
              </div>
            </ScrollArea>
          </div>

          <div className="rounded-md border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Key Points</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {selectedTranscript.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
