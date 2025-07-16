import { createClient } from '@supabase/supabase-js';

// Use the service role key for admin-level access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderId, token } = req.query;

  if (!orderId || !token) {
    return res.status(400).json({ error: 'Missing orderId or token' });
  }

  try {
    // --- 1. Fetch the order only if the token matches ---
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('access_token', token)
      .single();

    if (orderError || !order) {
      // This will also trigger if the order is not found, which is a security measure.
      return res.status(404).json({ error: 'Order not found or access denied.' });
    }

    // --- 2. Fetch the associated order items, but only get the product reference ---
    const { data: orderItemsData, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*, products(id, name, image_path)') // Get the image_path
      .eq('order_id', orderId);

    if (itemsError) {
      return res.status(500).json({ error: 'Could not fetch order items.' });
    }

    // --- 3. Generate public URLs for each item's image ---
    const itemsWithImages = orderItemsData.map(item => {
      if (!item.products || !item.products.image_path) {
        return item; // Return item as-is if no product or image path
      }
      const { data: imageData } = supabaseAdmin
        .storage
        .from('products')
        .getPublicUrl(item.products.image_path);
      
      return {
        ...item,
        products: {
          ...item.products,
          imageUrl: imageData.publicUrl,
        },
      };
    });

    // --- 4. Return the complete order details ---
    res.status(200).json({ ...order, items: itemsWithImages });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order details.', details: error.message });
  }
}
