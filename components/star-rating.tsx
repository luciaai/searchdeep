'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRating({ rating, setRating, disabled = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={`focus:outline-none ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => !disabled && setRating(star)}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star 
            size={24} 
            className={`transition-colors ${
              (hoverRating || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`} 
          />
        </button>
      ))}
    </div>
  );
}
