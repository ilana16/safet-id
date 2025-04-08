
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DRUGSCOM_API_KEY = Deno.env.get("DRUGSCOM_API_KEY") || "";
const DRUGSCOM_BASE_URL = Deno.env.get("DRUGSCOM_BASE_URL") || "https://api.drugs.com/v1";

if (!DRUGSCOM_API_KEY) {
  console.error("DRUGSCOM_API_KEY environment variable not set");
}

interface ErrorResponse {
  error: string;
}

// Helper function to make API requests
async function makeRequest(
  path: string, 
  method: string = "GET", 
  params: Record<string, string> = {}, 
  body: any = null
): Promise<any> {
  try {
    const headers = {
      "Authorization": `Bearer ${DRUGSCOM_API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    };

    // Build URL with query parameters
    const url = new URL(`${DRUGSCOM_BASE_URL}${path}`);
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    // Make the request
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    // Handle errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}): ${errorText}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error making API request:", error);
    throw error;
  }
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Parse request body if it exists
    let requestBody = null;
    if (req.body) {
      const bodyText = await req.text();
      try {
        requestBody = JSON.parse(bodyText);
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Invalid JSON in request body" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Route based on path
    if (path === "/search") {
      const query = url.searchParams.get("q");
      if (!query) {
        return new Response(
          JSON.stringify({ error: "Query parameter 'q' is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      
      const result = await makeRequest("/drugs/search", "GET", { q: query });
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    else if (path === "/details") {
      const drugId = url.searchParams.get("id");
      if (!drugId) {
        return new Response(
          JSON.stringify({ error: "Query parameter 'id' is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      
      const result = await makeRequest(`/drugs/${drugId}`, "GET");
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    else if (path === "/side-effects") {
      const drugId = url.searchParams.get("id");
      if (!drugId) {
        return new Response(
          JSON.stringify({ error: "Query parameter 'id' is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      
      const result = await makeRequest(`/drugs/${drugId}/side-effects`, "GET");
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    else if (path === "/dosage") {
      const drugId = url.searchParams.get("id");
      if (!drugId) {
        return new Response(
          JSON.stringify({ error: "Query parameter 'id' is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      
      const result = await makeRequest(`/drugs/${drugId}/dosage`, "GET");
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    else if (path === "/interactions" && method === "POST") {
      if (!requestBody || !requestBody.drug_ids || !Array.isArray(requestBody.drug_ids)) {
        return new Response(
          JSON.stringify({ error: "Request body must contain 'drug_ids' array" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      
      const result = await makeRequest("/interactions", "POST", {}, { drug_ids: requestBody.drug_ids });
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    else {
      return new Response(
        JSON.stringify({ error: "Endpoint not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
