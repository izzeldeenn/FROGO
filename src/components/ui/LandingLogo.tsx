'use client';

interface LandingLogoProps {
  theme: 'light' | 'dark';
}

export function LandingLogo({ theme }: LandingLogoProps) {
  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-3">
        <img 
          src="/goat.png" 
          alt="شعار Goatly - مجتمع مفتوح المصدر للدراسة الجماعية" 
          className="w-10 h-10 object-contain"
                  />
                  <div className="flex flex-col">
                    <div className="text-xl font-bold tracking-tight">
                      <span className={`inline-block font-black ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Goatly
                      </span>
                    </div>
                    <div className={`text-xs font-medium tracking-wide ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      great of all time
                    </div>
                  </div>
                </div>
              </div>
  );
}
