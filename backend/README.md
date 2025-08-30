# Crafix Media Backend

This is the backend server for the Crafix Media website contact form. It handles form submissions and sends emails to your specified email address.

## Features

- ✅ Contact form processing
- ✅ Email notifications with beautiful HTML templates
- ✅ Form validation
- ✅ CORS support for frontend integration
- ✅ Error handling and logging
- ✅ Health check endpoint

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit the `.env` file with your email credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-gmail@gmail.com
EMAIL_TO=hello@crafixmedia.com

# CORS Configuration
CORS_ORIGIN=http://localhost:5500
```

### 3. Gmail App Password Setup

To use Gmail for sending emails, you need to create an App Password:

1. Go to your Google Account settings
2. Enable 2-Step Verification if not already enabled
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Use this password in the `EMAIL_PASS` field

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /api/contact
Handles contact form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "project": "brand-video",
  "budget": "100-200",
  "message": "Project details..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "messageId": "message-id"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

## Email Template

The contact form submissions are sent as beautifully formatted HTML emails containing:
- Contact information (name, email, company)
- Project details (type, budget)
- Message content
- Submission timestamp

## Frontend Integration

The frontend is already configured to connect to this backend. Make sure:

1. The backend server is running on port 3000
2. CORS is properly configured for your frontend URL
3. The frontend is served from the URL specified in `CORS_ORIGIN`

## Troubleshooting

### Email Not Sending
1. Check your Gmail app password is correct
2. Ensure 2-Step Verification is enabled
3. Verify the email addresses in `.env` are correct
4. Check the server logs for error messages

### CORS Errors
1. Update `CORS_ORIGIN` in `.env` to match your frontend URL
2. Restart the server after changing environment variables

### Port Already in Use
1. Change the `PORT` in `.env` to an available port
2. Update the frontend API URL accordingly

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production email service (SendGrid, AWS SES, etc.)
3. Configure proper CORS origins
4. Set up environment variables on your hosting platform
5. Use a process manager like PM2

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- Consider rate limiting for the contact endpoint
- Validate all input data (already implemented)
- Use HTTPS in production

## Support

For issues or questions, check the server logs or contact the development team.
