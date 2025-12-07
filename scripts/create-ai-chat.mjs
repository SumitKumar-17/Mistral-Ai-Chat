import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function main() {
    try {
        // 1. Login as Test User
        console.log('Logging in as Test User...');
        const user1Res = await fetch(`${BASE_URL}/auth?type=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });
        const user1Data = await user1Res.json();
        const user1Token = user1Data.token;

        // 2. Search for Mistral AI
        console.log('Searching for Mistral AI...');
        const searchRes = await fetch(`${BASE_URL}/search?q=Mistral`, {
            headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const searchData = await searchRes.json();
        const aiUser = searchData.find(u => u.username === 'Mistral AI');

        if (!aiUser) {
            console.error('Mistral AI user not found!');
            return;
        }
        console.log('Found Mistral AI:', aiUser.id);

        // 3. Create Chat
        console.log('Creating Chat with Mistral AI...');
        const chatRes = await fetch(`${BASE_URL}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user1Token}`
            },
            body: JSON.stringify({
                participantId: aiUser.id,
                isGroup: false
            })
        });
        const chatData = await chatRes.json();
        console.log('Chat Created:', chatData.id);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
