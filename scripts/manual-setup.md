# Manual PocketBase Setup

If the automatic setup fails, follow these manual steps:

## 1. Download PocketBase

Visit: https://pocketbase.io/docs/

Download the correct version for your system:
- **Linux x64**: `pocketbase_0.21.1_linux_amd64.zip`
- **Linux ARM64**: `pocketbase_0.21.1_linux_arm64.zip`
- **macOS x64**: `pocketbase_0.21.1_darwin_amd64.zip`
- **macOS ARM64**: `pocketbase_0.21.1_darwin_arm64.zip`
- **Windows**: `pocketbase_0.21.1_windows_amd64.zip`

## 2. Extract and Place

1. Extract the downloaded ZIP file
2. Copy the `pocketbase` executable to the project root directory
3. Make it executable (Linux/macOS only):
   ```bash
   chmod +x ./pocketbase
   ```

## 3. Initialize Database

```bash
npm run pocketbase:init
```

## 4. Start PocketBase

```bash
npm run pocketbase:start
```

## 5. Start the Application

In a new terminal:
```bash
npm run dev
```

## Quick Alternative (Linux)

```bash
# Download directly
wget https://github.com/pocketbase/pocketbase/releases/download/v0.21.1/pocketbase_0.21.1_linux_amd64.zip

# Extract
unzip pocketbase_0.21.1_linux_amd64.zip

# Make executable
chmod +x pocketbase

# Clean up
rm pocketbase_0.21.1_linux_amd64.zip

# Initialize and start
npm run pocketbase:init
npm run pocketbase:start
```
