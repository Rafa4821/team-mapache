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

  const { productId, stock, min_stock_level } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required.' });
  }

  const updateData = {};
  if (stock !== undefined && stock !== null) {
    updateData.stock = stock;
  }
  if (min_stock_level !== undefined && min_stock_level !== null) {
    updateData.min_stock_level = min_stock_level;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'At least one field (stock or min_stock_level) must be provided to update.' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating stock:', error);
      return res.status(500).json({ error: 'Failed to update product stock.', details: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json({ success: true, updatedProduct: data });

  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.', details: error.message });
  }
}
