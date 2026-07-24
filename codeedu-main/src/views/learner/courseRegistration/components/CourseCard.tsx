import React, { useState } from "react";
import { ContactRound, Clock4 } from 'lucide-react';

type Slot = {
  startDateTime: string;
  endDateTime: string;
  dayOfWeek: string;
};

type CourseCardProps = {
  title: string;
  credits: string;
  department: string;
  availableSeats: number;
  maximumSeats: number;
  slots: Slot[];
  keywords: string;
  description: string;
  onClick?: () => void;
  imageUrl: string;
};

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  credits,
  department,
  availableSeats,
  maximumSeats,
  slots,
  description,
  keywords,
  onClick,
  imageUrl,
}) => {
  const [showAllSlots, setShowAllSlots] = useState(false);

  const visibleSlots = showAllSlots ? slots : slots.slice(0, 1);
  const hiddenCount = slots.length - 1;

 
  const truncateHtml = (html: string, limit: number) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const textContent = div.textContent || div.innerText || "";
    return textContent.length > limit ? textContent.slice(0, limit) + "..." : textContent;
  };

  return (
    <div className="border rounded-xl shadow-md border-gray-400 overflow-hidden bg-white flex flex-col">
      {/* Top: Image */}
      <div className="w-full h-40 bg-gray-100 overflow-hidden">
        
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom: Content */}
      <div className="p-4 space-y-2">
        {/* Title & Credits */}
        <div className="flex justify-between items-center">
          <h3
            title={title}
            className="text-lg font-semibold text-gray-800 underline underline-offset-2 cursor-pointer hover:no-underline"
            onClick={onClick}
          >
            {title}
          </h3>
          <span className="bg-orange-100 text-orange-900 text-sm px-2 py-1 rounded-full">
          {credits ? `${credits} Credits` : "N/A"}
          </span>
        </div>

        {/* Seats & Slots */}
        <div className="flex flex-col items-start gap-2 text-sm">
          {/* Seats Info */}
          <div className="flex flex-col text-gray-600 gap-2">
            <p className="flex gap-1 items-center">
              <ContactRound className="w-4 h-4 text-primary" /> Total Seats:{" "}
              <strong className="text-primary">{availableSeats}/{maximumSeats}</strong>
            </p>
          </div>

          {/* Time Slots */}
          <div className="text-xs text-gray-700 items-start flex-1 flex w-full justify-between">
            <p className="text-sm min-w-[100px] text-gray-600 gap-1 flex items-center">
              <Clock4 className="w-4 h-4 text-primary" /> Time Slots:
            </p>

            {slots.length > 0 ? (
              <div className="flex flex-wrap justify-end gap-2">
                {visibleSlots.map((slot, idx) => (
                  <span
                    key={idx}
                    className="border border-primary px-2 py-1 rounded-full inline-block"
                  >
                    <span className="text-primary font-bold">+</span>{" "}
                    {slot.dayOfWeek} {slot.startDateTime} - {slot.endDateTime}
                  </span>
                ))}

                {/* Show +N more */}
                {!showAllSlots && hiddenCount > 0 && (
                  <button
                    onClick={() => setShowAllSlots(true)}
                    className="text-primary underline text-xs"
                  >
                    +{hiddenCount}
                  </button>
                )}

                {/* Hide extra */}
                {showAllSlots && hiddenCount > 0 && (
                  <button
                    onClick={() => setShowAllSlots(false)}
                    className="text-primary underline text-xs"
                  >
                    less
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-400 italic">No slot found</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div
  className="text-sm text-gray-700 leading-relaxed"
  dangerouslySetInnerHTML={{ __html: truncateHtml(description, 175) }}
/>
      </div>
    </div>
  );
};

export default CourseCard;
