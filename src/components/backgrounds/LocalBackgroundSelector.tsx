'use client';

import { useState, useRef } from 'react';

interface LocalBackgroundSelectorProps {
  selectedBackground: string;
  onBackgroundSelect: (backgroundId: string, backgroundValue?: string) => void;
}

export const LocalBackgroundSelector: React.FC<LocalBackgroundSelectorProps> = ({
  selectedBackground,
  onBackgroundSelect,
}) => {
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState('');
  const [uploadedBackground, setUploadedBackground] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current custom background value for preview
  const getCurrentCustomBackground = () => {
    if (selectedBackground === 'custom-upload' || selectedBackground === 'custom-url') {
      return typeof window !== 'undefined' ? localStorage.getItem('customBackgroundValue') : null;
    }
    return null;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP, GIF)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('حجم الملف يجب أن لا يتجاوز 5 ميجابايت');
        return;
      }

      // Create object URL for local file
      const objectUrl = URL.createObjectURL(file);
      setUploadedBackground(objectUrl);
      
      // Auto-select the uploaded background
      onBackgroundSelect('custom-upload', objectUrl);
    }
  };

  const handleUrlSubmit = () => {
    if (customBackgroundUrl.trim()) {
      // Basic URL validation
      try {
        new URL(customBackgroundUrl);
        onBackgroundSelect('custom-url', customBackgroundUrl);
      } catch (error) {
        alert('يرجى إدخال رابط صالح');
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload from Device */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          رفع من جهازك
        </h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div
          className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                انقر لاختيار صورة من جهازك
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                JPEG, PNG, WebP, GIF (حتى 5 ميجابايت)
              </p>
            </div>

            <button
              type="button"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              اختر ملف
            </button>
          </div>
        </div>

        {/* Show uploaded background preview */}
        {uploadedBackground && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              معاينة الخلفية المرفوعة:
            </p>
            <div
              className="w-full h-32 rounded-lg bg-cover bg-center border-2 border-gray-300 dark:border-gray-600"
              style={{ backgroundImage: `url(${uploadedBackground})` }}
            />
          </div>
        )}
      </div>

      {/* URL from Internet */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          من الإنترنت
        </h3>
        <div className="flex space-x-reverse space-x-3">
          <input
            type="url"
            value={customBackgroundUrl}
            onChange={(e) => setCustomBackgroundUrl(e.target.value)}
            placeholder="أدخل رابط الصورة..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleUrlSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            استخدام
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          أدخل رابط صورة من الإنترنت (مثال: https://example.com/image.jpg)
        </p>
      </div>

      {/* Custom Background Status */}
      {(selectedBackground === 'custom-upload' || selectedBackground === 'custom-url') && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          <p className="font-medium">تم تحديد خلفية مخصصة!</p>
          <p className="text-sm mt-1">الخلفية المخصصة قيد الاستخدام حالياً</p>
          
          {/* Show current custom background preview */}
          {getCurrentCustomBackground() && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">معاينة الخلفية الحالية:</p>
              <div
                className="w-full h-32 rounded-lg bg-cover bg-center border-2 border-green-300 dark:border-green-700"
                style={{ backgroundImage: `url(${getCurrentCustomBackground()})` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
