#!/usr/bin/env node

const PocketBase = require('pocketbase/cjs');

async function createUsersCollection() {
  const pb = new PocketBase('http://localhost:8090');
  
  try {
    // Authenticate as admin
    await pb.admins.authWithPassword('admin@example.com', 'Admin123456!');
    console.log('✅ Admin authentication successful');
    
    // Create users collection with simplified schema
    const collection = await pb.collections.create({
      name: 'users',
      type: 'base',
      schema: [
        {
          name: 'accountId',
          type: 'text',
          required: true,
          unique: true
        },
        {
          name: 'username',
          type: 'text',
          required: true
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true
        },
        {
          name: 'hashKey',
          type: 'text',
          required: true
        },
        {
          name: 'avatar',
          type: 'text',
          required: false
        },
        {
          name: 'score',
          type: 'number',
          required: true
        },
        {
          name: 'rank',
          type: 'number',
          required: true
        },
        {
          name: 'studyTime',
          type: 'number',
          required: true
        },
        {
          name: 'createdAt',
          type: 'datetime',
          required: true
        },
        {
          name: 'lastActive',
          type: 'datetime',
          required: true
        }
      ]
    });
    
    console.log('✅ Users collection created successfully');
    console.log('🎉 PocketBase is now ready!');
    console.log('🚀 Start your app with: npm run dev');
    
  } catch (error) {
    if (error.status === 400 && error.data?.name === 'users') {
      console.log('✅ Users collection already exists');
      console.log('🎉 PocketBase is ready!');
    } else {
      console.error('❌ Error creating collection:', error.message);
      console.log('🌐 Please create the collection manually at: http://localhost:8090/_/');
    }
  }
}

createUsersCollection().catch(console.error);
