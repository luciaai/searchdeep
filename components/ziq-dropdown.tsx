'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ZIQ_DETAILS = [
  {
    letter: 'Z',
    word: 'Zenith',
    description: 'The highest point. ZIQ aims for excellence, delivering the most refined and relevant results.',
    textClass: 'text-primary',
    borderClass: 'border-primary/20',
    bgClass: 'bg-primary/5 dark:bg-primary/10',
  },
  {
    letter: 'I',
    word: 'Intellect',
    description: 'Built on artificial intelligence, ZIQ learns, adapts, and delivers smart results with context and precision.',
    textClass: 'text-accent',
    borderClass: 'border-accent/20',
    bgClass: 'bg-accent/5 dark:bg-accent/10',
  },
  {
    letter: 'Q',
    word: 'Quest',
    description: 'Every search is a journey for truth. ZIQ helps users dive deep—cutting through noise to uncover quality answers.',
    textClass: 'text-blue-500',
    borderClass: 'border-blue-500/20',
    bgClass: 'bg-blue-500/5 dark:bg-blue-500/10',
  },
];

export default function ZiqDropdown() {
  const initialOpen = ZIQ_DETAILS.reduce((acc, { letter }) => ({ ...acc, [letter]: false }), {} as Record<string, boolean>);
  const [open, setOpen] = useState(initialOpen);

  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mx-auto">
      {ZIQ_DETAILS.map(({ letter, word, description, textClass, borderClass, bgClass }) => (
        <div key={letter}>
          <button
            type="button"
            className={`w-full flex justify-between items-center p-3 rounded-lg border ${borderClass} ${bgClass}`}
            onClick={() => setOpen(prev => ({ ...prev, [letter]: !prev[letter] }))}
            aria-expanded={open[letter]}
            aria-controls={`panel-${letter}`}
          >
            <span className={`font-bold ${textClass}`}>{`${letter} – ${word}`}</span>
            {open[letter] ? <ChevronUp className={`w-4 h-4 ${textClass}`} /> : <ChevronDown className={`w-4 h-4 ${textClass}`} />}
          </button>
          {open[letter] && (
            <p
              id={`panel-${letter}`}
              className="mt-2 px-3 text-xs text-gray-700 dark:text-gray-300"
            >
              {description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}