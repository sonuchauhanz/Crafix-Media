const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Crafix Media Backend Setup\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. This will overwrite it.\n');
}

const questions = [
    {
        name: 'email',
        question: 'Enter your Gmail address: ',
        default: 'your-email@gmail.com'
    },
    {
        name: 'appPassword',
        question: 'Enter your Gmail App Password: ',
        default: 'your-app-password'
    },
    {
        name: 'recipientEmail',
        question: 'Enter recipient email (where contact form emails will be sent): ',
        default: 'hello@crafixmedia.com'
    },
    {
        name: 'port',
        question: 'Enter server port (default: 3000): ',
        default: '3000'
    },
    {
        name: 'corsOrigin',
        question: 'Enter frontend URL for CORS (default: http://localhost:5500): ',
        default: 'http://localhost:5500'
    }
];

let answers = {};

function askQuestion(index) {
    if (index >= questions.length) {
        createEnvFile();
        return;
    }

    const question = questions[index];
    rl.question(question.question, (answer) => {
        answers[question.name] = answer || question.default;
        askQuestion(index + 1);
    });
}

function createEnvFile() {
    const envContent = `# Server Configuration
PORT=${answers.port}
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=${answers.email}
EMAIL_PASS=${answers.appPassword}
EMAIL_FROM=${answers.email}
EMAIL_TO=${answers.recipientEmail}

# CORS Configuration
CORS_ORIGIN=${answers.corsOrigin}
`;

    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ .env file created successfully!');
    console.log('\n📧 Email Configuration:');
    console.log(`   From: ${answers.email}`);
    console.log(`   To: ${answers.recipientEmail}`);
    console.log(`   Port: ${answers.port}`);
    console.log(`   CORS Origin: ${answers.corsOrigin}`);
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Start the server: npm run dev');
    console.log('3. Test the contact form on your website');
    
    console.log('\n⚠️  Important: Make sure you have:');
    console.log('- Enabled 2-Step Verification on your Gmail account');
    console.log('- Generated an App Password for this application');
    console.log('- The frontend is running on the specified CORS origin');
    
    rl.close();
}

// Start the setup process
askQuestion(0);
