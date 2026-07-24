import React, { useState, useRef } from 'react';
import { FaqItem as FaqItemType } from '../data/faqs';
import { Button } from '@/components/ui/ShadcnButton'; // Adjust path as needed

interface Props {
  item: FaqItemType;
}

const FaqItem: React.FC<Props> = ({ item }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [popupImage, setPopupImage] = useState<string | null>(null);

  return (
    <div className="bg-[#1A1A1A] p-4 mb-4 rounded-md transition-shadow hover:shadow-sm">

      {/* Question */}
      <button
        className="w-full text-left font-medium text-lg flex justify-between items-center text-white"
        onClick={() => setOpen(!open)}
      >
        <span className="pr-4">{item.question}</span>
        <span className="text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        style={{ maxHeight: open ? contentRef.current?.scrollHeight : 0 }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="mt-4 space-y-4 text-gray-600">
          {/* Answer */}
          <p>{item.answer}</p>

          {/* Images */}
          {item.images && item.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {item.images.map((src, idx) => (
                <img
                  key={idx}
                  src={`/${src}`}
                  alt={`FAQ image ${idx + 1}`}
                  className="cursor-zoom-in w-full sm:w-64 rounded-md border hover:opacity-80 transition"
                  onClick={() => setPopupImage(`/${src}`)}
                />
              ))}
            </div>
          )}

          {/* Buttons / Actions */}
          {item.actions && item.actions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.actions.map((action, idx) => (
                <a
                  key={idx}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">{action.label}</Button>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {popupImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setPopupImage(null)}
        >
          <div className="relative">
            <img
              src={popupImage}
              alt="Full view"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={() => setPopupImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
