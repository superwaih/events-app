import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface PaymentReminderData {
  to: string;
  fullName: string;
  inviteCode: string;
  ticketType?: string;
  pairingChoice: string;
  eventDate: string;
  customContent?: string; // Optional custom content
}

export async function POST(request: NextRequest) {  
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const body: PaymentReminderData = await request.json();
    const { to, fullName, inviteCode, ticketType, pairingChoice, eventDate, customContent } = body;
    
    if (!to || !fullName || !inviteCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment reminder email template
    const emailTemplate = customContent ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder - An Evening of Culinary Experience</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9fa;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .custom-content {
            white-space: pre-line;
            font-size: 16px;
            line-height: 1.6;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="custom-content">${customContent}</div>
          
          <div class="footer">
            <p>Thank you for your registration!</p>
            <p><em>An Evening of Culinary Experience Team</em></p>
          </div>
        </div>
      </body>
    </html>
    ` : `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder - An Evening of Culinary Experience</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9fa;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .title {
            color: #2c3e50;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #7f8c8d;
            font-size: 16px;
          }
          .urgent-notice {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .urgent-notice h3 {
            color: #856404;
            margin-top: 0;
            font-size: 18px;
            font-weight: bold;
          }
          .urgent-notice p {
            color: #664d03;
            margin-bottom: 0;
            font-size: 16px;
          }
          .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .detail-item {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .detail-label {
            font-weight: 600;
            color: #34495e;
          }
          .detail-value {
            color: #2c3e50;
          }
          .invite-code {
            background-color: #e8f4fd;
            border: 1px solid #3498db;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            color: #2980b9;
          }
          .ticket-badge {
            background-color: #27ae60;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
          }
          .payment-instructions {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .payment-instructions h3 {
            color: #0c5460;
            margin-top: 0;
            font-size: 16px;
          }
          .payment-instructions p {
            color: #0c5460;
            margin-bottom: 10px;
          }
          .payment-instructions ul {
            color: #0c5460;
            margin-bottom: 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
            font-size: 14px;
          }
          .contact-info {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .contact-info h4 {
            color: #495057;
            margin-top: 0;
            font-size: 14px;
          }
          .deadline-warning {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
          }
          .deadline-warning p {
            color: #721c24;
            margin: 0;
            font-weight: bold;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">Payment Reminder</h1>
            <p class="subtitle">An Evening of Culinary Experience</p>
          </div>
          
          <div class="urgent-notice">
            <h3>⚠️ Payment Required</h3>
            <p>Your payment is still pending for this exclusive culinary event</p>
          </div>
          
          <p>Dear ${fullName},</p>
          
          <p>We hope you're as excited as we are for <strong>An Evening of Culinary Experience</strong>! However, we notice that your payment is still pending.</p>
          
          <div class="deadline-warning">
            <p>⏰ The event is fast approaching - please complete your payment to secure your spot!</p>
          </div>
          
          <div class="details">
            <div class="detail-item">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${fullName}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Invite Code:</span>
              <span class="invite-code">${inviteCode}</span>
            </div>
            ${ticketType ? `
            <div class="detail-item">
              <span class="detail-label">Ticket Type:</span>
              <span class="ticket-badge">${ticketType}</span>
            </div>
            ` : ''}
            <div class="detail-item">
              <span class="detail-label">Pairing Choice:</span>
              <span class="detail-value">${pairingChoice === 'wine' ? 'Wine Pairing' : 'Juice Pairing'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Event Date:</span>
              <span class="detail-value">${eventDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Payment Status:</span>
              <span style="color: #dc3545; font-weight: bold;">PENDING</span>
            </div>
          </div>
          
          <div class="payment-instructions">
            <h3>💳 How to Complete Your Payment:</h3>
            <p>To secure your registration, please complete your payment using one of the following methods:</p>
            <ul>
              <li><strong>Bank Transfer:</strong> [Include bank details here]</li>
              <li><strong>Mobile Money:</strong> [Include mobile money details here]</li>
              <li><strong>Online Payment:</strong> [Include online payment link here]</li>
            </ul>
            <p><strong>Reference:</strong> Use your invite code <strong>${inviteCode}</strong> as the payment reference.</p>
          </div>
          
          <div class="contact-info">
            <h4>📞 Need Help?</h4>
            <p>If you have any questions about payment or need assistance, please contact us:</p>
            <p><strong>Email:</strong> [your-contact-email@domain.com]</p>
            <p><strong>Phone:</strong> [your-contact-number]</p>
          </div>
          
          <p><strong>Important:</strong> Due to limited seating, unpaid registrations may be released to ensure all confirmed guests can enjoy this exclusive experience.</p>
          
          <p>We look forward to welcoming you to this extraordinary culinary journey!</p>
          
          <div class="footer">
            <p>Thank you for choosing our culinary experience!</p>
            <p><em>An Evening of Culinary Experience Team</em></p>
          </div>
        </div>
      </body>
    </html>
    `;

    console.log('Sending payment reminder with Resend API...');
    
    // Use Resend API directly with fetch
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Payment Reminder <onboarding@resend.dev>',
        to: [to],
        subject: '⚠️ Payment Reminder: An Evening of Culinary Experience',
        html: emailTemplate,
      }),
    });

    const responseData = await emailResponse.json();
    console.log('Payment reminder response:', responseData);

    if (!emailResponse.ok) {
      console.error('Payment reminder sending failed:', responseData);
      return NextResponse.json(
        { error: 'Failed to send payment reminder', details: responseData },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Payment reminder sent successfully', data: responseData },
      { status: 200 }
    );

  } catch (error) {
    console.error('=== PAYMENT REMINDER API ERROR ===');
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
