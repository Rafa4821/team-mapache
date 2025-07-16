import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `https://${process.env.NEXT_PUBLIC_APP_URL}` : '';

const OrderConfirmationEmail = ({ orderDetails, customerName, shippingAddress }) => {
  const { orderId, items, total } = orderDetails;

  return (
    <Html>
      <Head />
      <Preview>Confirmación de tu pedido #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            {/* Asegúrate de que tu logo esté en la carpeta `public` */}
            <Img src={`${baseUrl}/logo.png`} width="150" height="auto" alt="Tu Logo" />
          </Section>
          <Heading style={h1}>Gracias por tu compra, {customerName}!</Heading>
          <Text style={paragraph}>Estamos preparando tu pedido para enviártelo lo antes posible. Aquí tienes un resumen de tu compra.</Text>
          
          <Section style={orderInfoContainer}>
            <Text style={orderIdText}>Pedido #{orderId}</Text>
          </Section>

          <Hr style={hr} />

          {items.map((item, index) => (
            <Row key={index} style={itemRow}>
              <Column>
                <Text style={itemText}>{item.name}</Text>
              </Column>
              <Column style={itemDetailsColumn}>
                <Text style={itemMutedText}>{item.quantity} x ${item.price.toFixed(2)}</Text>
              </Column>
              <Column style={itemPriceColumn} align="right">
                <Text style={itemPrice}>${(item.quantity * item.price).toFixed(2)}</Text>
              </Column>
            </Row>
          ))}

          <Hr style={hr} />

          <Row style={totalRow}>
            <Column>
              <Text style={itemText}>Total</Text>
            </Column>
            <Column align="right">
              <Text style={totalPrice}>${total.toFixed(2)}</Text>
            </Column>
          </Row>

          <Hr style={hr} />

          <Section style={shippingSection}>
            <Heading as="h2" style={h2}>Dirección de Envío</Heading>
            <Text style={addressText}>
              {shippingAddress.name}<br />
              {shippingAddress.address.line1}{shippingAddress.address.city ? `, ${shippingAddress.address.city}` : ''}<br />
              {shippingAddress.address.state}{shippingAddress.address.postal_code ? `, ${shippingAddress.address.postal_code}` : ''}<br />
              {shippingAddress.address.country}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>Gracias por confiar en nosotros.</Text>
            <Link href={baseUrl} style={footerLink}>Visita nuestra tienda</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #e6ebf1',
  borderRadius: '5px',
};

const logoContainer = {
  textAlign: 'center',
  padding: '20px 0',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '32px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0 30px',
  textAlign: 'center',
};

const h2 = {
    color: '#1d1c1d',
    fontSize: '20px',
    fontWeight: '600',
    margin: '20px 0 10px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center',
  padding: '0 30px',
};

const orderInfoContainer = {
    padding: '0 30px',
}

const orderIdText = {
    fontSize: '14px',
    color: '#555',
    fontWeight: 'bold',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const itemRow = {
    padding: '0 30px',
}

const itemText = {
    fontSize: '16px',
    color: '#333',
}

const itemMutedText = {
    fontSize: '14px',
    color: '#777',
}

const itemPriceColumn = {
    verticalAlign: 'top',
}

const itemDetailsColumn = {
    verticalAlign: 'top',
}

const itemPrice = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
}

const totalRow = {
    padding: '0 30px',
}

const totalPrice = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1d1c1d',
}

const shippingSection = {
    padding: '0 30px',
}

const addressText = {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#555',
}

const footer = {
  padding: '0 30px',
  textAlign: 'center',
};

const footerText = {
    fontSize: '12px',
    color: '#8898aa',
}

const footerLink = {
    color: '#5e6ad2',
    fontSize: '14px',
}
