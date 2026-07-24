import { Button } from "@/components/ui";
import React from "react";

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: "month" | "week" | "day") => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ label, onNavigate, onView }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 my-4 w-full px-2">
      {/* Navigation Buttons */}
      <div className="flex justify-center md:justify-start">
        <Button
          variant="solid"
          className="text-white rounded-none rounded-l-md"
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </Button>
        <Button
          variant="solid"
          className="text-white rounded-none border-x border-ac-dark"
          onClick={() => onNavigate("PREV")}
        >
          Prev
        </Button>
        <Button
          variant="solid"
          className="text-white rounded-none rounded-r-md"
          onClick={() => onNavigate("NEXT")}
        >
          Next
        </Button>
      </div>

      {/* Label */}
      <div className="text-center md:text-left">
        <h3 className="text-primary text-lg font-semibold">{label}</h3>
      </div>

      {/* View Switch Buttons */}
      <div className="flex justify-center md:justify-end">
        <Button
          variant="solid"
          className="text-white rounded-none rounded-l-md"
          onClick={() => onView("month")}
        >
          Month
        </Button>
        <Button
          variant="solid"
          className="text-white rounded-none border-x border-ac-dark"
          onClick={() => onView("week")}
        >
          Week
        </Button>
        <Button
          variant="solid"
          className="text-white rounded-none rounded-r-md"
          onClick={() => onView("day")}
        >
          Day
        </Button>
      </div>
    </div>
  );
};

export default CustomToolbar;
