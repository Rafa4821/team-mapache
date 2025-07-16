import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the SERVICE ROLE KEY for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// A simple check for an admin secret. In a real app, this should be proper authentication.
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'SUPER_SECRET_ADMIN_KEY';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- Basic Auth Check ---
  const providedSecret = req.headers['authorization']?.split(' ')[1];
  if (providedSecret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { status, search } = req.query;

    let query = supabaseAdmin
      .from('orders')
      .select('*');

    // Apply filter by status if provided and not 'all'
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply search by customer name if provided
    if (search) {
      // Use 'ilike' for case-insensitive search
      query = query.ilike('customer_name', `%${search}%`);
    }

    // Always order by creation date, newest first
    query = query.order('created_at', { ascending: false });

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders.' });
    }

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.', details: error.message });
  }
}
