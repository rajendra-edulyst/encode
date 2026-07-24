import React, { useEffect, useState } from 'react';
import CustomButton from './ui/CustomButton';
import Switch from './ui/Switch';

interface PreferencesPopupProps {
  open: boolean;
  onClose: () => void;
  data: {
    show_personal_info: boolean;
    verification_status: 'not_applied' | 'pending' | 'verified' | 'rejected';
  };
  onRequestVerification: () => void;
  onSave: (payload: { show_personal_info: boolean }) => void;
}

const PreferencesPopup: React.FC<PreferencesPopupProps> = ({
  open,
  onClose,
  data,
  onRequestVerification,
  onSave,
}) => {
  const [showPersonalInfo, setShowPersonalInfo] = useState<boolean>(data?.show_personal_info);

  useEffect(() => {
    if (open) {
      setShowPersonalInfo(data?.show_personal_info);
    }
  }, [data, open]);

  const handleSave = () => {
    const payload = {
      show_personal_info: showPersonalInfo, // boolean
    };
    onSave(payload); // no FormData
    onClose();
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-card rounded-lg w-full max-w-md shadow-lg relative">
        {/* Header */}
        <div className="flex items-center border-b border-gray-200 shadow p-4 px-6 justify-between">
          <h2 className="text-xl font-semibold">Manage Preferences</h2>
          <button
            className="text-gray-400 hover:bg-gray-100 p-1 px-3 transition duration-150 rounded-full text-lg hover:text-gray-600"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Show Personal Info */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Show Personal Info (Email, Mobile)</span>
            <Switch
              checked={showPersonalInfo}
              onCheckedChange={setShowPersonalInfo}
            />
          </div>

          {/* Verification Status */}
          {/* <div className="flex justify-between items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Verification Status:</span>
            <span className="text-sm font-semibold capitalize">
              {data.verification_status.replace('_', ' ')}
            </span>
            {(data.verification_status === 'not_applied' || data.verification_status === 'rejected') && (
              <CustomButton onClick={onRequestVerification}>
                Apply for Verification
              </CustomButton>
            )}
          </div> */}

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <CustomButton onClick={handleSave}>
              Save Preferences
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPopup;
