import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function is called by cron to process scheduled photo cards
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find all pending photo cards that are scheduled for now or earlier
    const now = new Date().toISOString();
    
    const { data: pendingCards, error: fetchError } = await supabase
      .from('photo_cards')
      .select('id, post_id, card_type')
      .eq('status', 'pending')
      .not('scheduled_at', 'is', null)
      .lte('scheduled_at', now);

    if (fetchError) {
      console.error('Error fetching pending cards:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingCards?.length || 0} pending scheduled cards`);

    if (!pendingCards || pendingCards.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending scheduled cards', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process each pending card
    const results = [];
    for (const card of pendingCards) {
      try {
        // Call the generate-photo-card function
        const { data, error } = await supabase.functions.invoke('generate-photo-card', {
          body: { 
            postId: card.post_id, 
            cardType: card.card_type 
          }
        });

        if (error) {
          console.error(`Error generating card ${card.id}:`, error);
          results.push({ id: card.id, success: false, error: error.message });
        } else {
          console.log(`Successfully generated card ${card.id}`);
          results.push({ id: card.id, success: true, data });
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Exception processing card ${card.id}:`, err);
        results.push({ id: card.id, success: false, error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Processed scheduled cards',
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing scheduled cards:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
