import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CardRequest {
  postId: string;
  cardType: 'facebook' | 'link' | 'story';
  scheduledAt?: string;
}

interface CardDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

const CARD_SIZES: Record<string, CardDimensions> = {
  facebook: { width: 1080, height: 1080, aspectRatio: '1:1' },
  link: { width: 1200, height: 630, aspectRatio: '16:9' },
  story: { width: 1080, height: 1920, aspectRatio: '9:16' }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    // Authentication check - require Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client for role verification
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user and check role
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is staff (admin, super_admin, or moderator)
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isStaff = roles?.some(r => ['super_admin', 'admin', 'moderator'].includes(r.role));
    if (!isStaff) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Staff access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { postId, cardType, scheduledAt } = await req.json() as CardRequest;

    if (!postId || !cardType) {
      return new Response(
        JSON.stringify({ error: 'postId and cardType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if this is a scheduled generation
    if (scheduledAt) {
      const scheduledTime = new Date(scheduledAt);
      if (scheduledTime > new Date()) {
        // Schedule the card generation
        const { error: insertError } = await supabase
          .from('photo_cards')
          .upsert({
            post_id: postId,
            card_type: cardType,
            status: 'pending',
            scheduled_at: scheduledAt
          }, { onConflict: 'post_id,card_type' });

        if (insertError) throw insertError;

        return new Response(
          JSON.stringify({ success: true, message: 'Photo card scheduled', scheduled_at: scheduledAt }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Mark as generating
    await supabase
      .from('photo_cards')
      .upsert({
        post_id: postId,
        card_type: cardType,
        status: 'generating'
      }, { onConflict: 'post_id,card_type' });

    // Fetch post data
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      throw new Error('Post not found');
    }

    // Fetch site logo
    const { data: logoSetting } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'site_logo_url')
      .single();

    // Fetch site URL
    const { data: urlSetting } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'site_url')
      .single();

    const siteLogoUrl = logoSetting?.setting_value || '';
    const siteUrl = urlSetting?.setting_value || 'www.newsportal.com';
    const dimensions = CARD_SIZES[cardType];
    const isBreaking = post.is_breaking;
    const publishDate = post.published_at ? new Date(post.published_at).toLocaleDateString('bn-BD') : new Date().toLocaleDateString('bn-BD');

    // Create AI prompt for photo card generation
    const prompt = `Create a professional Bangla news portal photo card image with the following specifications:

DIMENSIONS: ${dimensions.width}x${dimensions.height} pixels (${dimensions.aspectRatio} aspect ratio)

DESIGN LAYOUT:
- Clean off-white or light green background (#f8f9fa or #e8f5e9)
- TOP SECTION: Space for a news portal logo (small, centered or left-aligned)
- MAIN SECTION: Feature image area showing a news scene related to: "${post.title}"
- BELOW IMAGE: Bold Bangla headline text area
- FOOTER: Website URL and date

CONTENT TO INCLUDE:
- Headline: "${post.title}"
- Website: ${siteUrl}
- Date: ${publishDate}
${isBreaking ? '- Add a RED "ব্রেকিং" (BREAKING) badge in the top-right corner' : ''}

STYLE REQUIREMENTS:
- Professional news media aesthetic
- Clean, modern design with good typography
- High readability for Bangla fonts
- Semi-transparent watermark logo in bottom corner
- No text overlay on the main image
- The featured image should be a photorealistic scene related to the news headline

Make it look like a professional social media share card from a major Bangla news outlet.`;

    console.log('Generating photo card with prompt:', prompt);

    // Call Lovable AI Gateway for image generation
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received:', JSON.stringify(aiData, null, 2));

    // Check multiple possible response structures
    let imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    // Alternative structure check
    if (!imageData) {
      imageData = aiData.choices?.[0]?.message?.content;
      // Check if content itself is a base64 image
      if (imageData && !imageData.startsWith('data:image')) {
        // Try to find image in different location
        const images = aiData.choices?.[0]?.message?.images;
        console.log('Images array:', JSON.stringify(images, null, 2));
        
        // Check for inline base64 in images array
        if (images && images.length > 0) {
          const firstImage = images[0];
          imageData = firstImage?.image_url?.url || firstImage?.url || null;
        }
      }
    }

    if (!imageData) {
      console.error('Full AI response:', JSON.stringify(aiData, null, 2));
      console.error('Message content:', aiData.choices?.[0]?.message);
      
      // Update status to failed
      await supabase
        .from('photo_cards')
        .update({ status: 'failed' })
        .eq('post_id', postId)
        .eq('card_type', cardType);
      
      throw new Error('No image generated from AI - the model may have refused due to content restrictions');
    }

    // Extract base64 data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to Supabase Storage
    const fileName = `photo-cards/${postId}/${cardType}-${Date.now()}.png`;
    
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, imageBytes, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    // Update photo_cards record
    const { error: updateError } = await supabase
      .from('photo_cards')
      .upsert({
        post_id: postId,
        card_type: cardType,
        image_url: publicUrl,
        status: 'generated',
        scheduled_at: null
      }, { onConflict: 'post_id,card_type' });

    if (updateError) throw updateError;

    console.log('Photo card generated successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        image_url: publicUrl,
        card_type: cardType,
        post_id: postId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error generating photo card:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
