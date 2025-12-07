'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface RotatingBadgeProps {
  items: string[];
  interval?: number; // en milisegundos, default 3000
}

export function RotatingBadge({ items, interval = 3000 }: RotatingBadgeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (items.length === 0) return;

    const timer = setInterval(() => {
      setIsVisible(false);

      const timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsVisible(true);
      }, 300); // Tiempo de la animación de salida

      return () => clearTimeout(timeoutId);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className='min-w-60'>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOutScale {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.8);
          }
        }

        .rotating-badge-enter {
          animation: fadeInScale 0.3s ease-out forwards;
        }

        .rotating-badge-exit {
          animation: fadeOutScale 0.3s ease-in forwards;
        }
      `}</style>
      <span
        className={`text-xs  min-w-max bg-transparent!] ${
          isVisible ? 'rotating-badge-enter' : 'rotating-badge-exit'
        }`}
      >
        {items[currentIndex]}
      </span>
    </div>
  );
}
