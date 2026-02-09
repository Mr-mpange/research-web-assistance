import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, BookOpen, Newspaper } from "lucide-react";

interface Article {
  category: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  type: string;
}

interface ArticleCardProps {
  article: Article;
}

const getCategoryIcon = (type: string) => {
  switch (type) {
    case "guide":
      return BookOpen;
    case "case-study":
      return FileText;
    case "update":
      return Newspaper;
    default:
      return FileText;
  }
};

const getCategoryColor = (type: string) => {
  switch (type) {
    case "guide":
      return "bg-primary/10 text-primary";
    case "case-study":
      return "bg-secondary/10 text-secondary";
    case "update":
      return "bg-muted text-muted-foreground";
    case "technical":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function ArticleCard({ article }: ArticleCardProps) {
  const Icon = getCategoryIcon(article.type);
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge 
            variant="secondary" 
            className={getCategoryColor(article.type)}
          >
            <Icon className="h-3 w-3 mr-1" />
            {article.category}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="flex-1 leading-relaxed">
          {article.description}
        </CardDescription>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {article.date}
          </span>
          <span>{article.readTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}
