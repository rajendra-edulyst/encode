import React, { useState } from 'react';
import type { Section } from '../services/sectionService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/ShadcnInput';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/ShadcnButton";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  section: Section;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: { Key: string; value: any }[]) => void;
  onclose: () => void;
}

const DynamicSectionForm: React.FC<Props> = ({ section, onSubmit, onclose }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isHighlighted, setIsHighlighted] = useState(false);
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


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileSection: { Key: string; value: any }[] = [];

    for (const field of section.fields) {
      const value = formData[field.fieldKey];

      if (field.isRequired && (value === undefined || value === '' || value === null)) {
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

      const isFile = value instanceof File;
      profileSection.push({
        Key: field.fieldKey,
        value: value ?? field.default_value ?? '',
      });
    }

    // ✅ Add highlight field as part of submission
    profileSection.push({
      Key: 'isHighlighted',
      value: isHighlighted,
    });

    onSubmit(profileSection);
  };

  return (
    <div className="h-full w-full space-y-6">
      <div className="flex items-center border-b border-gray-200 shadow p-4 px-6 justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {section.name}
          </h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-white">
            {section.description}
          </p>
        </div>

        <button
          className="text-gray-400 hover:bg-gray-100 p-1 px-3 transition duration-150 rounded-full text-lg hover:text-gray-600"
          type="button"
          onClick={onclose}
        >
          ✕
        </button>
      </div>

      <form
        className="space-y-4 px-6 pb-6 overflow-y-auto max-h-[70vh]"
        onSubmit={handleSubmit}
      >
        {section.fields.map((field) => (
          <div key={field.fieldKey} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-1">
              {field.name} {field.isRequired && <span className="text-red-500">*</span>}
            </label>

            {/* ENUM Dropdown */}
            {field.dataType === 'string' &&
              field.validationType === 'enum' &&
              Array.isArray(field.validationValue) ? (
              <Select
                value={formData[field.fieldKey] || ''}
                onValueChange={(value) => handleChange(field.fieldKey, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {field.validationValue.map((option: string, index: number) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.dataType === 'string' ? (
              /(year|yrs).*exp/i.test(field.name || field.fieldKey) ? (
                <Input
                  type="number"
                  value={formData[field.fieldKey] || ''}
                  placeholder={field.placeholder}
                  min={(field as any).min}
                  max={(field as any).max}
                  onChange={(e) => {
                    const raw = e.target.value;
                    // Allow empty, otherwise only digits
                    if (raw === '') {
                      handleChange(field.fieldKey, '');
                      return;
                    }
                    const cleaned = raw.replace(/[^\d]/g, '');
                    handleChange(field.fieldKey, cleaned);
                  }}
                />
              ) : (
                <Input
                  type="text"
                  value={formData[field.fieldKey] || ''}
                  placeholder={field.placeholder}
                  onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                />
              )
            ) : field.dataType === 'date' ? (
              <Popover
                open={openDateField === field.fieldKey}
                onOpenChange={(open) =>
                  setOpenDateField(open ? field.fieldKey : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData[field.fieldKey] && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData[field.fieldKey]
                      ? format(new Date(formData[field.fieldKey]), "PPP")
                      : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex items-center gap-2 p-2 border-b border-border bg-background">
                    <span className="text-xs text-muted-foreground">Year</span>
                    <select
                      value={`${getCalendarMonth(field.fieldKey, formData[field.fieldKey])?.getFullYear()}`}
                      onChange={(e) =>
                        setCalendarYear(field.fieldKey, e.target.value, formData[field.fieldKey])
                      }
                      className="h-8 w-28 rounded-md border bg-background px-2 text-sm"
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
                    selected={
                      formData[field.fieldKey]
                        ? new Date(formData[field.fieldKey])
                        : undefined
                    }
                    onSelect={(date) => {
                      if (!date) {
                        handleChange(field.fieldKey, "");
                        setOpenDateField(null);
                        return;
                      }
                      handleChange(field.fieldKey, date.toISOString());
                      setOpenDateField(null);
                    }}
                    month={getCalendarMonth(field.fieldKey, formData[field.fieldKey])}
                    onMonthChange={(month) =>
                      setCalendarMonthByField((prev) => ({ ...prev, [field.fieldKey]: month }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (field.dataType === 'binary' || field.dataType === 'object') ? (
              <Input
                type="file"
                accept={field.dataType === 'binary' ? "image/*" : ".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
                onChange={(e) =>
                  handleFileChange(field.fieldKey, e.target.files?.[0] || null)
                }
              />
            ) : field.dataType === 'boolean' ? (
              <Input
                type="checkbox"
                checked={formData[field.fieldKey] || false}
                onChange={(e) => handleChange(field.fieldKey, e.target.checked)}
              />
            ) : field.dataType === 'number' ? (
              <>
                {/(phone|mobile)/i.test(field.name || field.fieldKey) ? (
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData[field.fieldKey] || ''}
                    placeholder={field.placeholder}
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
                      handleChange(field.fieldKey, cleaned);
                    }}
                  />
                ) : (
                  <Input
                    type="number"
                    value={formData[field.fieldKey] || ''}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                  />
                )}
              </>
            ) : field.dataType === 'email' ? (
              <Input
                type="email"
                value={formData[field.fieldKey] || ''}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
              />
            ) : field.dataType === 'phone' ? (
              <Input
                type="tel"
                value={formData[field.fieldKey] || ''}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
              />
            ) : field.dataType === 'longtext' ? (
              <Textarea
                value={formData[field.fieldKey] || ''}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
              />
            ) : null}
          </div>
        ))}

        {/* ✅ Highlight checkbox added */}
        <div className="flex items-center justify-between mt-6 border-t border-gray-200 pt-4">
          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-white">
            <input
              type="checkbox"
              checked={isHighlighted}
              className="h-4 w-4 rounded border-gray-300"
              onChange={(e) => setIsHighlighted(e.target.checked)}
            />
            <span>Highlight this entry</span>
          </label>

          <button
            type="submit"
            className="px-6 py-2 bg-primary transition duration-150 text-white rounded-full hover:bg-primary"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicSectionForm;
