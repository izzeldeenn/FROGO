#!/usr/bin/env node

const PocketBase = require('pocketbase/cjs');

async function createSimpleCollection() {
  const pb = new PocketBase('http://localhost:8090');
  
  try {
    // Authenticate as admin
    await pb.admins.authWithPassword('admin@example.com', 'Admin123456!');
    console.log('✅ Admin authentication successful');
    
    // Create users collection with minimal schema to avoid formatting issues
    const collection = await pb.collections.create({
      name: 'users',
      type: 'base',
      schema: [
        { name: 'accountId', type: 'text', required: true },
        { name: 'username', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'hashKey', type: 'text', required: true },
        { name: 'avatar', type: 'text', required: false },
        { name: 'score', type: 'number', required: true },
        { name: 'rank', type: 'number', required: true },
        { name: 'studyTime', type: 'number', required: true },
        { name: 'createdAt', type: 'datetime', required: true },
        { name: 'lastActive', type: 'datetime', required: true }
      ]
    });
    
    console.log('✅ Users collection created successfully');
    console.log('🎉 PocketBase is now ready!');
    console.log('🚀 Start your app with: npm run dev');
    
  } catch (error) {
    console.log('Collection creation failed, trying manual approach...');
    console.log('🌐 Please create the collection manually:');
    console.log('   1. Visit: http://localhost:8090/_/');
    console.log('   2. Login with: admin@example.com / Admin123456!');
    console.log('   3. Click "New Collection"');
    console.log('   4. Name: users');
    console.log('   5. Add fields: accountId, username, email, hashKey, avatar, score, rank, studyTime, createdAt, lastActive');
  }
}

createSimpleCollection().catch(console.error);
