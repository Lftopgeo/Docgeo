import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, toolId } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // In a real implementation, you would call an actual AI service here
    // For this example, we'll simulate a response
    const response = simulateAIResponse(prompt, toolId);

    // Add a slight delay to simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

function simulateAIResponse(prompt: string, toolId?: string): string {
  // Simple response generation based on the prompt
  const promptLower = prompt.toLowerCase();

  if (promptLower.includes("hello") || promptLower.includes("hi")) {
    return "Hello! I'm an AI assistant. How can I help you today?";
  }

  if (promptLower.includes("help")) {
    return "I'm here to help! You can ask me questions, request information, or get assistance with various tasks.";
  }

  if (promptLower.includes("weather")) {
    return "I don't have access to real-time weather data, but I can help you find a reliable weather service or answer other questions.";
  }

  if (promptLower.includes("code") || promptLower.includes("programming")) {
    return "I can help with programming questions, code reviews, or suggest solutions to coding problems. What specific programming topic are you interested in?";
  }

  if (promptLower.includes("image") || promptLower.includes("picture")) {
    return "I can help describe how to create or modify images, but I can't generate or view images directly. Would you like some guidance on image creation or editing?";
  }

  // Default response
  return `I've processed your request: "${prompt}". How can I assist you further with this?`;
}
