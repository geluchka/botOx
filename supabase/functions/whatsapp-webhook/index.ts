import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VERIFY_TOKEN = "whatsapp_webhook_verify_token_123";
const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN") || "";
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified");
        return new Response(challenge, {
          status: 200,
          headers: corsHeaders,
        });
      } else {
        return new Response("Forbidden", {
          status: 403,
          headers: corsHeaders,
        });
      }
    }

    if (req.method === "POST") {
      const body = await req.json();
      console.log("Webhook received:", JSON.stringify(body, null, 2));

      if (body.entry && body.entry[0]?.changes && body.entry[0].changes[0]?.value?.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from;
        const messageType = message.type;

        if (messageType === "text") {
          await sendServicesMenu(from);
        } else if (messageType === "interactive") {
          const interactiveType = message.interactive.type;
          
          if (interactiveType === "list_reply") {
            const selectedId = message.interactive.list_reply.id;
            await handleMenuSelection(from, selectedId);
          } else if (interactiveType === "button_reply") {
            const selectedId = message.interactive.button_reply.id;
            await handleMenuSelection(from, selectedId);
          }
        }
      }

      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
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

async function sendServicesMenu(to: string) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "תפריט שירותים"
      },
      body: {
        text: "בחר סוג שירות:"
      },
      action: {
        button: "רשימת שירותים",
        sections: [
          {
            title: "שירותים זמינים",
            rows: [
              {
                id: "laundry",
                title: "כביסה"
              },
              {
                id: "class_reservation",
                title: "שריון כיתה"
              },
              {
                id: "doctor_appointment",
                title: "תור לרופא"
              }
            ]
          }
        ]
      }
    }
  };

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function handleMenuSelection(to: string, selectionId: string) {
  if (selectionId === "laundry") {
    await sendLaundryMenu(to);
  } else if (selectionId === "class_reservation") {
    await sendClassMenu(to);
  } else if (selectionId === "doctor_appointment") {
    await sendDoctorMenu(to);
  } else {
    await sendConfirmationMessage(to);
  }
}

async function sendLaundryMenu(to: string) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "כביסה"
      },
      body: {
        text: "בחר פעולה: (לחזרה השב חזור)"
      },
      action: {
        button: "שירותי כביסה",
        sections: [
          {
            title: "שירותי כביסה",
            rows: [
              {
                id: "laundry_reserve",
                title: "שריון שעה"
              },
              {
                id: "laundry_finished",
                title: "סיום"
              },
              {
                id: "laundry_delay",
                title: "דחייה"
              }
            ]
          }
        ]
      }
    }
  };

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function sendClassMenu(to: string) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "שיריון כיתה"
      },
      body: {
        text: "בחר סוג כיתה: (לחזרה השב חזור)"
      },
      action: {
        button: "סוגי כיתות",
        sections: [
          {
            title: "סוגי כיתות",
            rows: [
              {
                id: "class_small",
                title: "כיתה קטנה'"
              },
              {
                id: "class_big",
                title: "כיתה גדולה"
              },
              {
                id: "class_auditorium",
                title: "אודיטוריום"
              }
            ]
          }
        ]
      }
    }
  };

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function sendDoctorMenu(to: string) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "תור לרופא"
      },
      body: {
        text: "בחר רופא:  (לחזרה השב חזור)"
      },
      action: {
        button: "רשימת רופאים",
        sections: [
          {
            title: "רופאין זמינים",
            rows: [
              {
                id: "doctor_almog",
                title: "ד\"ר אלמוג"
              },
              {
                id: "doctor_daniel",
                title: "ד\"ר דניאל"
              },
              {
                id: "doctor_sus",
                title: "ד\"ר סוס"
              }
            ]
          }
        ]
      }
    }
  };

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function sendConfirmationMessage(to: string) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: "השירות יתווסף בקרוב:)"
    }
  };

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}