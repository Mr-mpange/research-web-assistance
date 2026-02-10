import { useState } from "react";
import { MessageSquare, Send, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function SMSManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendSMS = async () => {
    if (!phoneNumber || !message) {
      toast({
        title: "Error",
        description: "Please enter both phone number and message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // TODO: Implement actual SMS sending via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "SMS sent successfully!",
      });
      
      setPhoneNumber("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send SMS",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const stats = [
    {
      title: "SMS Sent Today",
      value: "127",
      icon: Send,
      description: "+12% from yesterday",
    },
    {
      title: "Total Recipients",
      value: "1,234",
      icon: Users,
      description: "Active participants",
    },
    {
      title: "Delivery Rate",
      value: "98.5%",
      icon: CheckCircle,
      description: "Last 30 days",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SMS Management</h1>
        <p className="text-muted-foreground">
          Send SMS notifications and manage bulk messaging
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Send SMS Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send SMS
          </CardTitle>
          <CardDescription>
            Send SMS to participants or bulk messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/160 characters
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSendSMS} disabled={sending}>
              <Send className="mr-2 h-4 w-4" />
              {sending ? "Sending..." : "Send SMS"}
            </Button>
            {user?.role === 'admin' && (
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Send Bulk SMS
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent SMS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent SMS</CardTitle>
          <CardDescription>
            Recently sent messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">+254712345678</p>
                  <p className="text-sm text-muted-foreground">
                    Thank you for participating in our research...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sent 2 hours ago
                  </p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
