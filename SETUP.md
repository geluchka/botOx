# WhatsApp Bot Manager - Setup Guide

Your WhatsApp bot management system is ready! This guide will help you configure it properly.

## What's Been Built

1. **Database**: A Supabase database table to store phone numbers
2. **Edge Functions**:
   - `whatsapp-webhook`: Handles incoming WhatsApp messages and implements the interactive menu
   - `send-message`: Sends outgoing messages to phone numbers
3. **Web Interface**: A beautiful UI to manage contacts and send messages

## Configuration Steps

### 1. Get Your Phone Number ID

You provided the phone number `+1 555 191 5660`, but WhatsApp Cloud API requires a **Phone Number ID** (different from the actual phone number).

To get your Phone Number ID:
1. Go to [Meta Business Settings](https://business.facebook.com/settings/)
2. Navigate to **Accounts** → **WhatsApp Accounts**
3. Select your WhatsApp Business Account
4. Click on your phone number
5. Copy the **Phone number ID** (it looks like: `123456789012345`)

### 2. Configure Environment Variables

The edge functions need these environment variables configured in Supabase:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Edge Functions**
4. Add these secrets:
   - `WHATSAPP_ACCESS_TOKEN`: Your access token
   - `WHATSAPP_PHONE_NUMBER_ID`: Your phone number ID (from step 1)

**Your Access Token** (already provided):
```
EAAT8nEkRd48BQYtx1ADy2v2Gyf8NnI9GQU7PZA8gUtXZC539WyIICNZAsw3t7Jw0M8xYHEO1WZABZCDdfr0e7PhycPcQvqjzedpL2skPM1UqpZAD25nCJAKj833fTM1zTBIZAvUlncpaK7PUMw2EusbuawhAt0zZAK7y53QZAm91nZAvvjg32pPRxbFIRFyKll9wbbaTglrFthHQ4J39yWCpULOZB9Y7l7t2c5rMNppNuq2hcfn04ZB14mG8wr3qrZBVxGtoqpQAX0QxhD7zqRbNWCUxzi2lVlgZDZD
```

### 3. Configure WhatsApp Webhook

To enable the interactive menu system, configure your webhook in Meta:

1. Go to [Meta App Dashboard](https://developers.facebook.com/apps/)
2. Select your app
3. Go to **WhatsApp** → **Configuration**
4. Under **Webhook**, click **Edit**
5. Enter these values:
   - **Callback URL**: `https://crrausrygmgzpfgtewrb.supabase.co/functions/v1/whatsapp-webhook`
   - **Verify Token**: `whatsapp_webhook_verify_token_123`
6. Click **Verify and Save**
7. Subscribe to the `messages` webhook field

## How It Works

### Web Interface
- Add phone numbers to your contact list
- Select a contact
- Click one of three buttons to send predefined messages:
  - **Laundry**: "your laundry is ready"
  - **Class**: "the class you asked for is ready"
  - **Task**: "there is a new task for you"

### Interactive Menu Bot
When users message your WhatsApp number, they'll receive an interactive menu:

**Main Menu** (Services):
- Laundry
- Class Reservation
- Doctor's Appointment

**Laundry Menu**:
- Reserve
- Finished
- Delay

**Class Reservation Menu**:
- Small Class
- Big Class
- Auditorium

**Doctor's Appointment Menu**:
- Dr. Almog
- Dr. Daniel
- Dr. Sus

When any option is selected, the bot replies: "the service will be added soon:)"

## Testing

1. **Test the Web Interface**:
   - Add your own phone number
   - Select it
   - Click one of the message buttons
   - You should receive the message on WhatsApp

2. **Test the Interactive Menu**:
   - Send any text message to your WhatsApp bot number
   - You should receive the services menu
   - Select an option and navigate through the menus

## Troubleshooting

- **Messages not sending**: Check that environment variables are configured correctly in Supabase
- **Webhook not working**: Verify the webhook URL and token in Meta settings
- **Menu not appearing**: Make sure the webhook is subscribed to the `messages` field

## Important Notes

- Phone numbers must be in international format (e.g., +1234567890)
- The access token may expire and need to be renewed periodically
- Make sure your WhatsApp Business Account is verified and approved by Meta
