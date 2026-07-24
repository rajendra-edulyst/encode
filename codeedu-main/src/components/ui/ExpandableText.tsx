import React, { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  lines?: number;
  className?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, lines = 2, className = '' }) => {
  const [expanded, setExpanded] = useState(false);

  const style: React.CSSProperties = expanded
    ? {}
    : {
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      };

  return (
    <div>
      <div style={style} className={className}>{text}</div>
      {text && (
        <button
          type="button"
          className="text-gray-500 hover:underline text-xs mt-1"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;