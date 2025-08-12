# Email Reminder Setup Instructions

This guide will help you set up the email reminder functionality for your events app.

## 🎯 **Email Features Available**

1. **General Event Reminder**: Sent to all attendees with event details and reminders
2. **Payment Reminder**: Sent only to attendees with pending payments (urgent payment notification)

## 1. Set up Resend Account

1. Go to [Resend.com](https://resend.com) and create a free account
2. Verify your email address
3. Navigate to the API Keys section in your dashboard
4. Create a new API key and copy it

## 2. Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace `your_resend_api_key_here` with your actual Resend API key:
   ```
   RESEND_API_KEY=re_YourActualAPIKey_here
   ```

## 3. Payment Reminder Configuration

The payment reminder feature includes:

### 🎨 **Visual Design Features:**
- ⚠️ Urgent warning banners
- 💳 Payment instruction sections
- ⏰ Deadline warnings
- 📞 Contact information section

### 🔧 **Customize Payment Instructions:**

Edit the payment reminder template in `/app/api/send-payment-reminder/route.ts`:

```html
<li><strong>Bank Transfer:</strong> [Include your bank details here]</li>
<li><strong>Mobile Money:</strong> [Include your mobile money details here]</li>
<li><strong>Online Payment:</strong> [Include your payment link here]</li>
```

Update the contact information:
```html
<p><strong>Email:</strong> [your-contact-email@domain.com]</p>
<p><strong>Phone:</strong> [your-contact-number]</p>
```

## 4. Domain Setup (For Production)

For production use, you'll need to:

1. **Add your domain to Resend:**
   - Go to your Resend dashboard
   - Add and verify your domain
   - Update the `from` field in both API routes:
     - `/app/api/send-reminder/route.ts`
     - `/app/api/send-payment-reminder/route.ts`
   - Change `onboarding@resend.dev` to your verified domain

2. **For development/testing:**
   - Resend allows sending to your own email address even without domain verification
   - You can test both features by sending to your own email

## 5. Event Date Configuration

Update the event date in both functions in `/app/admin/page.tsx`:

```typescript
// In sendEmailReminder function:
eventDate: 'Saturday, August 16, 2025 at 7:00 PM', // Update this

// In sendPaymentReminder function:
eventDate: 'Saturday, August 16, 2025 at 7:00 PM', // Update this
```

## 6. Testing the Features

1. Make sure your development server is running: `pnpm dev`
2. Go to the admin dashboard at `/admin`
3. **For registrations with pending payments**: You'll see both buttons:
   - 🟠 **"Payment Reminder"** (orange) - sends urgent payment notification
   - 🔵 **"Send Reminder"** (blue) - sends general event reminder
4. **For paid registrations**: You'll only see:
   - 🔵 **"Send Reminder"** (blue) - sends general event reminder

## 7. Features Included

### ✅ **General Event Reminder:**
- Professional event details
- Registration information
- Event instructions and dress code
- Arrival reminders

### ✅ **Payment Reminder:**
- Urgent payment warnings
- Detailed payment instructions
- Contact information for assistance
- Deadline notifications
- Registration details with payment status

### ✅ **UI Features:**
- Smart button visibility (payment reminder only for pending payments)
- Different color coding (orange for payment, blue for general)
- Loading states and error handling
- Toast notifications for success/failure
- Prevents multiple simultaneous sends

## 8. Rate Limits

Resend free plan includes:
- 3,000 emails per month
- 100 emails per day

For higher volumes, consider upgrading to a paid plan.

## 9. Customization Tips

### **Payment Instructions:**
- Update bank details, mobile money numbers, or online payment links
- Add specific payment deadlines
- Include late payment policies

### **Contact Information:**
- Add your customer service details
- Include business hours
- Add WhatsApp or other communication channels

### **Branding:**
- Customize colors in the CSS styles
- Add your logo (upload to `/public` and reference in template)
- Update company name and branding text

## 10. Troubleshooting

- **Email not received:** Check spam folder, verify API key, ensure recipient email is valid
- **API errors:** Check console logs for detailed error messages
- **Button not showing:** Payment reminder only shows for registrations with `payment_status: "pending"`
- **Domain issues:** Use your verified email address for testing without domain setup

## 11. Security Notes

- Never commit your API key to version control
- Keep your `.env.local` file in `.gitignore`
- Consider additional email validation in production
- Monitor your Resend usage to avoid hitting rate limits
