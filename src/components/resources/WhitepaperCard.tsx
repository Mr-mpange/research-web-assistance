import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";

interface Whitepaper {
  title: string;
  description: string;
  pages: string;
  filename: string;
}

interface WhitepaperCardProps {
  paper: Whitepaper;
}

export function WhitepaperCard({ paper }: WhitepaperCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Request whitepaper download from backend
      const response = await fetch(`${API_BASE_URL}/api/whitepapers/${encodeURIComponent(paper.filename)}`, {
        method: 'GET',
      });

      if (response.status === 404) {
        toast.info(`"${paper.title}" will be available for download soon. Contact us for early access.`);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to download whitepaper');
      }

      // Get the download URL from response
      const data = await response.json();
      
      if (data.downloadUrl) {
        // Open in new tab to trigger download
        window.open(data.downloadUrl, "_blank");
        toast.success("Download started!");
      } else {
        toast.info(`"${paper.title}" will be available for download soon. Contact us for early access.`);
      }
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("Failed to download. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{paper.title}</CardTitle>
        <CardDescription>{paper.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {paper.pages}
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
