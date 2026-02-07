import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function testEmail() {
    console.log('🔍 Testing Email Configuration...');

    const apiKey = process.env.SMS_API_KEY;
    const apiSecret = process.env.SMS_API_SECRET;
    const fromAddress = process.env.EMAIL_FROM_ADDRESS;
    const fromName = process.env.EMAIL_FROM_NAME || 'ElderCare';
    const recipient = process.env.NOTIFICATION_EMAIL || 'test@example.com';

    console.log('Environment Variables:');
    console.log(`- SMS_API_KEY: ${apiKey ? 'Present' : 'Missing'}`);
    console.log(`- SMS_API_SECRET: ${apiSecret ? 'Present' : 'Missing'}`);
    console.log(`- EMAIL_FROM_ADDRESS: ${fromAddress ? fromAddress : 'Missing'}`);
    console.log(`- EMAIL_FROM_NAME: ${fromName}`);
    console.log(`- RECIPIENT: ${recipient}`);

    if (!apiKey || !apiSecret || !fromAddress) {
        console.error('❌ Missing required configuration!');
        return;
    }

    console.log('\n🚀 Attempting to send test email...');

    const url = 'https://email-api.thaibulksms.com/email/v1/send_template';
    const body = {
        template_uuid: 'default-template-uuid',
        subject: 'Test Email from ElderCare Debug Script',
        mail_from: {
            name: fromName,
            email: fromAddress
        },
        mail_to: [{ email: recipient }],
        payload: {
            message: 'This is a test email to verify configuration.',
            title: 'Test Email'
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        console.log('Response Status:', response.status);
        console.log('Response Body:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ Test Passed: Email sent successfully!');
        } else {
            console.error('❌ Test Failed: API returned error.');
        }

    } catch (error) {
        console.error('❌ Test Exception:', error);
    }
}

testEmail();
