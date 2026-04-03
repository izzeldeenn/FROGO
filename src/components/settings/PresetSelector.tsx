'use client';

import { useState } from 'react';
import { DEFAULT_PRESETS, UserPreset, applyPreset } from '@/constants/defaultPresets';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';

interface PresetSelectorProps {
  onPresetSelected?: (preset: UserPreset) => void;
  showApplyButton?: boolean;
  className?: string;
}

export function PresetSelector({ 
  onPresetSelected, 
  showApplyButton = true, 
  className = '' 
}: PresetSelectorProps) {
  const { theme } = useTheme();
  const customTheme = useCustomThemeClasses();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handlePresetSelect = (preset: UserPreset) => {
    setSelectedPreset(preset.id);
    onPresetSelected?.(preset);
  };

  const handleApplyPreset = async (preset: UserPreset) => {
    setIsApplying(true);
    try {
      applyPreset(preset);
      // Small delay to show feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error applying preset:', error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
              selectedPreset === preset.id
                ? 'border-blue-500 shadow-lg transform scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            style={{
              backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
              borderColor: selectedPreset === preset.id ? customTheme.colors.primary : undefined
            }}
            onClick={() => handlePresetSelect(preset)}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                  boxShadow: `0 4px 12px ${customTheme.colors.primary}30`
                }}
              >
                {preset.icon}
              </div>
              <div className="flex-1">
                <h3 
                  className="text-lg font-bold"
                  style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                >
                  {preset.name}
                </h3>
                <p 
                  className="text-sm opacity-75"
                  style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                >
                  {preset.description}
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium opacity-60" style={{ color: customTheme.colors.text }}>
                  الخلفية:
                </span>
                <div 
                  className="w-6 h-6 rounded-full border-2"
                  style={{ 
                    borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
                    background: preset.settings.background === 'default' 
                      ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%)'
                      : `linear-gradient(135deg, ${preset.settings.customTheme?.primary || customTheme.colors.primary}, ${preset.settings.customTheme?.accent || customTheme.colors.accent})`
                  }}
                />
                <span className="text-xs" style={{ color: customTheme.colors.text }}>
                  {preset.settings.background === 'default' ? 'افتراضي' : 'صورة'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium opacity-60" style={{ color: customTheme.colors.text }}>
                  الثيم:
                </span>
                <div 
                  className="w-6 h-6 rounded-full border-2"
                  style={{ 
                    borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
                    backgroundColor: preset.settings.theme === 'light' ? '#ffffff' : '#1f2937'
                  }}
                />
                <span className="text-xs" style={{ color: customTheme.colors.text }}>
                  {preset.settings.theme === 'light' ? 'فاتح' : 'داكن'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium opacity-60" style={{ color: customTheme.colors.text }}>
                  المؤقت:
                </span>
                <div 
                  className="w-6 h-6 rounded-full border-2"
                  style={{ 
                    borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
                    backgroundColor: preset.settings.timer.color
                  }}
                />
                <span className="text-xs" style={{ color: customTheme.colors.text }}>
                  {preset.settings.timer.size.replace('text-', '')}
                </span>
              </div>
            </div>

            {/* Apply Button */}
            {showApplyButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyPreset(preset);
                }}
                disabled={isApplying}
                className="w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 text-sm"
                style={{
                  background: selectedPreset === preset.id 
                    ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                    : `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                  color: selectedPreset === preset.id ? '#ffffff' : customTheme.colors.text,
                  border: `1px solid ${customTheme.colors.border}`,
                  opacity: isApplying ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (selectedPreset !== preset.id) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${customTheme.colors.primary}20, ${customTheme.colors.accent}20)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPreset !== preset.id) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`;
                  }
                }}
              >
                {isApplying && selectedPreset === preset.id ? 'جاري التطبيق...' : 'تطبيق'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
