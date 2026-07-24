import React, { useState, useEffect } from "react";
import type { Section } from "../services/sectionService";
import { markHighlighted } from "../services/profileService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/ShadcnButton";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  section: Section;

  entry: Record<string, any>;
  onclose: () => void;
  deleteProfileEntry: (sectionKey: string, id: string) => void;
  onSubmit: (data: {
    id: string;

    profileSection: { Key: string; value: any }[];
    files: Record<string, File | null>;
    successMessage?: string;
  }) => void;
}

const DynamicEditSectionForm: React.FC<Props> = ({
  section,
  entry,
  onSubmit,
  onclose,
  deleteProfileEntry,
}) => {

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [isTogglingHighlight, setIsTogglingHighlight] = useState<boolean>(false);
  const [openDateField, setOpenDateField] = useState<string | null>(null);
  const [calendarMonthByField, setCalendarMonthByField] = useState<Record<string, Date>>({});
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 2 }, (_, i) => `${currentYear + 1 - i}`);

  const getCalendarMonth = (fieldKey: string, value?: string) => {
    if (calendarMonthByField[fieldKey]) return calendarMonthByField[fieldKey];
    if (value) return new Date(value);
    return new Date(currentYear - 18, 0);
  };

  const setCalendarYear = (fieldKey: string, yearValue: string, value?: string) => {
    const parsed = Number(yearValue);
    if (!Number.isFinite(parsed)) return;
    const safeYear = Math.min(Math.max(parsed, 1950), currentYear + 1);
    const base = getCalendarMonth(fieldKey, value);
    setCalendarMonthByField((prev) => ({
      ...prev,
      [fieldKey]: new Date(safeYear, base.getMonth(), 1),
    }));
  };
  useEffect(() => {
    setFormData(entry || {});
    setFiles({});
    setIsHighlighted(entry?.isHighlighted || false);
  }, [entry]);


  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setFormData((prev) => ({ ...prev, [key]: file ? file.name : "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileSection: { Key: string; value: any }[] = [];

    for (const field of section.fields) {
      const value = formData[field.fieldKey];

      if (field.isRequired && (value === undefined || value === "" || value === null)) {
        toast.error(`Field "${field.name}" is required.`);
        return;
      }

      // Phone number validation (exactly 10 digits, optional leading +)
      if (/(phone|mobile)/i.test(field.name || field.fieldKey) && value) {
        const raw = String(value).trim();
        const digitsOnly = raw.replace(/\D/g, "");

        if (digitsOnly.length !== 10) {
          toast.error(`Phone number must be exactly 10 digits.`);
          return;
        }

        const pattern = /^\+?\d{10}$/;
        if (!pattern.test(raw)) {
          toast.error(`Please enter a valid phone number for "${field.name}".`);
          return;
        }
      }

      // Years of experience validation (numeric, optional min/max from field)
      if (/(year|yrs).*exp/i.test(field.name || field.fieldKey) && value !== undefined && value !== null && value !== '') {
        const raw = String(value).trim();
        const num = Number(raw);
        if (!Number.isFinite(num) || Number.isNaN(num)) {
          toast.error(`Please enter a valid number for "${field.name}".`);
          return;
        }

        const cfg: any = field as any;
        const minVal: number | undefined = cfg.min;
        const maxVal: number | undefined = cfg.max;

        if (minVal !== undefined && num < minVal) {
          toast.error(`"${field.name}" must be at least ${minVal}.`);
          return;
        }
        if (maxVal !== undefined && num > maxVal) {
          toast.error(`"${field.name}" must be at most ${maxVal}.`);
          return;
        }
      }

      const isFile = value instanceof File || files[field.fieldKey] instanceof File;

      profileSection.push({
        Key: field.fieldKey,
        value: isFile ? null : value ?? field.default_value ?? "",
      });
    }

    const changedFields = section.fields.filter((field) => {
      const key = field.fieldKey;
      const nextValue = formData[key];
      const prevValue = entry?.[key];
      const hasFileUpdate = files[key] instanceof File;

      if (hasFileUpdate) return true;

      const nextNormalized = nextValue === undefined || nextValue === null ? "" : String(nextValue).trim();
      const prevNormalized = prevValue === undefined || prevValue === null ? "" : String(prevValue).trim();
      return nextNormalized !== prevNormalized;
    });

    const successMessage =
      changedFields.length === 1
        ? `${changedFields[0].name || "Field"} updated successfully`
        : "Section updated successfully";

    onSubmit({ id: entry.id, profileSection, files, successMessage });
  };

  const handleToggleHighlight = async () => {
    try {
      setIsTogglingHighlight(true);
      const newHighlightState = !isHighlighted;
      await markHighlighted(section.SectionKey, entry.id, newHighlightState);
      setIsHighlighted(newHighlightState);
      toast.success(`Entry ${newHighlightState ? "highlighted" : "unhighlighted"} successfully`);
    } catch (error) {
      toast.error("Failed to update highlight status. Please try again.");
      console.error(error);
    } finally {
      setIsTogglingHighlight(false);
    }
  };

  return (
    <div className="h-full max-h-[90vh] w-full overflow-y-auto space-y-6">

      <div className="flex items-center border-b border-gray-200 shadow p-4 px-6 justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{section.name}</h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-white">{section.description}</p>
        </div>
        <button
          className="text-gray-400 hover:bg-gray-100 p-1 px-3 transition duration-150 rounded-full text-lg hover:text-gray-600"
          onClick={onclose}
        >
          ✕
        </button>
      </div>


      <form className="space-y-4 px-6 pb-6" onSubmit={handleSubmit}>
        {section.fields.map((field) => {
          const key = field.fieldKey;
          const value = formData[key];

          return (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-white mb-1">
                {field.name} {field.isRequired && <span className="text-red-500">*</span>}
              </label>

              {field.dataType === "string" &&
                field.validationType === "enum" &&
                Array.isArray(field.validationValue) ? (
                <select
                  value={value || ""}
                  className="px-3 py-2 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {field.validationValue.map((option: string, index: number) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.dataType === "string" ? (
                /(year|yrs).*exp/i.test(field.name || key) ? (
                  <input
                    type="number"
                    value={value || ""}
                    placeholder={field.placeholder}
                    min={(field as any).min}
                    max={(field as any).max}
                    className="px-3 py-2 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "") {
                        handleChange(key, "");
                        return;
                      }
                      const cleaned = raw.replace(/[^\d]/g, "");
                      handleChange(key, cleaned);
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={value || ""}
                    placeholder={field.placeholder}
                    className="px-3 py-2 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )
              ) : field.dataType === "date" ? (
                <Popover
                  open={openDateField === key}
                  onOpenChange={(open) =>
                    setOpenDateField(open ? key : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal px-3 py-2 dark:bg-gray-950 rounded-md",
                        !value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value
                        ? format(new Date(value), "PPP")
                        : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex items-center gap-2 p-2 border-b border-border bg-background">
                      <span className="text-xs text-muted-foreground">Year</span>
                      <select
                        value={`${getCalendarMonth(key, value)?.getFullYear()}`}
                        onChange={(e) => setCalendarYear(key, e.target.value, value)}
                        className="h-8 w-28 rounded-md border bg-background px-2 text-sm dark:bg-gray-950 focus:outline-none focus:ring-1 focus:ring-primary/90"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Calendar
                      mode="single"
                      selected={value ? new Date(value) : undefined}
                      onSelect={(date) => {
                        if (!date) {
                          handleChange(key, "");
                          setOpenDateField(null);
                          return;
                        }
                        handleChange(key, date.toISOString());
                        setOpenDateField(null);
                      }}
                      month={getCalendarMonth(key, value)}
                      onMonthChange={(month) =>
                        setCalendarMonthByField((prev) => ({ ...prev, [key]: month }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (field.dataType === "binary" || field.dataType === "object") ? (
                <>
                  <input
                    type="file"
                    accept={field.dataType === 'binary' ? "image/*" : ".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
                    className="file:border file:mr-4 dark:bg-gray-950 file:py-2 file:px-4 file:rounded-full file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
                  />
                  {typeof value === "string" && value && field.dataType === "binary" && (
                    <img
                      src={value}
                      alt={field.name || key}
                      style={{ maxWidth: "100px", borderRadius: 8, marginTop: 8 }}
                    />
                  )}
                  {typeof value === "string" && value && field.dataType === "object" && (
                    <div className="mt-2">
                      <a href={value} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm">
                        View current file
                      </a>
                    </div>
                  )}
                </>
              ) : field.dataType === "boolean" ? (
                <input
                  type="checkbox"
                  checked={value || false}
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
              ) : field.dataType === "number" ? (
                <>
                  {/(phone|mobile)/i.test(field.name || key) ? (
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={value || ""}
                      placeholder={field.placeholder}
                      className="px-3 py-2 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                      onChange={(e) => {
                        const maxLen = 10;
                        let v = e.target.value;
                        // Allow only digits and optional leading +
                        v = v.replace(/[^0-9+]/g, "");
                        // Ensure + only at start
                        if (v.includes("+")) {
                          v = "+" + v.replace(/\+/g, "").replace(/[^0-9]/g, "");
                        }
                        // Enforce max length (excluding +)
                        const sign = v.startsWith("+") ? "+" : "";
                        const digits = v.replace(/\D/g, "");
                        const limitedDigits = maxLen ? digits.slice(0, maxLen) : digits;
                        const cleaned = sign + limitedDigits;
                        handleChange(key, cleaned);
                      }}
                    />
                  ) : (
                    <input
                      type="number"
                      value={value || ""}
                      placeholder={field.placeholder}
                      className="px-3 py-2 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  )}
                </>
              ) : field.dataType === "email" ? (
                <input
                  type="email"
                  value={value || ""}
                  placeholder={field.placeholder}
                  className="px-3 py-2 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : field.dataType === "phone" ? (
                <input
                  type="tel"
                  value={value || ""}
                  placeholder={field.placeholder}
                  className="px-3 py-2 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : field.dataType === "longtext" ? (
                <textarea
                  value={formData[field.fieldKey] || ""}
                  placeholder={field.placeholder}
                  className="px-3 py-2 dark:bg-gray-950 h-28 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                />
              ) : null}
            </div>
          );
        })}

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-white">
              <input
                type="checkbox"
                checked={isHighlighted}
                disabled={isTogglingHighlight}
                className="h-4 w-4 accent-primary"
                onChange={handleToggleHighlight}
              />
              <span>Mark this entry as highlighted</span>
            </label>
            {isTogglingHighlight && (
              <span className="text-sm text-gray-500">Updating...</span>
            )}
          </div>


          <div className="flex flex-wrap gap-4">

            <button
              type="button"
              className="px-6 mt-4 py-2 bg-red-600 text-white transition duration-150 rounded-full hover:bg-red-700"
              onClick={() => {
                deleteProfileEntry(section.SectionKey, entry.id);
                onclose();
              }}
            >
              Delete
            </button>

            <button
              type="submit"
              className="px-6 mt-4 py-2 bg-primary transition duration-150 text-white rounded-full hover:bg-primary"
            >
              Update
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default DynamicEditSectionForm;
