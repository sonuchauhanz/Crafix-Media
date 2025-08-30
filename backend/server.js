const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            process.env.CORS_ORIGIN
        ].filter(Boolean);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log('Email server error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, company, project, budget, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: `New Contact Form Submission - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #555;">Name:</strong>
                            <span style="color: #333;">${name}</span>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #555;">Email:</strong>
                            <span style="color: #333;">${email}</span>
                        </div>
                        
                        ${company ? `
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #555;">Company/Organization:</strong>
                            <span style="color: #333;">${company}</span>
                        </div>
                        ` : ''}
                        
                        ${project ? `
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #555;">Project Type:</strong>
                            <span style="color: #333;">${project}</span>
                        </div>
                        ` : ''}
                        
                        ${budget ? `
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #555;">Budget Range:</strong>
                            <span style="color: #333;">${budget}</span>
                        </div>
                        ` : ''}
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #555;">Message:</strong>
                            <div style="color: #333; background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 5px;">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                            <p>This message was sent from the Crafix Media contact form.</p>
                            <p>Submitted on: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', info.messageId);

        res.status(200).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Crafix Media Backend API',
        version: '1.0.0',
        endpoints: {
            contact: '/api/contact',
            health: '/api/health'
        }
    });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📧 Email will be sent to: ${process.env.EMAIL_TO}`);
        console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5500'}`);
    });
}

module.exports = app;
