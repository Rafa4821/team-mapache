import { createClient } from '@supabase/supabase-js';

// Este cliente se inicializa con la SERVICE_KEY para tener acceso de administrador.
// Solo debe usarse en el lado del servidor (getServerSideProps, API routes).
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function fetchAdminOrders({ status, search }) {
  let query = supabaseAdmin
    .from('orders')
    .select('*');

  // Aplicar filtro por estado si se proporciona y no es 'todos'
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  // Aplicar búsqueda por nombre de cliente si se proporciona
  if (search) {
    // Usar 'ilike' para búsqueda insensible a mayúsculas/minúsculas
    query = query.ilike('customer_name', `%${search}%`);
  }

  // Ordenar siempre por fecha de creación, los más nuevos primero
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders from Supabase:', error);
    // Lanzar el error para que sea capturado por el llamador (getServerSideProps)
    throw new Error('Failed to fetch orders.');
  }

  return data;
}
