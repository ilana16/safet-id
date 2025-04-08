
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cheerio } from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Set timeout for fetch operations
const FETCH_TIMEOUT = 10000; // 10 seconds

// Function to fetch with timeout
async function fetchWithTimeout(url: string, options = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeout = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { drugName, action } = await req.json();
    
    if (!drugName) {
      return new Response(JSON.stringify({ error: 'Drug name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Processing request for drug: ${drugName}, action: ${action || 'info'}`);
    
    if (action === 'search') {
      return await handleSearch(drugName);
    } else {
      return await handleDrugInfo(drugName);
    }
  } catch (error) {
    console.error('Error in drugs-scraper function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      type: error.name,
      isAbort: error.name === 'AbortError'
    }), {
      status: error.name === 'AbortError' ? 408 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleSearch(query: string): Promise<Response> {
  try {
    console.log(`Searching for: ${query}`);
    
    const searchUrl = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(query)}`;
    console.log(`Fetching search results from: ${searchUrl}`);
    
    const response = await fetchWithTimeout(searchUrl);
    const html = await response.text();
    
    const $ = cheerio.load(html);
    const results: string[] = [];
    
    $('.search-result').each((_i, element) => {
      const title = $(element).find('.ddc-media-title').text().trim();
      if (title && !results.includes(title)) {
        results.push(title);
      }
    });
    
    console.log(`Found ${results.length} search results`);
    
    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search function:', error);
    const isTimeout = error.name === 'AbortError';
    
    return new Response(JSON.stringify({ 
      error: isTimeout ? 'Search request timed out' : error.message,
      results: [] 
    }), {
      status: isTimeout ? 408 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleDrugInfo(drugName: string): Promise<Response> {
  try {
    // First attempt the direct URL approach
    const normalizedDrugName = drugName.toLowerCase().replace(/\s+/g, '-');
    const urls = [
      `https://www.drugs.com/${normalizedDrugName}.html`,
      `https://www.drugs.com/mtm/${normalizedDrugName}.html`,
      `https://www.drugs.com/cdi/${normalizedDrugName}.html`,
      `https://www.drugs.com/drug/${normalizedDrugName}.html`
    ];
    
    let html = '';
    let foundUrl = '';
    
    for (const url of urls) {
      console.log(`Attempting to fetch from: ${url}`);
      try {
        const response = await fetchWithTimeout(url);
        if (response.ok) {
          html = await response.text();
          foundUrl = url;
          console.log(`Successfully fetched from: ${url}`);
          break;
        }
      } catch (e) {
        console.log(`Failed to fetch from: ${url}`);
        if (e.name === 'AbortError') {
          throw new Error('Drug information request timed out');
        }
      }
    }
    
    if (!html) {
      // If direct URLs fail, try search first
      console.log('Direct URL approach failed, trying search');
      try {
        const searchResponse = await handleSearch(drugName);
        const searchData = await searchResponse.json();
        
        if (searchData.results && searchData.results.length > 0) {
          // Use the first search result
          const firstResult = searchData.results[0];
          const normalizedResult = firstResult.toLowerCase().replace(/\s+/g, '-');
          
          for (const url of urls) {
            const urlWithResult = url.replace(normalizedDrugName, normalizedResult);
            console.log(`Attempting to fetch from search result URL: ${urlWithResult}`);
            
            try {
              const response = await fetchWithTimeout(urlWithResult);
              if (response.ok) {
                html = await response.text();
                foundUrl = urlWithResult;
                console.log(`Successfully fetched from search result: ${urlWithResult}`);
                break;
              }
            } catch (e) {
              console.log(`Failed to fetch from search result: ${urlWithResult}`);
              if (e.name === 'AbortError') {
                throw new Error('Drug information request timed out');
              }
            }
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Drug information request timed out');
        }
        console.error('Error during search fallback:', error);
      }
    }
    
    if (!html) {
      return new Response(JSON.stringify({ error: 'Could not find drug information' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Parse the HTML and extract medication information
    const $ = cheerio.load(html);
    
    // Basic medication information
    const drugInfo: any = {
      name: drugName,
      source: 'Drugs.com Scraper',
      drugsComUrl: foundUrl,
    };
    
    // Extract drug name and generic name
    drugInfo.name = $('.drug-title h1').text().trim() || drugName;
    
    // Generic name
    const genericInfo = $('.drug-subtitle').text().trim();
    if (genericInfo.includes('Generic Name:')) {
      drugInfo.genericName = genericInfo.replace('Generic Name:', '').trim();
    }
    
    // Description
    drugInfo.description = $('.drug-concise').text().trim();
    
    // Drug class
    const drugClassText = $('p:contains("Drug class:")').text().trim();
    if (drugClassText) {
      drugInfo.drugClass = drugClassText.replace('Drug class:', '').trim();
    }
    
    // Side effects
    drugInfo.sideEffects = {
      common: [],
      serious: []
    };
    
    // Get common side effects
    const sideEffectsSection = $('#sideEffects');
    if (sideEffectsSection.length) {
      const commonEffects = sideEffectsSection.find('ul').first().find('li');
      commonEffects.each((i, el) => {
        drugInfo.sideEffects.common.push($(el).text().trim());
      });
      
      // Look for serious side effects (often in a warning box)
      const warningBox = sideEffectsSection.find('.boxList.warningBox');
      if (warningBox.length) {
        const seriousEffects = warningBox.find('li');
        seriousEffects.each((i, el) => {
          drugInfo.sideEffects.serious.push($(el).text().trim());
        });
      }
    }
    
    // Interactions
    drugInfo.interactionClassifications = {
      major: [],
      moderate: [],
      minor: [],
      unknown: []
    };
    
    const interactionsSection = $('#interactions');
    if (interactionsSection.length) {
      // Major interactions
      const majorSection = interactionsSection.find('h2:contains("Major"), h3:contains("Major")').next('ul');
      majorSection.find('li').each((i, el) => {
        drugInfo.interactionClassifications.major.push($(el).text().trim());
      });
      
      // Moderate interactions
      const moderateSection = interactionsSection.find('h2:contains("Moderate"), h3:contains("Moderate")').next('ul');
      moderateSection.find('li').each((i, el) => {
        drugInfo.interactionClassifications.moderate.push($(el).text().trim());
      });
      
      // Minor interactions
      const minorSection = interactionsSection.find('h2:contains("Minor"), h3:contains("Minor")').next('ul');
      minorSection.find('li').each((i, el) => {
        drugInfo.interactionClassifications.minor.push($(el).text().trim());
      });
    }
    
    // Food interactions
    drugInfo.foodInteractions = [];
    const foodInteractionsSection = $('div:contains("Food Interactions")').closest('div');
    if (foodInteractionsSection.length) {
      foodInteractionsSection.find('li').each((i, el) => {
        drugInfo.foodInteractions.push($(el).text().trim());
      });
    }
    
    // Condition interactions
    drugInfo.conditionInteractions = [];
    const conditionInteractionsSection = $('div:contains("Disease Interactions")').closest('div');
    if (conditionInteractionsSection.length) {
      conditionInteractionsSection.find('li').each((i, el) => {
        drugInfo.conditionInteractions.push($(el).text().trim());
      });
    }
    
    // Pregnancy information
    const pregnancySection = $('#pregnancy');
    if (pregnancySection.length) {
      drugInfo.pregnancy = pregnancySection.find('p').first().text().trim();
    }
    
    // Breastfeeding information
    const breastfeedingSection = $('#breastfeeding');
    if (breastfeedingSection.length) {
      drugInfo.breastfeeding = breastfeedingSection.find('p').first().text().trim();
    }
    
    // Half-life
    const halfLifeText = $('p:contains("half-life")').text().trim();
    if (halfLifeText) {
      drugInfo.halfLife = halfLifeText;
    }
    
    // Therapeutic duplications
    drugInfo.therapeuticDuplications = [];
    const duplicationsSection = $('div:contains("Therapeutic duplications")').closest('div');
    if (duplicationsSection.length) {
      duplicationsSection.find('li').each((i, el) => {
        drugInfo.therapeuticDuplications.push($(el).text().trim());
      });
    }

    console.log(`Successfully scraped information for: ${drugInfo.name}`);
    
    return new Response(JSON.stringify(drugInfo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in handleDrugInfo function:', error);
    const isTimeout = error.name === 'AbortError' || 
                      (error.message && error.message.includes('timed out'));
                      
    return new Response(JSON.stringify({ 
      error: isTimeout ? 'Drug information request timed out' : error.message 
    }), {
      status: isTimeout ? 408 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
