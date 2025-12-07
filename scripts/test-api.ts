import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3001/api';
const TEST_USER = {
    username: 'testuser_' + Date.now(),
    email: 'test_' + Date.now() + '@example.com',
    password: 'password123'
};

let authToken = '';

async function testRegister() {
    console.log('Testing Registration...');
    const res = await fetch(`${BASE_URL}/auth?type=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
    });

    const data = await res.json();
    console.log('Register Response:', res.status, data);

    if (res.status === 201) {
        authToken = data.token;
        return true;
    }
    return false;
}

async function testLogin() {
    console.log('\nTesting Login...');
    const res = await fetch(`${BASE_URL}/auth?type=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: TEST_USER.email,
            password: TEST_USER.password
        })
    });

    const data = await res.json();
    console.log('Login Response:', res.status, data);

    if (res.status === 200) {
        authToken = data.token;
        return true;
    }
    return false;
}

async function testGetProfile() {
    console.log('\nTesting Get Profile...');
    const res = await fetch(`${BASE_URL}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    const data = await res.json();
    console.log('Get Profile Response:', res.status, data);
    return res.status === 200;
}

async function testUpdateProfile() {
    console.log('\nTesting Update Profile...');
    const res = await fetch(`${BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bio: 'Updated bio for testing'
        })
    });

    const data = await res.json();
    console.log('Update Profile Response:', res.status, data);
    return res.status === 200;
}

async function testUpload() {
    console.log('\nTesting File Upload...');

    // Create a dummy file
    const filePath = path.join(process.cwd(), 'test-upload.txt');
    fs.writeFileSync(filePath, 'This is a test file content');

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            ...form.getHeaders()
        },
        body: form
    });

    const data = await res.json();
    console.log('Upload Response:', res.status, data);

    // Cleanup
    fs.unlinkSync(filePath);

    return res.status === 200;
}

async function runTests() {
    try {
        if (!await testRegister()) process.exit(1);
        if (!await testLogin()) process.exit(1);
        if (!await testGetProfile()) process.exit(1);
        if (!await testUpdateProfile()) process.exit(1);
        if (!await testUpload()) process.exit(1);

        console.log('\nAll tests passed!');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runTests();
