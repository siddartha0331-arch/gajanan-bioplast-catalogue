import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderNotification {
  orderId: string;
  customerName: string;
  businessName: string;
  phone: string;
  items: Array<{
    productName: string;
    quantity: number;
    size: string;
  }>;
  address: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { orderId } = await req.json();

    console.log('Fetching order details for:', orderId);

    // Fetch order with customer details and items
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        profiles (
          full_name,
          business_name,
          phone,
          address,
          city,
          state,
          pincode
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    const { data: items, error: itemsError } = await supabaseClient
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    // Format WhatsApp message
    const itemsList = items
      .map(item => `• ${item.product_name} (${item.product_size}) - Qty: ${item.quantity}`)
      .join('\n');

    const fullAddress = [
      order.profiles.address,
      order.profiles.city,
      order.profiles.state,
      order.profiles.pincode
    ].filter(Boolean).join(', ');

    const message = `
🎉 *New Order Received!*

*Order ID:* ${orderId}
*Customer:* ${order.profiles.full_name}
*Business:* ${order.profiles.business_name || 'N/A'}
*Phone:* ${order.profiles.phone}

*Items Ordered:*
${itemsList}

*Delivery Address:*
${fullAddress}

*Total Quantity:* ${order.quantity}
*Status:* ${order.status}

Please process this order as soon as possible.
    `.trim();

    console.log('WhatsApp message prepared:', message);

    // Note: This requires a WhatsApp Business API integration
    // For now, we'll log the message. User needs to configure their WhatsApp API
    const WHATSAPP_API_URL = Deno.env.get('WHATSAPP_API_URL');
    const WHATSAPP_API_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN');
    const WHATSAPP_PHONE_NUMBER = Deno.env.get('WHATSAPP_PHONE_NUMBER');

    if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER) {
      console.warn('WhatsApp credentials not configured. Message would be:', message);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'WhatsApp API not configured. Please add WHATSAPP_API_URL, WHATSAPP_API_TOKEN, and WHATSAPP_PHONE_NUMBER secrets.',
          preview: message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send WhatsApp message using the configured API
    const whatsappResponse = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: WHATSAPP_PHONE_NUMBER,
        message: message,
      }),
    });

    if (!whatsappResponse.ok) {
      throw new Error(`WhatsApp API error: ${await whatsappResponse.text()}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});