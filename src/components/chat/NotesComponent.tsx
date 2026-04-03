'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Slide {
  id: string;
  title: string;
  content: string;
  color: string;
  fontSize: string;
  createdAt: string;
  isPublished?: boolean;
  position?: { x: number; y: number };
}

interface StickyNote extends Slide {
  position: { x: number; y: number };
}

interface NotesComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotesComponent({ isOpen, onClose }: NotesComponentProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSlideList, setShowSlideList] = useState(false);

  // Load slides from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSlides = localStorage.getItem('userSlides');
      if (savedSlides) {
        try {
          const parsedSlides = JSON.parse(savedSlides);
          setSlides(parsedSlides);
          if (parsedSlides.length > 0 && !currentSlideId) {
            setCurrentSlideId(parsedSlides[0].id);
          }
        } catch (error) {
          console.error('Failed to load slides:', error);
        }
      }
      const savedPosition = localStorage.getItem('slidesPosition');
      if (savedPosition) {
        try {
          const pos = JSON.parse(savedPosition);
          setPosition(pos);
        } catch (error) {
          console.error('Failed to load slides position:', error);
        }
      }
    }
  }, []);

  // Save slides to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userSlides', JSON.stringify(slides));
    }
  }, [slides]);

  // Save position to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('slidesPosition', JSON.stringify(position));
    }
  }, [position]);

  // Drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const createNewSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: t.rank === 'ترتيب' ? 'شريحة جديدة' : 'New Slide',
      content: '',
      color: '#ffffff',
      fontSize: 'text-2xl',
      createdAt: new Date().toISOString()
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideId(newSlide.id);
    setShowSlideList(false);
  };

  const updateSlide = (id: string, updates: Partial<Slide>) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, ...updates } : slide
    ));
  };

  const deleteSlide = (id: string) => {
    const newSlides = slides.filter(slide => slide.id !== id);
    setSlides(newSlides);
    if (currentSlideId === id && newSlides.length > 0) {
      setCurrentSlideId(newSlides[0].id);
    } else if (newSlides.length === 0) {
      setCurrentSlideId(null);
    }
  };

  const publishSlide = (id: string) => {
    const slide = slides.find(s => s.id === id);
    if (slide && slide.content.trim()) {
      const stickyNote: StickyNote = {
        ...slide,
        isPublished: true,
        position: { 
          x: Math.random() * (window.innerWidth - 300), 
          y: Math.random() * (window.innerHeight - 200) 
        }
      };
      
      // Check if this slide is already published
      const existingNotes = JSON.parse(localStorage.getItem('stickyNotes') || '[]');
      const existingNoteIndex = existingNotes.findIndex((note: StickyNote) => note.id === id);
      
      if (existingNoteIndex >= 0) {
        // Update existing note
        existingNotes[existingNoteIndex] = stickyNote;
      } else {
        // Add new note
        existingNotes.push(stickyNote);
      }
      
      localStorage.setItem('stickyNotes', JSON.stringify(existingNotes));
      
      // Mark as published in current slides
      updateSlide(id, { isPublished: true });
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('stickyNotePublished', { 
        detail: { stickyNote } 
      }));
    }
  };

  const currentSlide = slides.find(slide => slide.id === currentSlideId);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '450px',
          maxHeight: '600px',
          backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
          borderColor: theme === 'light' ? '#e5e7eb' : '#374151'
        }}
      >
        {/* Header */}
        <div 
          className="flex justify-between items-center p-4 border-b cursor-move"
          style={{ borderColor: theme === 'light' ? '#e5e7eb' : '#374151' }}
          onMouseDown={handleMouseDown}
        >
          <h3 className="font-semibold flex items-center gap-2" style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}>
            <span>📝</span>
            {t.rank === 'ترتيب' ? 'البطاقات' : 'Sticky Notes'} ({slides.length})
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSlideList(!showSlideList)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
              title={t.rank === 'ترتيب' ? 'قائمة البطاقات' : 'Notes List'}
            >
              📋
            </button>
            <button
              onClick={createNewSlide}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
              title={t.rank === 'ترتيب' ? 'بطاقة جديدة' : 'New Note'}
            >
              ➕
            </button>
            <button
              onClick={() => currentSlide && publishSlide(currentSlide.id)}
              disabled={!currentSlide || !currentSlide.content.trim()}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
              title={currentSlide?.isPublished ? (t.rank === 'ترتيب' ? 'تحديث البطاقة' : 'Update Note') : (t.rank === 'ترتيب' ? 'نشر البطاقة' : 'Publish Note')}
            >
              📤
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
              title={t.rank === 'ترتيب' ? 'إغلاق' : 'Close'}
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {currentSlide ? (
            <>
              {/* Slide Title */}
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => currentSlideId && updateSlide(currentSlideId, { title: e.target.value })}
                placeholder={t.rank === 'ترتيب' ? 'عنوان البطاقة...' : 'Note title...'}
                className="w-full p-2 mb-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                style={{
                  backgroundColor: theme === 'light' ? '#f9fafb' : '#1f2937',
                  borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
                  color: theme === 'light' ? '#111827' : '#f9fafb'
                }}
              />
              
              {/* Customization */}
              <div className="flex gap-2 mb-3">
                {/* Color Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
                    {t.rank === 'ترتيب' ? 'اللون:' : 'Color:'}
                  </span>
                  <div className="flex gap-1">
                    {['#ffffff', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'].map(color => (
                      <button
                        key={color}
                        onClick={() => currentSlideId && updateSlide(currentSlideId, { color })}
                        className={`w-6 h-6 rounded border-2 ${
                          currentSlide.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Font Size */}
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
                    {t.rank === 'ترتيب' ? 'الحجم:' : 'Size:'}
                  </span>
                  <select
                    value={currentSlide.fontSize}
                    onChange={(e) => currentSlideId && updateSlide(currentSlideId, { fontSize: e.target.value })}
                    className="text-xs p-1 rounded border"
                    style={{
                      backgroundColor: theme === 'light' ? '#f9fafb' : '#1f2937',
                      borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
                      color: theme === 'light' ? '#111827' : '#f9fafb'
                    }}
                  >
                    <option value="text-xl">صغير</option>
                    <option value="text-2xl">متوسط</option>
                    <option value="text-4xl">كبير</option>
                    <option value="text-6xl">كبير جداً</option>
                  </select>
                </div>
              </div>
              
              {/* Slide Content */}
              <textarea
                value={currentSlide.content}
                onChange={(e) => currentSlideId && updateSlide(currentSlideId, { content: e.target.value })}
                placeholder={t.rank === 'ترتيب' ? 'محتوى البطاقة...' : 'Note content...'}
                className="w-full h-48 p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                style={{
                  backgroundColor: theme === 'light' ? '#f9fafb' : '#1f2937',
                  borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
                  color: theme === 'light' ? '#111827' : '#f9fafb'
                }}
              />
              
              {/* Character count */}
              <div className="flex justify-between items-center mt-2 text-xs" style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
                <span>{currentSlide.content.length} {t.rank === 'ترتيب' ? 'حرف' : 'characters'}</span>
                <span>{t.rank === 'ترتيب' ? 'يحفظ تلقائياً' : 'Auto-saved'}</span>
              </div>
              
              {/* Publish Status */}
              {currentSlide.isPublished && (
                <div className="mt-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-2 text-xs" style={{ color: theme === 'light' ? '#1e40af' : '#60a5fa' }}>
                    <span>📤</span>
                    <span>{t.rank === 'ترتيب' ? 'تم النشر - اضغط 📤 للتحديث' : 'Published - Click 📤 to update'}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8" style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
              <div className="text-4xl mb-4">📝</div>
              <p>{t.rank === 'ترتيب' ? 'لا توجد بطاقات. أنشئ بطاقة جديدة!' : 'No notes. Create a new note!'}</p>
              <button
                onClick={createNewSlide}
                className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                {t.rank === 'ترتيب' ? 'إنشاء بطاقة جديدة' : 'Create New Note'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide List Sidebar */}
      {showSlideList && (
        <div 
          className="fixed z-40 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{
            left: `${position.x + 460}px`,
            top: `${position.y}px`,
            width: '250px',
            maxHeight: '400px',
            backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
            borderColor: theme === 'light' ? '#e5e7eb' : '#374151'
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: theme === 'light' ? '#e5e7eb' : '#374151' }}>
            <h4 className="font-semibold" style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}>
              {t.rank === 'ترتيب' ? 'البطاقات' : 'Notes'} ({slides.length})
            </h4>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-3 border-b cursor-pointer transition-colors ${
                  currentSlideId === slide.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={{ borderColor: theme === 'light' ? '#e5e7eb' : '#374151' }}
                onClick={() => setCurrentSlideId(slide.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}>
                      {index + 1}. {slide.title}
                    </div>
                    <div className="text-xs mt-1 truncate" style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
                      {slide.content.substring(0, 50)}...
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(slide.id);
                    }}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors ml-2"
                    title={t.rank === 'ترتيب' ? 'حذف' : 'Delete'}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
