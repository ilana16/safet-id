
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name } = await req.json();
    
    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    if (!name || typeof name !== 'string' || name.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing medication name' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // First search in medications table
    const { data: medicationsData, error: medicationsError } = await supabaseAdmin
      .from('medications')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(1);
      
    if (medicationsError) {
      console.error('Error querying medications:', medicationsError);
    }
    
    if (medicationsData && medicationsData.length > 0) {
      return new Response(
        JSON.stringify({ source: 'medications', data: medicationsData[0] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Next search in drugs table with all related interactions
    const normalizedName = name.toLowerCase().trim();
    
    // Use RPC function to get drug data
    const { data: drugsData, error: drugsError } = await supabaseAdmin
      .rpc('get_drug_by_name', { drug_name: normalizedName });
      
    if (drugsError) {
      console.error('Error querying drugs:', drugsError);
    }
    
    if (drugsData && drugsData.length > 0) {
      // Found drug data, now fetch interactions
      const drugId = drugsData[0].id;
      
      // Get drug interactions
      const { data: interactionsData, error: interactionsError } = await supabaseAdmin
        .rpc('get_drug_interactions', { drug_id: drugId });
      
      if (interactionsError) {
        console.error('Error fetching drug interactions:', interactionsError);
      }
      
      // Get food interactions from new table
      const { data: foodInteractionsData, error: foodInteractionsError } = await supabaseAdmin
        .from('food_interactions')
        .select('description')
        .eq('drug_id', drugId);
        
      if (foodInteractionsError) {
        console.error('Error fetching food interactions:', foodInteractionsError);
      }
      
      // Get condition interactions from new table
      const { data: conditionInteractionsData, error: conditionInteractionsError } = await supabaseAdmin
        .from('condition_interactions')
        .select('description')
        .eq('drug_id', drugId);
        
      if (conditionInteractionsError) {
        console.error('Error fetching condition interactions:', conditionInteractionsError);
      }
      
      // Get therapeutic duplications from new table
      const { data: therapeuticDuplicationsData, error: therapeuticDuplicationsError } = await supabaseAdmin
        .from('therapeutic_duplications')
        .select('description')
        .eq('drug_id', drugId);
        
      if (therapeuticDuplicationsError) {
        console.error('Error fetching therapeutic duplications:', therapeuticDuplicationsError);
      }
      
      // Get drug imprints from new table
      const { data: drugImprintsData, error: drugImprintsError } = await supabaseAdmin
        .from('drug_imprints')
        .select('imprint_code, image_url, description')
        .eq('drug_id', drugId);
        
      if (drugImprintsError) {
        console.error('Error fetching drug imprints:', drugImprintsError);
      }
      
      // Get international names from new table
      const { data: internationalNamesData, error: internationalNamesError } = await supabaseAdmin
        .from('international_names')
        .select('country, name')
        .eq('drug_id', drugId);
        
      if (internationalNamesError) {
        console.error('Error fetching international names:', internationalNamesError);
      }
      
      // Group interactions by level
      const interactions = {
        major: [],
        moderate: [],
        minor: [],
        unknown: []
      };
      
      if (interactionsData && interactionsData.length > 0) {
        for (const item of interactionsData) {
          const level = item.level as keyof typeof interactions;
          interactions[level].push(item.interaction);
        }
      }
      
      // Prepare food interactions array
      const foodInteractions = foodInteractionsData ? 
        foodInteractionsData.map(item => item.description) : [];
        
      // Prepare condition interactions array
      const conditionInteractions = conditionInteractionsData ? 
        conditionInteractionsData.map(item => item.description) : [];
        
      // Prepare therapeutic duplications array
      const therapeuticDuplications = therapeuticDuplicationsData ? 
        therapeuticDuplicationsData.map(item => item.description) : [];
      
      // Add interactions to drug data
      const enrichedDrugData = {
        ...drugsData[0],
        interactions: interactions,
        foodInteractions: foodInteractions,
        conditionInteractions: conditionInteractions,
        therapeuticDuplications: therapeuticDuplications,
        imprints: drugImprintsData || [],
        internationalNames: internationalNamesData || []
      };
      
      return new Response(
        JSON.stringify({ source: 'drugs', data: enrichedDrugData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: 'Medication not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    );
    
  } catch (error) {
    console.error('Error in drug-lookup function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
