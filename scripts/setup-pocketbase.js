#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

// Create PocketBase data directory
const pbDataDir = path.join(__dirname, '../pocketbase_data');
const pbFile = path.join(__dirname, '../pocketbase');

if (!fs.existsSync(pbDataDir)) {
  fs.mkdirSync(pbDataDir, { recursive: true });
  console.log('✅ Created PocketBase data directory');
}

// Download PocketBase if not exists
if (!fs.existsSync(pbFile)) {
  console.log('📥 Downloading PocketBase...');
  
  const os = require('os');
  const platform = os.platform();
  const arch = os.arch();
  
  let pocketbaseUrl;
  
  if (platform === 'linux') {
    if (arch === 'x64') {
      pocketbaseUrl = 'https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_linux_amd64.zip';
    } else if (arch === 'arm64') {
      pocketbaseUrl = 'https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_linux_arm64.zip';
    }
  } else if (platform === 'darwin') {
    if (arch === 'x64') {
      pocketbaseUrl = 'https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_darwin_amd64.zip';
    } else if (arch === 'arm64') {
      pocketbaseUrl = 'https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_darwin_arm64.zip';
    }
  } else if (platform === 'win32') {
    pocketbaseUrl = 'https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_windows_amd64.zip';
  }
  
  if (!pocketbaseUrl) {
    console.error('❌ Unsupported platform:', platform, arch);
    console.log('🔧 Manual setup required:');
    console.log('1. Download PocketBase from: https://pocketbase.io/docs/');
    console.log('2. Extract and place the executable in the project root');
    console.log('3. Run: npm run pocketbase:init');
    process.exit(1);
  }
  
  const zipPath = path.join(__dirname, '../pocketbase.zip');
  
  const file = fs.createWriteStream(zipPath);
  
  https.get(pocketbaseUrl, (response) => {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log('✅ PocketBase downloaded successfully');
      
      // Use system unzip command for better reliability
      const unzipCommand = platform === 'win32' ? 'powershell -command "Expand-Archive -Path' : 'unzip -o';
      const targetDir = path.dirname(zipPath);
      
      exec(`${unzipCommand} "${zipPath}" -d "${targetDir}"`, (error, stdout, stderr) => {
        fs.unlinkSync(zipPath); // Clean up zip file
        
        if (error) {
          console.error('❌ Error extracting PocketBase:', error.message);
          console.log('🔧 Try manual extraction or install unzip');
          
          // Fallback: try with node-unzipper
          try {
            const unzipper = require('unzipper');
            fs.createReadStream(zipPath)
              .pipe(unzipper.Extract({ path: targetDir }))
              .on('close', () => {
                fs.unlinkSync(zipPath);
                console.log('✅ PocketBase extracted with fallback method');
                console.log('🚀 Run: npm run pocketbase:init');
              });
          } catch (fallbackError) {
            console.error('❌ Fallback extraction also failed');
            console.log('🔧 Please manually extract pocketbase.zip and run: npm run pocketbase:init');
          }
        } else {
          // Make executable on Unix systems
          if (platform !== 'win32') {
            try {
              fs.chmodSync(pbFile, '755');
            } catch (chmodError) {
              console.warn('⚠️ Could not set executable permissions');
            }
          }
          console.log('✅ PocketBase extracted successfully');
          console.log('🚀 Run: npm run pocketbase:init');
        }
      });
    });
  }).on('error', (err) => {
    fs.unlink(zipPath, () => {});
    console.error('❌ Error downloading PocketBase:', err.message);
    process.exit(1);
  });
} else {
  console.log('✅ PocketBase already exists');
  console.log('🚀 Run: npm run pocketbase:init');
}
