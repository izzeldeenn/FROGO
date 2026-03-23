'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { useUser } from '@/contexts/UserContext';
import { useFullscreen } from '@/contexts/FullscreenContext';
import { dailyActivityDB } from '@/lib/dailyActivity';

interface PDFStudyTimerProps {
  onClose?: () => void;
}

export function PDFStudyTimer({ onClose }: PDFStudyTimerProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const customTheme = useCustomThemeClasses();
  const { getCurrentUser, updateUserStudyTime, setTimerActive } = useUser();
  const { requestFullscreen } = useFullscreen();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfTitle, setPdfTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved PDF on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPdf = localStorage.getItem('pdf_study_file');
      if (savedPdf) {
        try {
          const pdfData = JSON.parse(savedPdf);
          setPdfUrl(pdfData.url);
          setPdfTitle(pdfData.title);
        } catch (error) {
          console.error('Error loading saved PDF:', error);
          localStorage.removeItem('pdf_study_file');
        }
      }
    }
  }, []);
  
  // Timer state
  const [time, setTime] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pdf_timer_state');
      if (saved) {
        const state = JSON.parse(saved);
        return state.time || 0;
      }
    }
    return 0;
  });
  const [isRunning, setIsRunning] = useState(false);
  const realtimeUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const state = { time };
      localStorage.setItem('pdf_timer_state', JSON.stringify(state));
    }
  }, [time]);

  useEffect(() => {
    if (isRunning) {
      setTimerActive(true);
      
      intervalRef.current = setInterval(() => {
        setTime((prevTime: number) => prevTime + 1);
      }, 1000);
      
      realtimeUpdateRef.current = setInterval(async () => {
        const currentUser = getCurrentUser();
        if (currentUser?.accountId) {
          await dailyActivityDB.updateStudyTimeRealtime(currentUser.accountId, 1);
          updateUserStudyTime(1);
        }
      }, 1000);
    } else {
      setTimerActive(false);
      if (realtimeUpdateRef.current) {
        clearInterval(realtimeUpdateRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      setTimerActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (realtimeUpdateRef.current) {
        clearInterval(realtimeUpdateRef.current);
      }
    };
  }, [isRunning]);

  // Timer functions
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser?.accountId) {
      return;
    }
    
    const success = await dailyActivityDB.startStudySession(currentUser.accountId);
    if (success) {
      setIsRunning(true);
    }
  };

  const handleStop = async () => {
    if (isRunning) {
      const currentUser = getCurrentUser();
      if (currentUser?.accountId) {
        await dailyActivityDB.endStudySession(currentUser.accountId);
      }
    }
    setIsRunning(false);
  };

  const handleReset = async () => {
    if (isRunning) {
      await handleStop();
    }
    setTime(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pdf_timer_state');
    }
  };

  // Handle file upload - Open directly from device
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsLoading(true);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Set PDF URL and title for display
        setPdfUrl(result);
        setPdfTitle(file.name.replace('.pdf', ''));
        setIsLoading(false);
        
        // Save PDF to localStorage for persistence
        if (typeof window !== 'undefined') {
          const pdfData = {
            url: result,
            title: file.name.replace('.pdf', ''),
            fileName: file.name
          };
          localStorage.setItem('pdf_study_file', JSON.stringify(pdfData));
        }
        
        // Clear input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read PDF file');
        setIsLoading(false);
      };
      
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${
      theme === 'light' ? 'bg-white' : 'bg-gray-900'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        theme === 'light' ? 'border-gray-200' : 'border-gray-700'
      }`}>
        <h2 className={`text-xl font-bold ${
          theme === 'light' ? 'text-gray-800' : 'text-gray-200'
        }`}>
          {t.rank === 'ترتيب' ? 'مؤقت دراسة PDF' : 'PDF Study Timer'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-800 text-gray-400'
            }`}
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {!pdfUrl ? (
          /* File Upload Section */
          <div className="w-full max-w-md">
            <h3 className={`text-lg font-semibold mb-6 text-center ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {t.rank === 'ترتيب' ? 'اختر ملف PDF للدراسة' : 'Select PDF File for Study'}
            </h3>

            {/* File Upload */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className={`block w-full p-6 text-center rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                  theme === 'light' 
                    ? 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700' 
                    : 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                }`}
              >
                {isLoading ? (
                  <span>{t.rank === 'ترتيب' ? 'جاري التحميل...' : 'Loading...'}</span>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">📄</div>
                    <span>{t.rank === 'ترتيب' ? 'اختر ملف PDF من جهازك' : 'Choose PDF File from Your Device'}</span>
                  </div>
                )}
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`p-3 rounded-lg text-center ${
                theme === 'light' ? 'bg-red-50 text-red-600' : 'bg-red-900/20 text-red-400'
              }`}>
                {error}
              </div>
            )}
          </div>
        ) : (
          /* PDF Viewer Section - Full Screen */
          <div className="w-full h-full relative">
            {/* Close PDF Button */}
            <button
              onClick={() => {
                setPdfUrl('');
                setPdfTitle('');
                setError('');
                // Clear saved PDF from localStorage
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('pdf_study_file');
                }
              }}
              className={`absolute top-4 right-4 z-10 p-2 rounded-lg shadow-lg border transition-colors ${
                theme === 'light' 
                  ? 'bg-white/95 border-gray-200 hover:bg-red-50 text-red-600' 
                  : 'bg-gray-800/95 border-gray-600 hover:bg-red-900/20 text-red-400'
              }`}
              title={t.rank === 'ترتيب' ? 'إغلاق واختر ملف آخر' : 'Close and choose another file'}
            >
              ✕
            </button>

            {/* PDF Display - Full Screen */}
            <div className="w-full h-full">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title={pdfTitle}
              />
            </div>

            {/* Floating Timer - Small Corner Widget */}
            <div className="absolute bottom-4 right-4 z-10">
              <div className={`p-2 rounded-lg shadow-lg border backdrop-blur-sm ${
                theme === 'light' 
                  ? 'bg-white/95 border-gray-200 shadow-xl' 
                  : 'bg-gray-800/95 border-gray-600 shadow-2xl'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {t.rank === 'ترتيب' ? 'مؤقت' : 'Timer'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className={`text-xs font-mono ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      {formatTime(time)}
                    </span>
                    <button
                      onClick={isRunning ? handleStop : handleStart}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 ${
                        theme === 'light'
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRunning ? '⏸' : '▶'}
                    </button>
                    <button
                      onClick={handleReset}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 ${
                        theme === 'light'
                          ? 'bg-gray-500 text-white hover:bg-gray-600'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      🔄
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* File Info - Top Bar */}
            <div className={`absolute top-4 left-4 z-10 px-3 py-2 rounded-lg shadow-lg border ${
              theme === 'light' 
                ? 'bg-white/90 border-gray-200 backdrop-blur-sm' 
                : 'bg-gray-800/90 border-gray-600 backdrop-blur-sm'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">📄</span>
                <div>
                  <h3 className={`text-sm font-semibold ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                  }`}>
                    {pdfTitle}
                  </h3>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {t.rank === 'ترتيب' ? 'يتم القراءة من جهازك' : 'Reading from your device'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPdfUrl('');
                  setPdfTitle('');
                  setError('');
                }}
                className={`ml-3 p-1 rounded transition-colors ${
                  theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700 text-gray-400'
                }`}
                title={t.rank === 'ترتيب' ? 'إغلاق واختر ملف آخر' : 'Close and choose another file'}
              >
                ✕
              </button>
            </div>

                      </div>
        )}
      </div>
    </div>
  );
}
