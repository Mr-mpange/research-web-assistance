import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactFormData {
  name: string;
  email: string;
  organization?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, organization, message }: ContactFormData = await req.json();

    console.log("Received contact form submission:", { name, email, organization });

    // Validate required fields
    if (!name || !email || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send notification email to the research team
    const emailResponse = await resend.emails.send({
      from: "Voice Research System <onboarding@resend.dev>",
      to: ["research@voiceresearch.org"], // Replace with actual recipient email
      replyTo: email,
      subject: `Demo Request from ${name}${organization ? ` - ${organization}` : ""}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #16697a; padding-bottom: 10px;">New Demo Request</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16697a; margin-top: 0;">Contact Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ""}
          </div>
          
          <div style="background: #fff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px;">
            <h2 style="color: #16697a; margin-top: 0;">Message</h2>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="color: #6c757d; font-size: 12px; margin-top: 30px; text-align: center;">
            This email was sent from the Voice Research System contact form.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Send confirmation email to the user
    await resend.emails.send({
      from: "Voice Research System <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for your interest in Voice Research System",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #16697a; padding-bottom: 10px;">Thank You, ${name}!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            We've received your demo request and our team will be in touch within 1-2 business days.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            In the meantime, feel free to explore our resources:
          </p>
          
          <ul style="color: #333; line-height: 1.8;">
            <li>Learn about our <a href="#" style="color: #16697a;">Features</a></li>
            <li>Read about <a href="#" style="color: #16697a;">How It Works</a></li>
            <li>Discover our <a href="#" style="color: #16697a;">Mission</a></li>
          </ul>
          
          <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Voice Research System Team
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent to user");

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
