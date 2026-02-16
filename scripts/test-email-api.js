const https = require('https');

const API_KEY = 'QyHSWzdZPHIWMYf79gp-jnTZjGw7l3';
const API_SECRET = 'D3myX5WjG37f_CFwmmv4LL8XEhf-CM';
const AUTH = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

function apiCall(label, body) {
    return new Promise((resolve) => {
        const data = JSON.stringify(body);
        const opts = {
            hostname: 'email-api.thaibulksms.com',
            path: '/email/v1/send_template',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH,
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const req = https.request(opts, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => {
                console.log(`\n[${label}] Status: ${res.statusCode}`);
                try { console.log(JSON.stringify(JSON.parse(b), null, 2)); } catch { console.log(b); }
                resolve();
            });
        });
        req.on('error', e => { console.log(`[${label}] Error: ${e.message}`); resolve(); });
        req.write(data);
        req.end();
    });
}

async function main() {
    const base = {
        template_uuid: '26021023-4417-88e0-83a0-d82f257f32e9',
        subject: 'Test ElderCare',
        mail_from: { name: 'Thesavezone', email: 'test@inernationaljewelrycasting.com' }
    };

    // Test 1: mail_to with "address" key instead of "email"
    console.log('=== Test 1: mail_to with "address" key ===');
    await apiCall('address_key', { ...base, mail_to: [{ address: 'batriey.k@gmail.com' }] });

    // Test 2: mail_to with "to" key
    console.log('\n=== Test 2: mail_to with "to" key ===');
    await apiCall('to_key', { ...base, mail_to: [{ to: 'batriey.k@gmail.com' }] });

    // Test 3: mail_to with "mail" key
    console.log('\n=== Test 3: mail_to with "mail" key ===');
    await apiCall('mail_key', { ...base, mail_to: [{ mail: 'batriey.k@gmail.com' }] });

    // Test 4: mail_to with nested array [[{email}]]
    console.log('\n=== Test 4: mail_to with nested array ===');
    await apiCall('nested', { ...base, mail_to: [[{ email: 'batriey.k@gmail.com' }]] });

    // Test 5: Try field "to" at top level instead of mail_to
    console.log('\n=== Test 5: "to" at top level ===');
    await apiCall('top_level_to', { ...base, to: [{ email: 'batriey.k@gmail.com' }] });

    // Test 6: mail_to as single object (not array)
    console.log('\n=== Test 6: mail_to as single object ===');
    await apiCall('single_obj', { ...base, mail_to: { email: 'batriey.k@gmail.com' } });

    // Test 7: Send to the verified sender email itself
    console.log('\n=== Test 7: Send to verified sender email ===');
    await apiCall('self_send', { ...base, mail_to: [{ email: 'test@inernationaljewelrycasting.com' }] });

    // Test 8: mail_from with "address" key instead of "email"
    console.log('\n=== Test 8: mail_from with "address" key ===');
    await apiCall('from_address_key', {
        template_uuid: '26021023-4417-88e0-83a0-d82f257f32e9',
        subject: 'Test',
        mail_from: { name: 'Thesavezone', address: 'test@inernationaljewelrycasting.com' },
        mail_to: [{ email: 'batriey.k@gmail.com' }]
    });

    console.log('\n=== Done ===');
}

main().catch(console.error);
