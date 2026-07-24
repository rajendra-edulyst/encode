import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const CourseProceedHeader = ({ selected = 0, total = 2, timeLeft = "05:00" }) => {
  const progress = (selected / total) * 100;
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();

  const handleProceed = () => {
    if (agreed) {
      navigate("/proceed-course-registration");
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl">
      {/* Header Title + Description */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Upcoming Semester Selection
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Your course selection for semester has now opened. Last date of registration is <strong>24 July 2025</strong>.
        </p>
      </div>

        {/* Checkbox + Button */}
        <div className="flex items-center gap-4  w-full">
          {/* Checkbox */}
          <label className="flex items-center text-sm text-primary underline hover:cursor-pointer hover:no-underline">
            <input
              type="checkbox"
              className="mr-2 accent-orange-500"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            Please read all the terms and conditions before proceeding with your course registration.
          </label>

        
         
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-end mt-4 gap-4">
        <button
            onClick={handleProceed}
            disabled={!agreed}
            className={`px-5 py-2 text-sm font-medium rounded ${
              agreed
                ? 'bg-primary text-white hover:bg-primary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition duration-200`}
          >
            Proceed
          </button>
        </div>
      
    </div>
  );
};

export default CourseProceedHeader;
