'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface PublishedSlide {
  id: string;
  title: string;
  content: string;
  color: string;
  fontSize: string;
  createdAt: string;
  position: { x: number; y: number };
}

export function PublishedSlides() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [slides, setSlides] = useState<PublishedSlide[]>([]);
  const [draggedSlide, setDraggedSlide] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load published slides from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSlides = localStorage.getItem('publishedSlides');
      if (savedSlides) {
        try {
          const parsedSlides = JSON.parse(savedSlides);
          setSlides(parsedSlides);
        } catch (error) {
          console.error('Failed to load published slides:', error);
        }
      }
    }
  }, []);

  // Save slides to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('publishedSlides', JSON.stringify(slides));
    }
  }, [slides]);

  const handleMouseDown = (e: React.MouseEvent, slideId: string) => {
    const slide = slides.find(s => s.id === slideId);
    if (slide) {
      setDraggedSlide(slideId);
      setDragOffset({
        x: e.clientX - slide.position.x,
        y: e.clientY - slide.position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedSlide) {
      setSlides(prevSlides => 
        prevSlides.map(slide => 
          slide.id === draggedSlide 
            ? { ...slide, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } }
            : slide
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedSlide(null);
  };

  const deleteSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  useEffect(() => {
    if (draggedSlide) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedSlide, dragOffset]);

  if (slides.length === 0) return null;

  return (
    <>
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="fixed z-30 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 cursor-move select-none"
          style={{
            left: `${slide.position.x}px`,
            top: `${slide.position.y}px`,
            minWidth: '300px',
            maxWidth: '500px',
            backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
            borderColor: theme === 'light' ? '#e5e7eb' : '#374151'
          }}
          onMouseDown={(e) => handleMouseDown(e, slide.id)}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-sm truncate"
                style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
              >
                {slide.title}
              </h3>
              <div 
                className="text-xs opacity-70"
                style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
              >
                {new Date(slide.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSlide(slide.id);
              }}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              style={{ color: theme === 'light' ? '#ef4444' : '#f87171' }}
              title={t.rank === 'ترتيب' ? 'حذف' : 'Delete'}
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div
            className={`${slide.fontSize} leading-relaxed whitespace-pre-wrap`}
            style={{ color: slide.color }}
          >
            {slide.content}
          </div>
          
          {/* Footer */}
          <div 
            className="mt-3 pt-2 border-t text-xs"
            style={{ borderColor: theme === 'light' ? '#e5e7eb' : '#374151', color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
          >
            {t.rank === 'ترتيب' ? 'اسحب للتحريك' : 'Drag to move'} • {t.rank === 'ترتيب' ? 'انقر على ✕ للحذف' : 'Click ✕ to delete'}
          </div>
        </div>
      ))}
    </>
  );
}
