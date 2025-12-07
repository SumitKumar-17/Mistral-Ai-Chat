import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function main() {
    try {
        console.log('Creating Mistral AI User...');

        // Try to register
        const res = await fetch(`${BASE_URL}/auth?type=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'ai@mistral.com',
                password: 'secure_ai_password_123', // We won't really use this
                username: 'Mistral AI'
            })
        });

        if (res.status === 201) {
            console.log('Mistral AI user created successfully.');
        } else if (res.status === 409) {
            console.log('Mistral AI user already exists.');
        } else {
            const data = await res.json();
            console.error('Failed to create AI user:', data);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
