import { useState, useEffect } from "react";
import { Download, Copy, ChevronLeft, ChevronRight, Loader2, AlertCircle, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface TranscriptRecord {
  id: string;
  created_at: string;
  phone_number: string;
  question_title?: string;
  response_text?: string;
  transcribed_text?: string;
  summary_text?: string;
  key_points?: string[];
  sentiment?: string;
  audio_file_path?: string;
  response_type: string;
}

export default function Transcriptions() {
  const [transcripts, setTranscripts] = useState<TranscriptRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { loading, error, fetchResponses } = useBackendApi();
  const { toast } = useToast();

  useEffect(() => {
    loadTranscripts();
  }, []);

  const loadTranscripts = async () => {
    const result = await fetchResponses({
      page: 1,
      limit: 100,
      includeAI: true,
    });

    if (result.success && result.data) {
      const responses = result.data.responses || result.data;
      if (Array.isArray(responses)) {
        // Filter only responses with transcriptions or summaries
        const withTranscripts = responses.filter(
          (r: TranscriptRecord) => r.transcribed_text || r.summary_text
        );
        setTranscripts(withTranscripts);
      }
    }
  };

  const selectedTranscript = transcripts[selectedIndex] || null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handlePlayAudio = () => {
    if (!selectedTranscript?.audio_file_path) {
      toast({
        title: "No Audio",
        description: "Audio file not available for this recording",
        variant: "destructive",
      });
      return;
    }

    const audioUrl = `${API_BASE_URL}${selectedTranscript.audio_file_path}`;
    const audio = new Audio(audioUrl);
    
    audio.play().then(() => {
      setAudioPlaying(true);
      toast({
        title: "Playing Audio",
        description: "Audio playback started",
      });
    }).catch((err) => {
      toast({
        title: "Playback Error",
        description: "Failed to play audio file",
        variant: "destructive",
      });
    });

    audio.onended = () => setAudioPlaying(false);
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export feature coming soon",
    });
  };

  const handleExportCSV = () => {
    if (transcripts.length === 0) {
      toast({
        title: "No Data",
        description: "No transcripts available to export",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ["ID", "Date", "Phone", "Question", "Transcript", "Summary", "Sentiment"];
    const rows = transcripts.map(t => [
      t.id,
      new Date(t.created_at).toLocaleDateString(),
      t.phone_number || "N/A",
      t.question_title || "N/A",
      (t.transcribed_text || "").replace(/"/g, '""'),
      (t.summary_text || "").replace(/"/g, '""'),
      t.sentiment || "N/A"
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcripts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${transcripts.length} transcripts to CSV`,
    });
  };

  const goToPrevious = () => {
    setSelectedIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex(prev => Math.min(transcripts.length - 1, prev + 1));
  };

  if (loading && transcripts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!loading && transcripts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Transcriptions & Summaries</h1>
          <p className="text-sm text-muted-foreground">
            Review transcribed interviews and AI-generated summaries — Real-time data
          </p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No transcriptions available yet. Voice recordings will appear here once processed by AI.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Transcriptions & Summaries</h1>
          <p className="text-sm text-muted-foreground">
            Review transcribed interviews and AI-generated summaries — Real-time data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Record Selector */}
      <div className="flex items-center gap-4">
        <Select
          value={selectedTranscript?.id || ""}
          onValueChange={(id) => {
            const index = transcripts.findIndex((t) => t.id === id);
            if (index !== -1) setSelectedIndex(index);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a transcript" />
          </SelectTrigger>
          <SelectContent>
            {transcripts.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.id.substring(0, 8)} - {new Date(t.created_at).toLocaleDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={goToPrevious}
            disabled={selectedIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={goToNext}
            disabled={selectedIndex >= transcripts.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Record {selectedIndex + 1} of {transcripts.length}
        </div>
        {selectedTranscript?.audio_file_path && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePlayAudio}
            disabled={audioPlaying}
          >
            {audioPlaying ? (
              <>
                <Volume2 className="mr-2 h-4 w-4 animate-pulse" />
                Playing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play Audio
              </>
            )}
          </Button>
        )}
      </div>

      {selectedTranscript && (
        <>
          {/* Metadata */}
          <div className="grid gap-4 rounded-md border bg-card p-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Phone Number</p>
              <p className="text-sm font-medium">{selectedTranscript.phone_number || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Date</p>
              <p className="text-sm font-medium">
                {new Date(selectedTranscript.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Research Question</p>
              <p className="text-sm font-medium">{selectedTranscript.question_title || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Sentiment</p>
              <p className="text-sm font-medium capitalize">
                {selectedTranscript.sentiment || "N/A"}
              </p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Transcript Panel */}
            <div className="rounded-md border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold">Full Transcript</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleCopy(
                    selectedTranscript.transcribed_text || selectedTranscript.response_text || "",
                    "Transcript"
                  )}
                  disabled={!selectedTranscript.transcribed_text && !selectedTranscript.response_text}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <ScrollArea className="h-96 p-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {selectedTranscript.transcribed_text || 
                   selectedTranscript.response_text || 
                   "No transcript available"}
                </div>
              </ScrollArea>
            </div>

            {/* Summary Panel */}
            <div className="space-y-4">
              <div className="rounded-md border bg-card">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <h3 className="text-sm font-semibold">AI-Generated Summary</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy(selectedTranscript.summary_text || "", "Summary")}
                    disabled={!selectedTranscript.summary_text}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <ScrollArea className="h-48 p-4">
                  <div className="text-sm leading-relaxed text-foreground">
                    {selectedTranscript.summary_text || "No summary available yet. AI processing may be in progress."}
                  </div>
                </ScrollArea>
              </div>

              {selectedTranscript.key_points && selectedTranscript.key_points.length > 0 && (
                <div className="rounded-md border bg-card">
                  <div className="border-b px-4 py-3">
                    <h3 className="text-sm font-semibold">Key Points</h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {selectedTranscript.key_points.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="rounded-md border bg-card p-4">
                <h3 className="text-sm font-semibold mb-3">Recording Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Record ID:</span>
                    <span className="font-mono text-xs">{selectedTranscript.id.substring(0, 12)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{selectedTranscript.response_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audio Available:</span>
                    <span>{selectedTranscript.audio_file_path ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AI Processed:</span>
                    <span>{selectedTranscript.summary_text ? "Yes" : "Pending"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
