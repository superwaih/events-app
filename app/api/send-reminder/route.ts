import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface EmailData {
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
    

    const body: EmailData = await request.json();
     
    const { to, fullName, inviteCode, ticketType, pairingChoice, eventDate, customContent } = body;
    if (!to || !fullName || !inviteCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

 
    // Create email template
    const emailTemplate = customContent ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Reminder</title>
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
        <title>Event Reminder</title>
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
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
            font-size: 14px;
          }
          .reminder-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .reminder-note h3 {
            color: #e17055;
            margin-top: 0;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">Event Reminder</h1>
            <p class="subtitle">An Evening of Culinary Experience</p>
          </div>
          
          <p>Dear ${fullName},</p>
          
          <p>This is a friendly reminder about your upcoming registration for <strong>An Evening of Culinary Experience</strong>.</p>
          
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
          </div>
          
          <div class="reminder-note">
            <h3>📅 Important Reminders:</h3>
            <ul>
              <li>Please arrive 15 minutes before the event starts</li>
              <li>Bring your invite code for quick check-in</li>
              <li>If you have any allergies, please inform our staff upon arrival</li>
              <li>Smart casual dress code is recommended</li>
            </ul>
          </div>
          
          <p>We're excited to see you at this special culinary experience! If you have any questions or need to make any changes to your registration, please don't hesitate to contact us.</p>
          
          <div class="footer">
            <p>Thank you for your registration!</p>
            <p><em>An Evening of Culinary Experience Team</em></p>
          </div>
        </div>
      </body>
    </html>
    `;

    console.log('Sending email with Resend API...');
    
    // Use Resend API directly with fetch
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Event Reminder <onboarding@resend.dev>',
        to: [to],
        subject: 'Reminder: An Evening of Culinary Experience',
        html: emailTemplate,
      }),
    });

    const responseData = await emailResponse.json();
    console.log('Resend API response:', responseData);

    if (!emailResponse.ok) {
      console.error('Email sending failed:', responseData);
      return NextResponse.json(
        { error: 'Failed to send email reminder', details: responseData },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Email reminder sent successfully', data: responseData },
      { status: 200 }
    );

  } catch (error) {
    console.error('=== API ERROR ===');
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
