import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const providedSecret = req.headers['authorization']?.split(' ')[1];
  if (providedSecret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: 'Order ID and new status are required.' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status: status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ error: 'Failed to update order status.', details: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Order not found.' });
    }

    res.status(200).json({ success: true, updatedOrder: data });

  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.', details: error.message });
  }
}
