'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: string;
  fontSize: string;
  createdAt: string;
  position: { x: number; y: number };
}

export function StickyNotes() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load sticky notes from localStorage
  useEffect(() => {
    const loadNotes = () => {
      if (typeof window !== 'undefined') {
        const savedNotes = localStorage.getItem('stickyNotes');
        if (savedNotes) {
          try {
            const parsedNotes = JSON.parse(savedNotes);
            setNotes(parsedNotes);
          } catch (error) {
            console.error('Failed to load sticky notes:', error);
          }
        }
      }
    };

    loadNotes();
    
    // Listen for custom events when new notes are published
    const handleStickyNotePublished = (e: CustomEvent) => {
      console.log('🎉 New sticky note published:', e.detail);
      loadNotes(); // Reload notes to show the new one immediately
    };

    window.addEventListener('stickyNotePublished', handleStickyNotePublished as EventListener);
    
    return () => {
      window.removeEventListener('stickyNotePublished', handleStickyNotePublished as EventListener);
    };
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stickyNotes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setDraggedNote(noteId);
      setDragOffset({
        x: e.clientX - note.position.x,
        y: e.clientY - note.position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedNote) {
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === draggedNote 
            ? { ...note, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } }
            : note
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedNote(null);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  useEffect(() => {
    if (draggedNote) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNote, dragOffset]);

  if (notes.length === 0) return null;

  return (
    <>
      {notes.map((note) => (
        <div
          key={note.id}
          className="fixed z-30 p-4 rounded-lg shadow-lg cursor-move select-none transform transition-transform hover:scale-105"
          style={{
            left: `${note.position.x}px`,
            top: `${note.position.y}px`,
            width: '250px',
            minHeight: '200px',
            backgroundColor: note.color === '#ffffff' ? '#ffffff' : note.color,
            color: note.color === '#ffffff' ? '#111827' : '#ffffff',
            border: `1px solid ${note.color === '#ffffff' ? '#e5e7eb' : note.color}`,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
          onMouseDown={(e) => handleMouseDown(e, note.id)}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 
                className={`font-bold text-sm truncate ${note.fontSize === 'text-xl' ? 'text-sm' : note.fontSize === 'text-2xl' ? 'text-base' : note.fontSize === 'text-4xl' ? 'text-lg' : note.fontSize === 'text-6xl' ? 'text-xl' : 'text-2xl'}`}
                style={{ color: note.color === '#ffffff' ? '#111827' : '#ffffff' }}
              >
                {note.title}
              </h3>
              <div 
                className="text-xs opacity-70"
                style={{ color: note.color === '#ffffff' ? '#6b7280' : 'rgba(255,255,255,0.7)' }}
              >
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors"
              style={{ color: note.color === '#ffffff' ? '#ef4444' : '#ffffff' }}
              title={t.rank === 'ترتيب' ? 'حذف' : 'Delete'}
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div
            className={`${note.fontSize} leading-relaxed whitespace-pre-wrap break-words`}
            style={{ 
              color: note.color === '#ffffff' ? '#111827' : '#ffffff',
              minHeight: '100px'
            }}
          >
            {note.content}
          </div>
          
          {/* Footer */}
          <div 
            className="mt-2 pt-2 border-t text-xs opacity-70"
            style={{ 
              borderColor: note.color === '#ffffff' ? '#e5e7eb' : note.color,
              color: note.color === '#ffffff' ? '#6b7280' : 'rgba(255,255,255,0.7)'
            }}
          >
            {t.rank === 'ترتيب' ? 'اسحب للتحريك' : 'Drag to move'} • {t.rank === 'ترتيب' ? 'انقر على ✕ للحذف' : 'Click ✕ to delete'}
          </div>
        </div>
      ))}
    </>
  );
}
