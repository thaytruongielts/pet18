import React from 'react';
import { Check, X } from 'lucide-react';

interface FillBlankItemProps {
  id: number;
  value: string;
  onChange: (id: number, val: string) => void;
  isGraded: boolean;
  isCorrect?: boolean;
}

const FillBlankItem: React.FC<FillBlankItemProps> = ({ id, value, onChange, isGraded, isCorrect }) => {
  return (
    <span className="inline-flex flex-col align-middle mx-1 relative">
      <span className="flex items-center">
        <span className="text-xs font-bold text-gray-500 mr-1 select-none">({id})</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          disabled={isGraded}
          className={`
            border-b-2 bg-transparent px-1 py-0.5 outline-none transition-colors w-32 sm:w-40 text-center font-medium
            ${isGraded 
              ? isCorrect 
                ? 'border-green-500 text-green-700 bg-green-50' 
                : 'border-red-500 text-red-700 bg-red-50'
              : 'border-gray-300 focus:border-indigo-500 text-gray-800 focus:bg-indigo-50'
            }
          `}
          autoComplete="off"
        />
        {isGraded && (
          <span className="ml-1 absolute -right-5 top-1">
            {isCorrect ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-red-600" />
            )}
          </span>
        )}
      </span>
    </span>
  );
};

export default FillBlankItem;