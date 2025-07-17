import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.CONTACT_FORM_TO_EMAIL; // Tu email de destino
const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL; // Un email verificado en Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Formulario de Contacto <${fromEmail}>`,
      to: [toEmail],
      reply_to: email, // Para que puedas responder directamente al cliente
      subject: `Nuevo mensaje de ${name} desde tu web`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
          <h2>Nuevo Mensaje de Contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr>
          <h3>Mensaje:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Error al enviar el correo.' });
    }

    res.status(200).json({ success: true, message: 'Mensaje enviado con éxito.' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
