// MentionDropdown.tsx
import React from "react";

interface MentionItem {
  name: string;
}

interface MentionDropdownProps {
  items: MentionItem[];
  position: { top: number; left: number };
  onSelect: (item: MentionItem) => void;
}

const MentionDropdown: React.FC<MentionDropdownProps> = ({ items, position, onSelect }) => {
  return (
    <div
      className="absolute z-50 bg-white border rounded shadow w-48"
      style={{ top: position.top, left: position.left }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onSelect(item)}
          className="p-2 hover:bg-gray-100 cursor-pointer"
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default MentionDropdown;
