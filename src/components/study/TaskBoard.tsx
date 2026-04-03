'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

interface DaySheet {
  date: string;
  tasks: Task[];
  position: { x: number; y: number };
  id: string;
}

export function TaskBoard() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { getCurrentUser } = useUser();
  
  const [sheets, setSheets] = useState<DaySheet[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [boardTheme, setBoardTheme] = useState('default');

  useEffect(() => {
    loadSheets();
    const savedTheme = localStorage.getItem('taskBoardTheme');
    if (savedTheme) {
      setBoardTheme(savedTheme);
    }
  }, []);

  const loadSheets = () => {
    if (typeof window === 'undefined') return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const storageKey = `sheets_${currentUser.accountId}`;
    const allSheets = localStorage.getItem(storageKey);
    
    if (allSheets) {
      try {
        const parsedSheets: DaySheet[] = JSON.parse(allSheets);
        setSheets(parsedSheets);
      } catch (error) {
        console.error('Error loading sheets:', error);
        setSheets([]);
      }
    } else {
      setSheets([]);
    }
  };

  const saveSheets = (sheets: DaySheet[]) => {
    if (typeof window === 'undefined') return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const storageKey = `sheets_${currentUser.accountId}`;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filteredSheets = sheets.filter(sheet => new Date(sheet.date) >= thirtyDaysAgo);
    
    localStorage.setItem(storageKey, JSON.stringify(filteredSheets));
  };

  const changeBoardTheme = (theme: string) => {
    setBoardTheme(theme);
    localStorage.setItem('taskBoardTheme', theme);
  };

  const getBoardThemeClasses = () => {
    switch (boardTheme) {
      case 'wood':
        return 'bg-gradient-to-br from-amber-700 to-amber-900';
      case 'blackboard':
        return 'bg-gradient-to-br from-gray-800 to-gray-900';
      case 'paper':
        return 'bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'glass':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50';
      case 'nature':
        return 'bg-gradient-to-br from-green-100 to-emerald-200';
      default:
        return 'bg-gradient-to-br from-amber-50 to-orange-100';
    }
  };

  const getSheetThemeClasses = () => {
    switch (boardTheme) {
      case 'wood':
        return 'bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-800';
      case 'blackboard':
        return 'bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600 text-white';
      case 'paper':
        return 'bg-white border-2 border-gray-300 shadow-sm';
      case 'glass':
        return 'bg-white/80 backdrop-blur-sm border-2 border-blue-200';
      case 'nature':
        return 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300';
      default:
        return 'bg-white rounded-lg shadow-lg hover:shadow-xl';
    }
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const existingSheet = sheets.find(sheet => sheet.date === selectedDate);
    
    if (existingSheet) {
      const updatedSheets = sheets.map(sheet => {
        if (sheet.date === selectedDate) {
          return {
            ...sheet,
            tasks: [...sheet.tasks, newTask]
          };
        }
        return sheet;
      });
      setSheets(updatedSheets);
      saveSheets(updatedSheets);
    } else {
      const boardWidth = 600;
      const boardHeight = 400;
      
      const newSheet: DaySheet = {
        id: Date.now().toString(),
        date: selectedDate,
        tasks: [newTask],
        position: { 
          x: 50 + Math.random() * (boardWidth - 350),
          y: 50 + Math.random() * (boardHeight - 250)
        }
      };
      
      const updatedSheets = [...sheets, newSheet];
      setSheets(updatedSheets);
      saveSheets(updatedSheets);
    }
    
    setNewTaskText('');
    setShowAddForm(false);
  };

  const toggleTask = (sheetId: string, taskId: string) => {
    const updatedSheets = sheets.map(sheet => {
      if (sheet.id === sheetId) {
        return {
          ...sheet,
          tasks: sheet.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : undefined
              };
            }
            return task;
          })
        };
      }
      return sheet;
    });
    
    setSheets(updatedSheets);
    saveSheets(updatedSheets);
  };

  const deleteTask = (sheetId: string, taskId: string) => {
    const updatedSheets = sheets.map(sheet => {
      if (sheet.id === sheetId) {
        return {
          ...sheet,
          tasks: sheet.tasks.filter(task => task.id !== taskId)
        };
      }
      return sheet;
    }).filter(sheet => sheet.tasks.length > 0); // Remove empty sheets
    
    setSheets(updatedSheets);
    saveSheets(updatedSheets);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [draggedSheet, setDraggedSheet] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, sheet: DaySheet) => {
    const boardElement = e.currentTarget.closest('.task-board');
    if (!boardElement) return;
    
    const sheetElement = e.currentTarget.closest('.day-sheet');
    if (!sheetElement) return;
    
    const boardRect = boardElement.getBoundingClientRect();
    const sheetRect = sheetElement.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - sheetRect.left,
      y: e.clientY - sheetRect.top
    });
    
    setDraggedSheet(sheet.id);
    setIsDragging(true);
    
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedSheet) return;
    
    const boardElement = e.currentTarget.closest('.task-board');
    if (!boardElement) return;
    
    const boardRect = boardElement.getBoundingClientRect();
    
    const newX = e.clientX - boardRect.left - dragOffset.x;
    const newY = e.clientY - boardRect.top - dragOffset.y;
    
    // Keep sheet within bounds
    const boundedX = Math.max(0, Math.min(newX, boardRect.width - 300));
    const boundedY = Math.max(0, Math.min(newY, boardRect.height - 200));
    
    const updatedSheets = sheets.map(sheet => {
      if (sheet.id === draggedSheet) {
        return {
          ...sheet,
          position: { x: boundedX, y: boundedY }
        };
      }
      return sheet;
    });
    
    setSheets(updatedSheets);
  };

  const handleMouseUp = () => {
    if (isDragging && draggedSheet) {
      saveSheets(sheets);
    }
    setIsDragging(false);
    setDraggedSheet(null);
  };

  const stats = {
    totalSheets: sheets.length,
    totalTasks: sheets.reduce((sum, sheet) => sum + sheet.tasks.length, 0),
    completedTasks: sheets.reduce((sum, sheet) => sum + sheet.tasks.filter(task => task.completed).length, 0)
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className={`w-full h-[80vh] ${getBoardThemeClasses()} flex flex-col`}>
      {/* Tasks List */}
      <div 
        className="flex-1 overflow-hidden relative task-board"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {sheets.length === 0 ? (
          <div className={`text-center py-6 ${boardTheme === 'blackboard' ? 'text-white' : ''}`}>
            <div className="text-6xl mb-4">📝</div>
            <h3 className={`text-xl font-semibold mb-2 ${boardTheme === 'blackboard' ? 'text-gray-200' : 'text-gray-600'}`}>
              لا توجد مهام
            </h3>
            <p className={`mb-4 ${boardTheme === 'blackboard' ? 'text-gray-300' : 'text-gray-500'}`}>
              ابدأ بإضافة مهمة جديدة
            </p>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ➕ إضافة أول مهمة
              </button>
            )}
          </div>
        ) : (
          sheets.map((sheet) => (
            <div
              key={sheet.id}
              className={`day-sheet p-4 select-none transition-all ${
                isDragging && draggedSheet === sheet.id ? 'cursor-grabbing shadow-2xl scale-105 z-50' : 'hover:shadow-xl'
              } ${getSheetThemeClasses()}`}
              style={{
                position: 'absolute',
                left: `${sheet.position.x}px`,
                top: `${sheet.position.y}px`,
                cursor: 'grab',
                transition: isDragging && draggedSheet === sheet.id ? 'none' : 'all 0.2s ease',
                transform: isDragging && draggedSheet === sheet.id ? 'scale(1.02)' : 'scale(1)',
                width: '280px',
                minHeight: '150px'
              }}
              onMouseDown={(e) => handleMouseDown(e, sheet)}
            >
              {/* Sheet Header */}
              <div className={`pb-2 mb-3 ${boardTheme === 'blackboard' ? 'border-gray-600' : 'border-gray-200'} border-b`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${
                  boardTheme === 'blackboard' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  📅 {sheet.date === new Date().toISOString().split('T')[0] ? 'اليوم' : sheet.date}
                </h3>
                <div className={`text-xs ${boardTheme === 'blackboard' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {sheet.tasks.filter(t => t.completed).length}/{sheet.tasks.length} مهام مكتملة
                </div>
              </div>
              
              {/* Tasks List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sheet.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => toggleTask(sheet.id, task.id)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : boardTheme === 'blackboard' ? 'border-gray-500 hover:border-gray-400' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {task.completed && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`truncate ${
                        task.completed ? 'line-through' : ''
                      } ${boardTheme === 'blackboard' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {task.text}
                      </p>
                      {task.completed && task.completedAt && (
                        <p className={`text-xs ${boardTheme === 'blackboard' ? 'text-gray-400' : 'text-gray-400'}`}>
                          {new Date(task.completedAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteTask(sheet.id, task.id)}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة مهمة جديدة</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="اكتب المهمة هنا..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400"
                autoFocus
              />
              
              <div className="flex gap-2">
                <button
                  onClick={addTask}
                  disabled={!newTaskText.trim()}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  ✅ إضافة المهمة
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTaskText('');
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ❌ إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header - Fixed at Bottom */}
      <div className="bg-white shadow-lg border-t border-gray-200 flex-shrink-0">
        <div className="p-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-1">
                📋 {isToday ? 'مهام اليوم' : `مهام ${selectedDate}`}
              </h1>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-800"
              />
              {selectedDate !== new Date().toISOString().split('T')[0] && (
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  اليوم
                </button>
              )}
              
              {/* Theme Selector */}
              <select
                value={boardTheme}
                onChange={(e) => changeBoardTheme(e.target.value)}
                className="px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-800"
                title="تغيير شكل الصبورة"
              >
                <option value="default">🎨</option>
                <option value="wood">🪵</option>
                <option value="blackboard">⬛</option>
                <option value="paper">📄</option>
                <option value="glass">🔷</option>
                <option value="nature">🌿</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
            >
              ➕ إضافة مهمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
