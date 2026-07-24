import React from "react";
import {
  ContactRound,
  Clock4,
  BookOpen,
  Network,
  Plus,
  Check,
  AlertTriangle,
} from "lucide-react";

type Slot = {
  startDateTime: string;
  endDateTime: string;
  dayOfWeek: string;
};

export interface CourseCardProps {
  title: string;
  credits: string;
  department: string;
  prerequisite: string;
  availableSeats: number;
  maximumSeats: number;
  slots: Slot[];
  description: string;
  imageUrl: string;
  selected: boolean;
  selectedSlotIndex?: number | null;
  onClickSlot: (slotIndex: number) => void;
  disabled?: boolean;
  disableMessage?: string[];
}

const ProceedCourseCard: React.FC<CourseCardProps> = ({
  title,
  credits,
  department,
  availableSeats,
  maximumSeats,
  slots,
  description,
  prerequisite,
  selected,
  selectedSlotIndex,
  onClickSlot,
  disabled = false,
  disableMessage = [],
}) => {
  const handleSlotClick = (index: number) => {
    if (disabled) return;
    onClickSlot(index);
  };

  return (
    <div
      className={`rounded-xl overflow-hidden flex flex-col ${
        disabled && disableMessage?.length > 0
          ? "border border-red-500 bg-red-50"
          : "border border-gray-400 bg-white"
      } ${disabled ? "cursor-not-allowed" : ""}`}
    >
      <div
        className={`p-4 rounded-xl transition ${
          selected ? "border-gray-400 rounded-xl bg-orange-50" : "border-gray-400"
        }`}
      >
        {/* Title & Credits */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800 underline-offset-2">
            {title}
          </h3>
          <span className="bg-orange-100 text-orange-900 text-sm px-2 py-1 rounded-full">
            {credits || "N/A"} Credits
          </span>
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-3 text-sm text-gray-700">
          {/* Seats */}
          <div className="flex items-center gap-2">
            <ContactRound className="w-4 h-4 text-primary" />
            Available Seats:{" "}
            <strong className="text-primary">
              {availableSeats}/{maximumSeats}
            </strong>
          </div>

          {/* Department */}
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            Department: {department}
          </div>

          {/* Prerequisite */}
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-primary shrink-0 mt-[2px]" />
            <div className="flex">
              <span>Prerequisite:</span>
              <span className="text-gray-600 ml-1">{prerequisite || "N/A"}</span>
            </div>
          </div>

          {/* Slots */}
          <div className="flex gap-1">
            <div className="flex items-center gap-2">
              <Clock4 className="w-4 h-4 text-primary" />
              <span>Time Slots:</span>
            </div>
            {slots.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-end flex-1">
                {slots.map((slot, idx) => {
                  const isSlotSelected = selectedSlotIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSlotClick(idx)}
                      disabled={disabled}
                      className={`flex items-center gap-1 border px-2 py-1 rounded-full text-sm transition ${
                        isSlotSelected
                          ? "bg-primary text-white border-primary"
                          : "text-primary border-primary"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSlotSelected ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {slot.dayOfWeek} {slot.startDateTime} - {slot.endDateTime}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span className="italic text-gray-400">No slot found</span>
            )}
          </div>

          {/* Disable Messages */}
          {disabled && disableMessage?.length > 0 && (
            <div className="mt-3 text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
              <div className="flex items-center gap-2 mb-1 font-medium">
                <AlertTriangle className="w-4 h-4" />
                <span>Unavailable:</span>
              </div>
              <ul className="list-disc ml-6">
                {disableMessage.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProceedCourseCard;
