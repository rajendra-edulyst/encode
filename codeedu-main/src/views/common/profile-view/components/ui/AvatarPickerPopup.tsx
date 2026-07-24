import { useEffect, useState } from "react";
import axios from "axios";

type AvatarPickerPopupProps = {
  isOpen: boolean;
  onSelect: (imageBlob: Blob) => void;
  onClose: () => void;
};

const AvatarPickerPopup: React.FC<AvatarPickerPopupProps> = ({ isOpen, onSelect, onClose }) => {
  const [avatars, setAvatars] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    axios.get('http://localhost:3000/api/avatars')
      .then(res => {
        if (res.data.status === 1 && res.data.data) {
          setAvatars(Object.values(res.data.data));
        }
      })
      .catch(console.error);
  }, [isOpen]);

  const handleSelect = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      onSelect(blob); // Return the blob to parent
      onClose(); // Optional close
    } catch (error) {
      console.error('Failed to fetch image binary', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Choose an Avatar</h2>
        <div className="grid grid-cols-4 gap-4">
          {avatars.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Avatar ${index + 1}`}
              className="w-16 h-16 rounded-full object-cover cursor-pointer border hover:border-blue-500"
              onClick={() => handleSelect(url)}
            />
          ))}
        </div>
        <button
          className="mt-6 text-sm text-gray-600 underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AvatarPickerPopup;
