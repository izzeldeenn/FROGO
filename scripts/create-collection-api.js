#!/usr/bin/env node

const http = require('http');

// First, authenticate as admin
function authenticate() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      identity: 'admin@example.com',
      password: 'Admin123456!'
    });

    const options = {
      hostname: 'localhost',
      port: 8090,
      path: '/api/admins/auth-with-password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response.token);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Create collection with minimal schema
function createCollection(token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: 'users',
      type: 'base',
      schema: [
        { name: 'accountId', type: 'text', required: true, unique: true },
        { name: 'username', type: 'text', required: true },
        { name: 'email', type: 'email', required: true, unique: true },
        { name: 'hashKey', type: 'text', required: true },
        { name: 'avatar', type: 'text', required: false },
        { name: 'score', type: 'number', required: true },
        { name: 'rank', type: 'number', required: true },
        { name: 'studyTime', type: 'number', required: true },
        { name: 'createdAt', type: 'datetime', required: true },
        { name: 'lastActive', type: 'datetime', required: true }
      ]
    });

    const options = {
      hostname: 'localhost',
      port: 8090,
      path: '/api/collections',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('Collection creation response:', res.statusCode, body);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Execute
async function main() {
  try {
    console.log('🔐 Authenticating...');
    const token = await authenticate();
    console.log('✅ Authenticated successfully');

    console.log('📝 Creating users collection...');
    const collection = await createCollection(token);
    console.log('✅ Users collection created successfully!');
    console.log('🎉 PocketBase is now ready!');
    console.log('🚀 Restart your app with: npm run dev');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🌐 Please create the collection manually at: http://localhost:8090/_/');
  }
}

main();
