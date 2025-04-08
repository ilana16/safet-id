
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
    
    // Next search in drugs table
    const { data: drugsData, error: drugsError } = await supabaseAdmin
      .from('drugs')
      .select('*, drug_interactions(*)')
      .ilike('name', `%${name}%`)
      .limit(1);
      
    if (drugsError) {
      console.error('Error querying drugs:', drugsError);
    }
    
    if (drugsData && drugsData.length > 0) {
      return new Response(
        JSON.stringify({ source: 'drugs', data: drugsData[0] }),
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
