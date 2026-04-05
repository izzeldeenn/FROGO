# Custom Backgrounds Feature

## Overview
This feature allows users to customize their application background by:
1. Uploading an image from their device
2. Using an image URL from the internet
3. Selecting from default backgrounds

## How It Works

### Local Storage Only
- **No database storage**: Custom backgrounds are stored locally in the browser's localStorage
- **No file uploads to server**: Files are converted to object URLs and stored locally
- **User-specific**: Each user can have their own custom background without affecting others

### Implementation Details

#### Components
- `LocalBackgroundSelector.tsx`: Main component for custom background selection
- `useBackgroundValue.ts`: Hook to get current background value in any component

#### Storage Keys
- `selectedBackground`: Stores the background ID (e.g., 'custom-upload', 'custom-url', or default background ID)
- `customBackgroundValue`: Stores the actual background value (URL or object URL)

#### Background IDs
- `'default'`: Default transparent background
- `'custom-upload'`: Background uploaded from device
- `'custom-url'`: Background from internet URL
- Default background IDs from `BACKGROUNDS` constant

## Usage in Components

### Getting Current Background
```typescript
import { useBackgroundValue } from '@/hooks/useBackgroundValue';

const MyComponent = () => {
  const { getBackgroundValue } = useBackgroundValue();
  
  const backgroundStyle = {
    background: getBackgroundValue(),
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  return <div style={backgroundStyle}>Content</div>;
};
```

### Listening for Background Changes
```typescript
useEffect(() => {
  const handleBackgroundChange = (event: CustomEvent) => {
    const { backgroundId, customValue } = event.detail;
    // Handle background change
  };

  window.addEventListener('backgroundChange', handleBackgroundChange as EventListener);
  
  return () => {
    window.removeEventListener('backgroundChange', handleBackgroundChange as EventListener);
  };
}, []);
```

## File Types and Limits
- **Supported formats**: JPEG, PNG, WebP, GIF
- **Maximum file size**: 5MB
- **URL validation**: Basic URL format validation for internet images

## Security Considerations
- Object URLs are created for local files and automatically cleaned up when the page is unloaded
- No files are uploaded to any server
- Internet URLs are validated but not proxied or cached

## User Experience
- Drag and drop support for file uploads
- Preview of uploaded images
- Visual feedback for selected background
- Error handling for invalid files or URLs
