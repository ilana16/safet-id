
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

const searchDrugsCom = async (drugName: string) => {
  const searchUrl = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(drugName)}`;
  console.log(`Searching Drugs.com: ${searchUrl}`);
  
  try {
    const response = await fetch(searchUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract search results
    const results: string[] = [];
    
    // Check for direct drug page
    const mainHeading = $('h1.drug-name').text().trim();
    if (mainHeading) {
      console.log(`Direct match found: ${mainHeading}`);
      results.push(mainHeading);
      return results;
    }
    
    // Check for search results
    $('.ddc-media-list .ddc-media-content').each((i, el) => {
      const title = $(el).find('a').first().text().trim();
      if (title && !results.includes(title)) {
        results.push(title);
      }
    });
    
    console.log(`Found ${results.length} results`);
    return results;
  } catch (error) {
    console.error('Error searching Drugs.com:', error);
    throw new Error(`Failed to search Drugs.com: ${error.message}`);
  }
};

const getDrugInfo = async (drugName: string) => {
  const searchUrl = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(drugName)}`;
  console.log(`Getting drug info from Drugs.com: ${searchUrl}`);
  
  try {
    // First, do a search to find the exact drug page
    const response = await fetch(searchUrl);
    const html = await response.text();
    let $ = cheerio.load(html);
    
    // Check if we landed on a direct drug page
    let drugPageUrl = '';
    const mainHeading = $('h1.drug-name').text().trim();
    
    if (mainHeading) {
      // We're already on a drug page
      drugPageUrl = searchUrl;
    } else {
      // Try to find the drug in search results
      const firstResult = $('.ddc-media-list .ddc-media-content a').first();
      if (firstResult.length > 0) {
        const resultHref = firstResult.attr('href');
        if (resultHref) {
          drugPageUrl = new URL(resultHref, 'https://www.drugs.com').toString();
        }
      }
    }
    
    if (!drugPageUrl) {
      console.log(`No drug page found for: ${drugName}`);
      return null;
    }
    
    console.log(`Found drug page: ${drugPageUrl}`);
    
    // Fetch the drug's page
    const drugResponse = await fetch(drugPageUrl);
    const drugHtml = await drugResponse.text();
    $ = cheerio.load(drugHtml);
    
    // Extract basic information
    const name = $('h1.drug-name').text().trim();
    const genericNameEl = $('.drug-subtitle').first();
    const genericName = genericNameEl.text().trim();
    
    // Get drug class
    let drugClass = '';
    $('.ddc-cg-drug-classes a').each((i, el) => {
      drugClass += $(el).text().trim() + (i > 0 ? ', ' : '');
    });
    
    // Get description
    const description = $('.drug-mol-header-description').text().trim();
    
    // Get prescription status
    const rxStatus = $('.ddc-status-label').text().trim();
    const prescriptionOnly = rxStatus.toLowerCase().includes('prescription') || 
                            !rxStatus.toLowerCase().includes('otc');
    
    // Extract side effects
    const sideEffects = {
      common: [] as string[],
      serious: [] as string[]
    };
    
    // Try to find common side effects
    $('.side-effects-list li').each((i, el) => {
      const effect = $(el).text().trim();
      if (effect) {
        sideEffects.common.push(effect);
      }
    });
    
    // Extract uses/indications
    const usedFor: string[] = [];
    $('.drug-aids-list li, .ddc-use-for-list li').each((i, el) => {
      const use = $(el).text().trim();
      if (use) {
        usedFor.push(use);
      }
    });
    
    // Extract warnings
    const warnings: string[] = [];
    $('.ddc-warning-container p, .boxed-warning p').each((i, el) => {
      const warning = $(el).text().trim();
      if (warning) {
        warnings.push(warning);
      }
    });
    
    // Dosage information
    const dosage = {
      adult: $('.ddc-dosage-adult').text().trim(),
      child: $('.ddc-dosage-child').text().trim()
    };
    
    // Forms
    const forms: string[] = [];
    $('.ddc-drug-forms span').each((i, el) => {
      const form = $(el).text().trim();
      if (form) forms.push(form);
    });
    
    // Get the drug interactions page URL
    let interactionsUrl = '';
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().toLowerCase();
      if (href && (text.includes('interaction') || href.includes('interaction'))) {
        interactionsUrl = new URL(href, 'https://www.drugs.com').toString();
        return false; // Break the loop when found
      }
    });
    
    // Interactions data
    let interactions: string[] = [];
    let interactionClassifications = { major: [] as string[], moderate: [] as string[], minor: [] as string[] };
    let interactionSeverity = { major: [] as string[], moderate: [] as string[], minor: [] as string[] };
    let foodInteractions: string[] = [];
    let conditionInteractions: string[] = [];
    let therapeuticDuplications: string[] = [];
    let pregnancy = '';
    let breastfeeding = '';
    let halfLife = '';
    
    // If we have an interactions URL, fetch additional interaction data
    if (interactionsUrl) {
      console.log(`Fetching interactions from: ${interactionsUrl}`);
      try {
        const intResponse = await fetch(interactionsUrl);
        const intHtml = await intResponse.text();
        const $int = cheerio.load(intHtml);
        
        // Extract major interactions
        $int('.ddc-list-interactions.major li').each((i, el) => {
          const drug = $int(el).find('a').first().text().trim();
          const desc = $int(el).text().trim();
          if (drug) {
            interactions.push(desc);
            interactionClassifications.major.push(drug);
            interactionSeverity.major.push(drug);
          }
        });
        
        // Extract moderate interactions
        $int('.ddc-list-interactions.moderate li').each((i, el) => {
          const drug = $int(el).find('a').first().text().trim();
          const desc = $int(el).text().trim();
          if (drug) {
            interactions.push(desc);
            interactionClassifications.moderate.push(drug);
            interactionSeverity.moderate.push(drug);
          }
        });
        
        // Extract minor interactions
        $int('.ddc-list-interactions.minor li').each((i, el) => {
          const drug = $int(el).find('a').first().text().trim();
          const desc = $int(el).text().trim();
          if (drug) {
            interactions.push(desc);
            interactionClassifications.minor.push(drug);
            interactionSeverity.minor.push(drug);
          }
        });
        
        // Extract food interactions
        $int('.ddc-list-interactions-food li').each((i, el) => {
          const food = $int(el).text().trim();
          if (food) foodInteractions.push(food);
        });
        
        // Extract disease/condition interactions
        $int('.ddc-list-interactions-disease li').each((i, el) => {
          const condition = $int(el).text().trim();
          if (condition) conditionInteractions.push(condition);
        });
        
        // Extract therapeutic duplications
        $int('.ddc-list-duplications li').each((i, el) => {
          const duplication = $int(el).text().trim();
          if (duplication) therapeuticDuplications.push(duplication);
        });
      } catch (error) {
        console.error('Error fetching interaction data:', error);
      }
    }
    
    // Get pregnancy information
    try {
      const pregnancySection = $('.pregnancy-breastfeeding h2:contains("Pregnancy")').next('p');
      if (pregnancySection.length > 0) {
        pregnancy = pregnancySection.text().trim();
      }
    } catch (e) {
      console.error('Error extracting pregnancy info:', e);
    }
    
    // Get breastfeeding information
    try {
      const breastfeedingSection = $('.pregnancy-breastfeeding h2:contains("Breastfeeding")').next('p');
      if (breastfeedingSection.length > 0) {
        breastfeeding = breastfeedingSection.text().trim();
      }
    } catch (e) {
      console.error('Error extracting breastfeeding info:', e);
    }
    
    // Try to get half life information
    try {
      const halfLifeMatch = drugHtml.match(/half-life.*?:?\s*([0-9.]+\s*-?\s*[0-9.]+\s*h(our)?s?)/i);
      if (halfLifeMatch) {
        halfLife = halfLifeMatch[1];
      }
    } catch (e) {
      console.error('Error extracting half-life:', e);
    }
    
    // Construct the result object
    const result = {
      name,
      genericName,
      description,
      drugClass,
      prescriptionOnly,
      usedFor,
      warnings,
      sideEffects,
      interactions,
      dosage,
      forms,
      interactionClassifications,
      interactionSeverity,
      foodInteractions,
      conditionInteractions,
      therapeuticDuplications,
      pregnancy,
      breastfeeding,
      halfLife,
      drugsComUrl: drugPageUrl,
      source: 'Drugs.com Scraper'
    };
    
    console.log(`Successfully extracted drug information for: ${name}`);
    return result;
    
  } catch (error) {
    console.error('Error fetching drug information:', error);
    throw new Error(`Failed to get drug information: ${error.message}`);
  }
};

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Parse request body
    const { drugName, action } = await req.json();
    
    console.log(`Received request for drug: ${drugName}, action: ${action || 'info'}`);
    
    if (!drugName) {
      return new Response(
        JSON.stringify({ error: "Drug name is required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
    let result;
    
    if (action === 'search') {
      // Perform search
      result = await searchDrugsCom(drugName);
      return new Response(
        JSON.stringify({ results: result }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    } else {
      // Get full drug information
      result = await getDrugInfo(drugName);
      if (!result) {
        return new Response(
          JSON.stringify({ error: `No information found for ${drugName}` }),
          { 
            status: 404, 
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            } 
          }
        );
      }
      return new Response(
        JSON.stringify(result),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
