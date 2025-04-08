
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
  // Try multiple URL patterns for the drug
  const attempts = [
    // Search results page
    `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(drugName)}`,
    // Direct drug page (lowercase)
    `https://www.drugs.com/${encodeURIComponent(drugName.toLowerCase())}.html`,
    // Direct drug page (capitalized)
    `https://www.drugs.com/${encodeURIComponent(drugName.charAt(0).toUpperCase() + drugName.slice(1).toLowerCase())}.html`,
    // MTM page
    `https://www.drugs.com/mtm/${encodeURIComponent(drugName.toLowerCase())}.html`,
    // Cons page
    `https://www.drugs.com/cons/${encodeURIComponent(drugName.toLowerCase())}.html`,
    // Cdi page
    `https://www.drugs.com/cdi/${encodeURIComponent(drugName.toLowerCase())}.html`,
  ];
  
  console.log(`Attempting to get drug info for: ${drugName}`);
  
  let drugPageUrl = '';
  let $ = null;
  let drugHtml = '';
  
  // Try each pattern until we find a valid drug page
  for (const url of attempts) {
    try {
      console.log(`Trying URL: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`URL failed with status ${response.status}: ${url}`);
        continue;
      }
      
      const html = await response.text();
      const tempCheerio = cheerio.load(html);
      
      // Check if this is a drug page
      const drugName = tempCheerio('h1.drug-name').text().trim();
      if (drugName) {
        console.log(`Found drug page: ${url} for ${drugName}`);
        drugPageUrl = url;
        $ = tempCheerio;
        drugHtml = html;
        break;
      }
      
      // Check if this is a search results page
      const firstResult = tempCheerio('.ddc-media-list .ddc-media-content a').first();
      if (firstResult.length > 0) {
        const resultHref = firstResult.attr('href');
        if (resultHref) {
          const resultUrl = new URL(resultHref, 'https://www.drugs.com').toString();
          console.log(`Found search result, following to: ${resultUrl}`);
          
          const resultResponse = await fetch(resultUrl);
          if (resultResponse.ok) {
            drugHtml = await resultResponse.text();
            $ = cheerio.load(drugHtml);
            drugPageUrl = resultUrl;
            break;
          }
        }
      }
    } catch (e) {
      console.log(`Error trying URL ${url}: ${e.message}`);
      continue;
    }
  }
  
  if (!$ || !drugPageUrl) {
    console.log(`No drug page found for: ${drugName}`);
    return null;
  }
  
  try {
    // Extract basic information
    const name = $('h1.drug-name').text().trim();
    const genericNameEl = $('.drug-subtitle').first();
    const genericName = genericNameEl.text().trim();
    
    console.log(`Extracting information for: ${name || drugName}`);
    
    // Get drug class
    let drugClass = '';
    $('.ddc-cg-drug-classes a').each((i, el) => {
      drugClass += $(el).text().trim() + (i > 0 ? ', ' : '');
    });
    
    // Get description
    const description = $('.drug-mol-header-description').text().trim() || 
                       $('.drug-subtitle + p').text().trim() ||
                       $('meta[name="description"]').attr('content') || '';
    
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
    $('.side-effects-list li, .drug-side-effects li, ul.more-list-content li').each((i, el) => {
      const effect = $(el).text().trim();
      if (effect) {
        sideEffects.common.push(effect);
      }
    });
    
    // Ensure we have some side effects
    if (sideEffects.common.length === 0) {
      $('p:contains("side effects")').next('ul').find('li').each((i, el) => {
        const effect = $(el).text().trim();
        if (effect) sideEffects.common.push(effect);
      });
    }
    
    // Extract uses/indications
    const usedFor: string[] = [];
    $('.drug-aids-list li, .ddc-use-for-list li, .ddc-list-uses li').each((i, el) => {
      const use = $(el).text().trim();
      if (use) {
        usedFor.push(use);
      }
    });
    
    // Try to find uses in paragraphs if list is empty
    if (usedFor.length === 0) {
      $('p:contains("used for"), p:contains("Used to"), p:contains("treatment of")').each((i, el) => {
        const text = $(el).text().trim();
        if (text) usedFor.push(text);
      });
    }
    
    // Extract warnings
    const warnings: string[] = [];
    $('.ddc-warning-container p, .boxed-warning p, p.black-box-warning').each((i, el) => {
      const warning = $(el).text().trim();
      if (warning) {
        warnings.push(warning);
      }
    });
    
    // Dosage information
    const dosage = {
      adult: $('.ddc-dosage-adult, div:contains("Adult Dosage:") + div').text().trim(),
      child: $('.ddc-dosage-child, div:contains("Child Dosage:") + div').text().trim()
    };
    
    // Forms
    const forms: string[] = [];
    $('.ddc-drug-forms span, p:contains("available in the following")').each((i, el) => {
      const form = $(el).text().replace(/available in the following dosage forms:/i, '').trim();
      if (form) forms.push(form);
    });
    
    // Get interactions URL pattern
    const drugNameForUrl = name ? name.toLowerCase().replace(/\s+/g, '-') : drugName.toLowerCase();
    const possibleInteractionUrls = [
      `https://www.drugs.com/drug-interactions/${encodeURIComponent(drugNameForUrl)}.html`,
      `https://www.drugs.com/drug-interactions/${encodeURIComponent(drugName.toLowerCase())}.html`,
      `https://www.drugs.com/${encodeURIComponent(drugName.toLowerCase())}-interactions.html`
    ];
    
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
    
    // Try to get interactions from any known URL pattern
    for (const interactionsUrl of possibleInteractionUrls) {
      try {
        console.log(`Trying to fetch interactions from: ${interactionsUrl}`);
        const intResponse = await fetch(interactionsUrl);
        if (intResponse.ok) {
          const intHtml = await intResponse.text();
          const $int = cheerio.load(intHtml);
          
          // Extract major interactions
          $int('.ddc-list-interactions.major li, .major-interaction li').each((i, el) => {
            const drug = $int(el).find('a').first().text().trim();
            const desc = $int(el).text().trim();
            if (drug) {
              interactions.push(desc);
              interactionClassifications.major.push(drug);
              interactionSeverity.major.push(drug);
            }
          });
          
          // Extract moderate interactions
          $int('.ddc-list-interactions.moderate li, .moderate-interaction li').each((i, el) => {
            const drug = $int(el).find('a').first().text().trim();
            const desc = $int(el).text().trim();
            if (drug) {
              interactions.push(desc);
              interactionClassifications.moderate.push(drug);
              interactionSeverity.moderate.push(drug);
            }
          });
          
          // Extract minor interactions
          $int('.ddc-list-interactions.minor li, .minor-interaction li').each((i, el) => {
            const drug = $int(el).find('a').first().text().trim();
            const desc = $int(el).text().trim();
            if (drug) {
              interactions.push(desc);
              interactionClassifications.minor.push(drug);
              interactionSeverity.minor.push(drug);
            }
          });
          
          // Extract food interactions
          $int('.ddc-list-interactions-food li, .food-interaction li').each((i, el) => {
            const food = $int(el).text().trim();
            if (food) foodInteractions.push(food);
          });
          
          // Extract disease/condition interactions
          $int('.ddc-list-interactions-disease li, .disease-interaction li').each((i, el) => {
            const condition = $int(el).text().trim();
            if (condition) conditionInteractions.push(condition);
          });
          
          // Extract therapeutic duplications
          $int('.ddc-list-duplications li, .duplicate-interaction li').each((i, el) => {
            const duplication = $int(el).text().trim();
            if (duplication) therapeuticDuplications.push(duplication);
          });
          
          break; // Exit loop if we found interactions
        }
      } catch (error) {
        console.error('Error fetching interaction data:', error);
      }
    }
    
    // Get pregnancy information
    try {
      const pregnancySection = $('.pregnancy-breastfeeding h2:contains("Pregnancy"), h2:contains("Pregnancy"), div:contains("Pregnancy")').next('p');
      if (pregnancySection.length > 0) {
        pregnancy = pregnancySection.text().trim();
      }
      
      // Try alternative selector if above doesn't work
      if (!pregnancy) {
        $('p:contains("Pregnancy Category")').each((i, el) => {
          const text = $(el).text().trim();
          if (text.includes("Pregnancy Category")) {
            pregnancy = text;
          }
        });
      }
    } catch (e) {
      console.error('Error extracting pregnancy info:', e);
    }
    
    // Get breastfeeding information
    try {
      const breastfeedingSection = $('.pregnancy-breastfeeding h2:contains("Breastfeeding"), h2:contains("Breastfeeding")').next('p');
      if (breastfeedingSection.length > 0) {
        breastfeeding = breastfeedingSection.text().trim();
      }
      
      // Try alternative selector
      if (!breastfeeding) {
        $('p:contains("breast-feeding"), p:contains("breastfeeding")').each((i, el) => {
          const text = $(el).text().trim();
          if (text.includes("breastfeed") || text.includes("breast-feed")) {
            breastfeeding = text;
          }
        });
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
      
      // Try alternative approach
      if (!halfLife) {
        $('p:contains("half-life"), li:contains("half-life")').each((i, el) => {
          const text = $(el).text().trim();
          if (text.includes("half-life")) {
            halfLife = text;
          }
        });
      }
    } catch (e) {
      console.error('Error extracting half-life:', e);
    }
    
    // Construct the result object
    const result = {
      name: name || drugName,
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
    
    console.log(`Successfully extracted drug information for: ${name || drugName}`);
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
          JSON.stringify({ error: `No information found for ${drugName}. Please check the spelling or try another medication.` }),
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
