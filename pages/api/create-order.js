import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { renderAsync } from '@react-email/render';
import OrderConfirmationEmail from '../../components/emails/OrderConfirmation';

// Initialize Supabase client with the SERVICE ROLE KEY
// This is crucial for performing admin-level operations like inserting into protected tables and decrementing stock.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { shippingDetails, items } = req.body;

  // --- 1. Calculate totals server-side to ensure data integrity ---
  const productIds = items.map(item => item.id);
  const { data: products, error: productError } = await supabaseAdmin
    .from('products')
    .select('id, price, stock')
    .in('id', productIds);

  if (productError) {
    return res.status(500).json({ error: 'Could not fetch products for validation.' });
  }

  let subtotal = 0;
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    if (!product || item.quantity > product.stock) {
      return res.status(400).json({ error: `Stock issue with product ${item.name}.` });
    }
    subtotal += product.price * item.quantity;
  }

  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  // --- 2. Create Order in a Transaction ---
  try {
    // Insert the main order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: shippingDetails.fullName,
        customer_email: shippingDetails.email,
        customer_phone: shippingDetails.phone,
        customer_rut: shippingDetails.rut,
        shipping_address: {
          region: shippingDetails.region,
          city: shippingDetails.city,
          postal_code: shippingDetails.postalCode,
          address: shippingDetails.address,
          address2: shippingDetails.address2,
        },
        subtotal,
        tax,
        total,
        status: 'pending_payment',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price, // Price at the time of purchase
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // Decrement stock for each product
    for (const item of items) {
      const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
        product_id_to_update: item.id,
        quantity_to_decrement: item.quantity
      });
      if (stockError) throw stockError;
    }

    // --- 3. Send Confirmation Email with Resend ---
    try {
      console.log('Attempting to send confirmation email...');
      
      const emailData = {
        orderDetails: {
          orderId: order.id,
          items: items,
          total: total,
        },
        customerName: shippingDetails.fullName,
        shippingAddress: {
          name: shippingDetails.fullName,
          address: {
            line1: shippingDetails.address, // e.g., 'vicuña'
            city: shippingDetails.city, // This field was missing from your log
            state: shippingDetails.region, // e.g., 'santiago'
            postal_code: shippingDetails.postalCode, // This was also missing
            country: 'CL', // Assuming Chile
          },
        },
      };

      console.log('Email data prepared:', JSON.stringify(emailData, null, 2));

      const emailHtml = await renderAsync(<OrderConfirmationEmail {...emailData} />);

      const { data, error: emailError } = await resend.emails.send({
        from: 'Tienda Mapache <onboarding@resend.dev>',
        to: shippingDetails.email,
        bcc: 'rafael.soteldo.ve@gmail.com',
        subject: `Confirmación de tu pedido #${order.id}`,
        html: emailHtml,
      });

      if (emailError) {
        throw emailError;
      }

      console.log('Email sent successfully! Email ID:', data.id);

    } catch (error) {
      // Log the error, but don't block the user's successful order response.
      // This is crucial for production so the user isn't affected by email issues.
      console.error('--- Resend Email Error ---');
      console.error('Failed to send confirmation email for order ID:', order.id);
      console.error(error);
      console.error('--- End of Resend Email Error ---');
    }

    res.status(200).json({ success: true, orderId: order.id, token: order.access_token });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order.', details: error.message });
  }
}
