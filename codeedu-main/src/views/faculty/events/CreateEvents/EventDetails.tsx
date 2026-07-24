import { FormData } from "./index";
import { Button } from "@/components/ui/ShadcnButton";
import { fetchCreateContent } from '@/services/generative/GenerativeService';
import JoditEditor from 'jodit-react';
import type { IJodit } from 'jodit/esm/types/jodit';
import { useRef } from "react";

export interface EventDetailsProps {
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleEditorChange: (value: string) => void;
  handleNext: () => void;
}

const EventDetails = ({ formData, handleChange, handleEditorChange, handleNext }: EventDetailsProps) => {
  const editorRef = useRef<IJodit | null>(null);

  const config = {
    readonly: false,
    height: 200,
    buttons: [
      'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', '|',
      'font', 'fontsize', '|', 'align', '|', 'ul', 'ol', '|', 'image', 'video', '|', 'preview'
    ],
    uploader: { insertImageAsBase64URI: true },
    spellcheck: true,
    aiAssistant: {
      enabled: true,
      command: 'ai-assistant',
      async aiAssistantCallback(prompt: string, htmlFragment: string) {
        const refinedPrompt = `${prompt}, generate clean event description in HTML using Tailwind CSS classes`;
        return fetchCreateContent(refinedPrompt, htmlFragment).then(data =>
          data.replace(/```html/g, "").replace(/```/g, "")
        );
      }
    }
  };

  return (
    <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {/* Event Name */}
      <div>
        <label className="block font-medium mb-1">Event Name *</label>
        <input
          required
          type="text"
          name="eventName"
          placeholder="Eg - Pottery Workshop"
          value={formData.eventName}
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={handleChange}
        />
      </div>

      {/* Event Description */}
      <div>
        <label className="block font-medium mb-1">Event Description</label>
        <JoditEditor
          value={formData.eventDescription}
          config={config}
          editorRef={(ref) => (editorRef.current = ref)}
          tabIndex={1}
          onBlur={handleEditorChange}
        />
      </div>

      {/* Event Mode */}
      <div>
        <label className="block font-medium mb-1">Event Mode</label>
        <select
          name="eventMode"
          value={formData.eventMode}
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      {/* Location Field */}
      {formData.eventMode === "Offline" && (
        <div>
          <label className="block font-medium mb-1">Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={handleChange}
          />
        </div>
      )}
      {formData.eventMode === "Online" && (
        <div>
          <label className="block font-medium mb-1">Online Link</label>
          <input
            type="text"
            name="onlineLink"
            value={formData.onlineLink}
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={handleChange}
          />
        </div>
      )}

      {/* Event Type */}
      <div>
        <label className="block font-medium mb-1">Event Type</label>
        <select
          name="eventType"
          value={formData.eventType}
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Webinar">Webinar</option>
          <option value="Masterclass">Masterclass</option>
          <option value="Workshop">Workshop</option>
          <option value="Visit">Visit</option>
          <option value="Internship">Internship & Placement Drive</option>
          <option value="Design Event">Design Event</option>
          <option value="Others">Others</option>
        </select>
        {formData.eventType === "Others" && (
          <input
            type="text"
            name="eventTypeOther"
            value={formData.eventTypeOther}
            placeholder="Describe the event type"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
            onChange={handleChange}
          />
        )}
      </div>

      {/* Event Category */}
      <div>
        <label className="block font-medium mb-1">Event Category</label>
        <select
          name="eventCategory"
          value={formData.eventCategory}
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Free">Free</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={handleChange}
          />
        </div>
        <div className="w-1/2">
          <label className="block font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Pre-registration */}
      <div>
        <label className="block font-medium mb-1">Pre-registration Required?</label>
        <select
          name="preRegistrationRequired"
          value={formData.preRegistrationRequired}
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={handleChange}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      {formData.preRegistrationRequired === "Yes" && (
        <>
          <div>
            <label className="block font-medium mb-1">Last Registration Date</label>
            <input
              type="date"
              name="lastRegistrationDate"
              value={formData.lastRegistrationDate}
              className="w-full border border-gray-300 rounded px-3 py-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Registration Form Link</label>
            <input
              type="url"
              name="registrationFormLink"
              value={formData.registrationFormLink}
              placeholder="Google Form / MS Form Link"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </>
      )}

      {/* Media Upload */}
      <div>
        <label className="block font-medium mb-1">Upload Media (Poster, PDF, Video)</label>
        <input
          type="file"
          name="eventMedia"
          accept=".jpg,.jpeg,.png,.pdf,.mp4"
          className="w-full"
          onChange={handleChange}
        />
      </div>

      {/* Additional Info */}
      <div>
        <label className="block font-medium mb-1">Additional Information</label>
        <JoditEditor
          value={formData.additionalInfo}
          config={config}
          editorRef={(ref) => (editorRef.current = ref)}
          tabIndex={1}
          onBlur={handleEditorChange}
        />
      </div>

      {/* Publish Logic */}
      <div className="text-sm text-gray-500">
        <p>This event will be published after admin approval.</p>
      </div>

      <Button type="button" onClick={handleNext}>
        Save
      </Button>

    </form>
  );
};

export default EventDetails;
