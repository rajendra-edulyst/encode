import React, { useState, useRef } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import { Input } from '@/components/ui/ShadcnInput';
import { Button } from '@/components/ui/ShadcnButton';
import { UploadCloud, XIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner'; // optional: for notifications
import { fetchCreateContent } from '@/services/generative/GenerativeService';
import JoditEditor from 'jodit-react';
import type { IJodit } from 'jodit/esm/types/jodit';
import type { IUIButtonState } from "jodit/esm/types";

const skillsList = ['Web Development', 'AI/ML', 'Design', 'Cybersecurity', 'Data Science'];
const categories = ['Hackathon', 'Competition', 'Workshop', 'Seminar'];
const difficultyLevels = ['Easy', 'Medium', 'Hard'];

type FormData = {
  title: string;
  category: string;
  description: string;
  conductedBy: string;
  domain: string;
  skills: string[];
  difficulty: string;
  startDate: string ;
  endDate: string ;
  whatsInForYou: string;
  instructions: string;
  faq: string;
  thumbnail: File | null;
  thumbnailPreview: string;
};

const NewEvent: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Events', path: '/manage-events' },
    { label: 'New Event' },
  ];

  const editorInstance = useRef<IJodit | null>(null);
      const handleEditorRef = (editor: IJodit) => {
          editorInstance.current = editor;
      };

  const config = {
          readonly: false,
          height: 400,
          toolbarButtonSize: 'middle' as IUIButtonState['size'],
          buttons: [
              'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
              'font', 'fontsize', '|', 'align', 'outdent', 'indent', '|', 'ul', 'ol', '|',
              'fullsize', 'preview', '|', 'image', 'video', 'table', '|',
          ],
          spellcheck: true,
          iframe: true,
          allowResizeX: false,
          allowResizeY: true,
          showXPathInStatusbar: false,
          showCharsCounter: true,
          showWordsCounter: true,
          useSplitMode: false,
          // direction: 'ltr',
          cache: true,
          askBeforePasteHTML: false,
          askBeforePasteFromWord: false,
          askBeforePasteSVG: false,
          uploader: { insertImageAsBase64URI: true },
          extraButtons: [{
              name: 'ai-assistant',
              tooltip: 'AI Assistant',
              iconURL: `${window.location.origin}/img/logo/imageai.png`,
          }],
          aiAssistant: {
              enabled: true,
              command: 'ai-assistant',
              async aiAssistantCallback(prompt: string, htmlFragment: string) {
                  const refinedPrompt = `${prompt}, Create community content as HTML (not Markdown) optimized for Jodit editor, using semantic HTML tags without < style > or < body > tags.Apply Tailwind CSS classes for styling(e.g., text sizes, colors like text - gray - 700, text - blue - 600).Include bold URLs with <b> tags for emphasis where needed, and use <h1>, <h2>, <p>, and other tags as appropriate.If a table is relevant, include one with Tailwind classes, but avoid full-page card-like designs.Focus on clean, reusable content without inline CSS or complete page layouts.;`
                  return fetchCreateContent(refinedPrompt, htmlFragment).then(data => data.replace(/```html/g, "").replace(/```/g, ""));
              }
          }
      };

  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    description: '',
    conductedBy: '',
    domain: '',
    skills: [],
    difficulty: 'Easy',
    startDate: '',
    endDate: '',
    whatsInForYou: '',
    instructions: '',
    faq: '',
    thumbnail: null,
    thumbnailPreview: '',
  });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
    const validateForm = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: preview,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

    // Prepare your data for API submission, for example, using FormData if needed
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('category', formData.category);
    payload.append('description', formData.description);
    payload.append('conductedBy', formData.conductedBy);
    payload.append('domain', formData.domain);
    payload.append('skills', JSON.stringify(formData.skills));
    payload.append('difficulty', formData.difficulty);
    payload.append('startDate', formData.startDate?.toString() || '');
    payload.append('endDate', formData.endDate?.toString() || '');
    payload.append('whatsInForYou', formData.whatsInForYou);
    payload.append('instructions', formData.instructions);
    payload.append('faq', formData.faq);
    if (formData.thumbnail) {
      payload.append('thumbnail', formData.thumbnail);
    }

    // Replace with your API call
    // await createEvent(payload);
    toast.success('Event created successfully');
  };

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
       
       <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Create New Event</h1>
            <p className="text-xs sm:text-sm text-gray-500">Schedule a new Event</p>
        </div>


      <div className="mt-6 bg-white p-6 border rounded-md shadow-sm">

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit} >
          {/* Event Thumbnail */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Event Banner</label>
            <div className="relative group border-2 border-dashed border-muted rounded-lg p-6 text-center transition hover:border-primary hover:bg-accent/50">
              {formData.thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={formData.thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-background border border-input rounded-full p-1 shadow-sm hover:bg-destructive hover:text-white"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, thumbnail: null, thumbnailPreview: '' }))
                    }
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 right-2">
                    <label className="text-sm text-white bg-black/60 px-3 py-1 rounded cursor-pointer hover:bg-black/80 transition">
                      Change Image
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 cursor-pointer text-muted-foreground">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-sm">Click or drag an image here to upload</span>
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Event Basics */}
          <div>
            <label className="block mb-1 font-medium text-sm">Title <span className="text-red-500">*</span></label>
            <Input
              placeholder="Enter title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Category <span className="text-red-500">*</span></label>
            <Select onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          

          <div>
            <label className="block mb-1 font-medium text-sm">Conducted By</label>
            <Input
              placeholder="Name of organizer"
              value={formData.conductedBy}
              onChange={(e) => setFormData((prev) => ({ ...prev, conductedBy: e.target.value }))}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Domain</label>
            <Input
              placeholder="e.g., Web, AI"
              value={formData.domain}
              onChange={(e) => setFormData((prev) => ({ ...prev, domain: e.target.value }))}
            />
          </div>

          {/* Skills Selection */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-sm">Skills</label>
            <select
              className="w-full border border-input rounded-md px-3 py-2 text-sm"
              onChange={(e) => {
                const selectedSkill = e.target.value;
                if (selectedSkill && !formData.skills.includes(selectedSkill)) {
                  setFormData((prev) => ({ ...prev, skills: [...prev.skills, selectedSkill] }));
                }
                e.target.value = '';
              }}
            >
              <option value="">Select skill</option>
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-primary text-primary text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    className="ml-1 text-primary"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Date and Difficulty Section */}
          <div className="flex flex-col gap-6 md:col-span-2 md:flex-row">

            <div  className="flex-1">
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                        <Input
                            type="date"
                            id="start_date"
                            value={formData.startDate}
                            className={`w-full justify-between text-sm ${errors.startDate ? 'border-red-500' : ''}`}
                            aria-invalid={!!errors.startDate}
                            aria-describedby="start_date-error"
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                    {errors.startDate && (
                        <p id="start_date-error" className="text-red-500 text-xs mt-1">
                            {errors.startDate}
                        </p>
                    )}
                </div>

            
            <div className="flex-1">
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <Input
                  type="date"
                  id="end_date"
                  value={formData.endDate}
                  className={`w-full text-sm ${errors.endDate ? 'border-red-500' : ''}`}
                  aria-invalid={!!errors.endDate}
                  aria-describedby="end_date-error"
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              {errors.endDate && (
                <p id="end_date-error" className="text-red-500 text-xs mt-1">
                  {errors.endDate}
                </p>
              )}
            </div>

            <div className="flex-1">
                <label className="block mb-1 font-medium text-sm">Difficulty Level <span className="text-red-500">*</span></label>
                <Select
                    value={formData.difficulty || difficultyLevels[0]}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, difficulty: val }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        {difficultyLevels.map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                                {lvl}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-sm">Description</label>
            <JoditEditor className='max-h-10' editorRef={handleEditorRef} value={formData.description} config={config} tabIndex={1} />
          </div>

          {/* Additional Information */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-sm">Whats in it for you?</label>
            <JoditEditor editorRef={handleEditorRef} value={formData.whatsInForYou} config={config} tabIndex={1} />

          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-sm">Instructions</label>
            <JoditEditor editorRef={handleEditorRef} value={formData.instructions} config={config} tabIndex={1} />
           

          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-sm">FAQ</label>
            <JoditEditor editorRef={handleEditorRef} value={formData.faq} config={config} tabIndex={1} />
          </div>

          <div className="md:col-span-2 flex justify-end mt-8">
            <Button type="submit" className="px-6 py-2 text-white">
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEvent;
