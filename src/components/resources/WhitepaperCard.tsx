import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      // Check if file exists in storage
      const { data: files, error: listError } = await supabase.storage
        .from("whitepapers")
        .list("", { search: paper.filename });

      if (listError) throw listError;

      const fileExists = files?.some(f => f.name === paper.filename);

      if (!fileExists) {
        toast.info(`"${paper.title}" will be available for download soon. Contact us for early access.`);
        return;
      }

      // Get public URL and download
      const { data } = supabase.storage
        .from("whitepapers")
        .getPublicUrl(paper.filename);

      if (data?.publicUrl) {
        // Open in new tab to trigger download
        window.open(data.publicUrl, "_blank");
        toast.success("Download started!");
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
