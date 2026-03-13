#!/usr/bin/env node

const PocketBase = require('pocketbase/cjs');

async function initializePocketBase() {
  const pb = new PocketBase('http://localhost:8090');
  
  try {
    // Try to authenticate as admin with the created password
    await pb.admins.authWithPassword('admin@example.com', 'Admin123456!');
    console.log('✅ Admin authentication successful');
  } catch (error) {
    console.log('📝 Creating admin account...');
    try {
      await pb.admins.create({
        email: 'admin@example.com',
        password: 'Admin123456!',
        passwordConfirm: 'Admin123456!',
      });
      console.log('✅ Admin account created');
      
      // Authenticate with the new admin
      await pb.admins.authWithPassword('admin@example.com', 'Admin123456!');
    } catch (createError) {
      if (createError.status === 400) {
        console.log('✅ Admin account already exists, trying default password');
        try {
          await pb.admins.authWithPassword('admin@example.com', 'Admin123456!');
        } catch (authError) {
          console.error('❌ Admin authentication failed. Please check PocketBase admin panel.');
          console.log('🌐 Visit: http://localhost:8090/_/');
          console.log('📧 Email: admin@example.com');
          console.log('🔑 Password: Admin123456!');
          throw authError;
        }
      } else {
        console.error('❌ Error creating admin:', createError);
        throw createError;
      }
    }
  }
  
  try {
    // Create users collection
    const collection = await pb.collections.create({
      name: 'users',
      type: 'base',
      schema: [
        {
          name: 'accountId',
          type: 'text',
          required: true,
          unique: true,
          options: {
            min: 10,
            max: 100
          }
        },
        {
          name: 'username',
          type: 'text',
          required: true,
          options: {
            min: 3,
            max: 50
          }
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
          required: true,
          options: {
            min: 32,
            max: 32
          }
        },
        {
          name: 'avatar',
          type: 'text',
          required: false,
          options: {
            max: 10
          }
        },
        {
          name: 'score',
          type: 'number',
          required: true,
          options: {
            min: 0
          }
        },
        {
          name: 'rank',
          type: 'number',
          required: true,
          options: {
            min: 1
          }
        },
        {
          name: 'studyTime',
          type: 'number',
          required: true,
          options: {
            min: 0
          }
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
    console.log('🎉 PocketBase initialization complete!');
    console.log('🚀 Your app is ready to use with real-time database!');
    
  } catch (error) {
    if (error.status === 400 && error.data?.name === 'users') {
      console.log('✅ Users collection already exists');
      console.log('🎉 PocketBase is ready to use!');
    } else {
      console.error('❌ Error creating collection:', error);
      console.log('🌐 You can manually create the collection in the admin panel:');
      console.log('   http://localhost:8090/_/');
      throw error;
    }
  }
}

// Run if called directly
if (require.main === module) {
  initializePocketBase().catch(console.error);
}

module.exports = { initializePocketBase };
