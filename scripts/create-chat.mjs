import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function main() {
    try {
        // 1. Register User 2
        console.log('Registering User 2...');
        const user2Res = await fetch(`${BASE_URL}/auth?type=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'user2@example.com',
                password: 'password123',
                username: 'user2'
            })
        });

        let user2Token;
        if (user2Res.status === 409) {
            console.log('User 2 already exists, logging in...');
            const loginRes = await fetch(`${BASE_URL}/auth?type=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'user2@example.com',
                    password: 'password123'
                })
            });
            const loginData = await loginRes.json();
            user2Token = loginData.token;
        } else {
            const user2Data = await user2Res.json();
            user2Token = user2Data.token;
        }

        // 2. Login as Test User (User 1)
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

        // 3. Get User 2 ID
        // We can get it from the token or by searching. Let's search.
        const searchRes = await fetch(`${BASE_URL}/search?q=user2`, {
            headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const searchData = await searchRes.json();
        const user2Id = searchData[0].id;

        // 4. Create Chat
        console.log('Creating Chat...');
        const chatRes = await fetch(`${BASE_URL}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user1Token}`
            },
            body: JSON.stringify({
                participantId: user2Id,
                isGroup: false
            })
        });
        const chatData = await chatRes.json();
        const chatId = chatData.id;
        console.log('Chat Created:', chatId);

        // 5. Send Message from User 2 to User 1
        console.log('Sending Message from User 2...');
        const msgRes = await fetch(`${BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user2Token}`
            },
            body: JSON.stringify({
                chatId: chatId,
                content: 'Hello from User 2!'
            })
        });
        const msgData = await msgRes.json();
        console.log('Message Sent:', msgData.content);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
