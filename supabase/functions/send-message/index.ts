import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN") || "";
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") || "";

interface SendMessageRequest {
  to: string;
  messageType: "laundry" | "class" | "task";
}

const messageTemplates = {
  laundry: "הכביסה שלך מוכנה",
  class: "הכיתה ששריינת מוכנה",
  task: "יש לך משימה חדשה"
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const { to, messageType }: SendMessageRequest = await req.json();

    if (!to || !messageType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const messageText = messageTemplates[messageType];
    if (!messageText) {
      return new Response(JSON.stringify({ error: "Invalid message type" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const phoneNumber = to.replace(/[^0-9]/g, "");

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    const data = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: {
        body: messageText
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", result);
      return new Response(JSON.stringify({ error: "Failed to send message", details: result }), {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});