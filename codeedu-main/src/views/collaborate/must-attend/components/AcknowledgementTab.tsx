import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { ArrowRight, Briefcase, ChevronDown, CheckCircle2, Loader2, X, Check } from "lucide-react";
import { saveJobLead } from '@/services/learner/jobLeadService';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import AcknowledgementSurvey from './AcknowledgementSurvey';
import { useAuth } from '@/auth';
import { useStudentQueries } from '@/hooks/data/faculty/useStudentQueries';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchCompanyList } from '@/views/industry/services/JobService';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const offerLetterKeywords = [
  "offer letter",
  "employment offer",
  "joining date",
  "annual ctc",
  "salary",
  "designation",
  "candidate name"
];

const isOfferLetter = (text: string) => {
  const lowerText = text.toLowerCase();
  return offerLetterKeywords.some(keyword => lowerText.includes(keyword));
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  const maxPages = Math.min(pdf.numPages, 3);
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + ' ';
  }
  return fullText;
};

export default function AcknowledgementTab() {
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: studentQueriesData } = useStudentQueries();

  const uploadedLetters = studentQueriesData?.data?.filter((q: any) => q.pdf_path && q.user_id == user?.id) || [];
  const hasOfferLetter = uploadedLetters.length > 0;
  const hasType2 = studentQueriesData?.data?.some((q: any) => q.type === 2 && q.user_id == user?.id) || false;

  const [ackOption, setAckOption] = useState<string | null>('offer_received');
  const [ackSubOption, setAckSubOption] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const mySubmissions = studentQueriesData?.data?.filter((q: any) => q.user_id == user?.id) || [];
  const latestSubmission = mySubmissions.length > 0 ? [...mySubmissions].sort((a: any, b: any) => b.id - a.id)[0] : null;

  const getSubmissionText = (type: number) => {
    switch (type) {
      case 1: return "I have my Offer Letter";
      case 2: return "I don't want any offer letter";
      case 3: return "I am still looking for Job/Internship Opportunities";
      case 4: return "I, would require help from enCODE support.";
      default: return "Submitted Response";
    }
  };

  // "Yes" Form State
  const { data: companies, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanyList
  });

  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');

  const getSelectedCompanyName = () => {
    if (!companies || !selectedCompany) return "";
    const company = companies.find((c: any) => c.id.toString() === selectedCompany);
    return company ? company.name : "";
  };

  const [jobRole, setJobRole] = useState('');
  const [designation, setDesignation] = useState('');
  const [salaryPackage, setSalaryPackage] = useState('');
  const [location, setLocation] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  const [fullAddress, setFullAddress] = useState('');
  const [offerLetterFile, setOfferLetterFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Feedback specific state
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackLikedMost, setFeedbackLikedMost] = useState('');
  const [feedbackSuggestions, setFeedbackSuggestions] = useState('');

  // New requirements
  const [salaryType, setSalaryType] = useState('Yearly');
  const [durationValue, setDurationValue] = useState('');
  const [durationType, setDurationType] = useState('Months');

  const formatSalary = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num === 0) return '';
    if (num >= 10000000) return `${+(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${+(num / 100000).toFixed(2)} Lacs`;
    if (num >= 1000) return `${+(num / 1000).toFixed(2)} K`;
    return num.toString();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('Offer letter must be smaller than 10MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setIsParsing(true);
      const toastId = toast.loading('Verifying document...');
      try {
        const text = await extractTextFromPDF(file);
        if (isOfferLetter(text)) {
          toast.success('Offer letter verified successfully!', { id: toastId });
          setOfferLetterFile(file);
        } else {
          toast.error('The uploaded document does not appear to be an Offer Letter.', { id: toastId });
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error reading PDF:', error);
        toast.error('Failed to read PDF. Please try a different file.', { id: toastId });
        if (fileInputRef.current) fileInputRef.current.value = '';
      } finally {
        setIsParsing(false);
      }
    }
  };

  const handleYesSubmit = async () => {
    const finalCompanyName = selectedCompany === 'other' ? companyName : getSelectedCompanyName();

    if (!finalCompanyName || !jobRole || !designation || !salaryPackage || !location || !fullAddress || !offerLetterFile) {
      toast.error('Please fill all required fields and upload your offer letter');
      return;
    }
    if (offerLetterFile.type !== 'application/pdf') {
      toast.error('Offer letter must be a PDF document');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        type: 1, // Assume 1 = Offer Received
        company_name: finalCompanyName,
        job_role: jobRole,
        designation: designation,
        salary_package: salaryPackage ? `${formatSalary(salaryPackage)} ${salaryType}` : '',
        location,
        company_mobile: companyPhone,
        company_email: companyEmail,
        company_full_address: fullAddress,
      };

      if (jobRole === 'part-time' || jobRole === 'internship') {
        payload.duration = durationValue ? `${durationValue} ${durationType}` : '';
      }

      const res = await saveJobLead(payload, offerLetterFile ?? undefined);
      toast.success('Thank you for sharing the details');
      queryClient.invalidateQueries({ queryKey: ['studentQueries'] });

      // Clear form
      setCompanyName('');
      setJobRole('');
      setDesignation('');
      setSalaryPackage('');
      setLocation('');
      setCompanyPhone('');
      setCompanyEmail('');
      setFullAddress('');
      setOfferLetterFile(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtherSubmit = async () => {
    let payload: any = {
      company_name: '',
      job_role: '',
      designation: '',
      salary_package: '',
      location: '',
      company_full_address: ''
    };
    if (ackOption === 'no_dont_want') {
      if (!ackSubOption) {
        toast.error('Please choose an option');
        return;
      }
      payload = { ...payload, type: 2, problem_challenge: ackSubOption };
    } else if (ackOption === 'no_still_looking') {
      if (!messageText.trim()) { toast.error('Please share your message'); return; }
      payload = { ...payload, type: 3, problem_challenge: messageText };
    } else if (ackOption === 'need_help') {
      if (!messageText.trim()) { toast.error('Please share your message'); return; }
      payload = { ...payload, type: 4, problem_challenge: messageText };
    } else if (ackOption === 'share_feedback') {
      if (!feedbackRating && !feedbackLikedMost.trim() && !feedbackSuggestions.trim()) {
        toast.error('Please share some feedback before submitting');
        return;
      }
      payload = { type: 5 };
      if (feedbackRating) payload.rating = feedbackRating;
      if (feedbackLikedMost.trim()) payload.liked_most = feedbackLikedMost.trim();
      if (feedbackSuggestions.trim()) payload.suggestions = feedbackSuggestions.trim();
    }

    setIsSubmitting(true);
    try {
      const res = await saveJobLead(payload);
      toast.success('Thank you for sharing the details');
      queryClient.invalidateQueries({ queryKey: ['studentQueries'] });
      setMessageText('');
      setFeedbackLikedMost('');
      setFeedbackSuggestions('');
      setFeedbackRating(null);
      setAckSubOption(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-[20px] p-8 border border-gray-700">
      {latestSubmission && !showNewForm ? (
        <>
          <h3 className="text-xl font-bold text-white mb-6">Your Submitted Response</h3>
          <div className="flex flex-col md:flex-row gap-4 items-center w-full">
            {/* Response Card */}
            <div className="bg-[#323232] rounded-[20px] p-5 flex flex-col justify-center items-center gap-4 flex-1 min-w-[200px] min-h-[140px] border border-gray-700 w-full md:w-auto">
              <div className="w-10 h-10 rounded-full border-2 border-[#8cc63f] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8cc63f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-sm text-white text-center">
                <span className="text-[#8cc63f] font-bold">
                  {latestSubmission.type === 1 ? 'Yes' : 'No'}
                </span>, {getSubmissionText(latestSubmission.type)}
              </p>
            </div>

            {/* PDF Cards (If applicable) */}
            {hasOfferLetter && uploadedLetters.length > 0 && (
              <div className="bg-[#323232] rounded-[20px] p-5 flex flex-col justify-start items-start gap-4 flex-1 min-w-[200px] h-[140px] border border-gray-700 overflow-y-auto w-full md:w-auto">
                {uploadedLetters.map((letter: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPdfUrl(letter.pdf_path)}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity w-full"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8cc63f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <text x="5.5" y="16.5" fill="#8cc63f" stroke="none" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PDF</text>
                    </svg>
                    <span className="text-sm text-[#8cc63f] truncate flex-1">
                      {(() => {
                        const company = letter?.company_name ? letter.company_name.replace(/\s+/g, '_') : '';
                        return company ? `${company}_offer_letter.pdf` : `Offer_letter_${index + 1}.pdf`;
                      })()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit New Card */}
            <div className="flex flex-col items-center justify-center gap-3 shrink-0 md:ml-auto w-full md:w-auto mt-4 md:mt-0">
              <h4 className="text-white font-medium text-center text-sm">Want to Submit new response?</h4>
              <button
                onClick={() => setShowNewForm(true)}
                className="bg-[#8cc63f] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#7ab033] transition-colors flex flex-col items-center justify-center gap-0 leading-tight min-w-[120px]"
              >
                <span className="text-lg mb-1 leading-none">→</span>
                <span className="text-sm">Submit</span>
                <span className="text-sm">New</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold text-white mb-6">Respond to enCODE support Notifications</h3>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side options */}
            <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => { if (showNewForm || !hasType2) setAckOption('offer_received') }}
                className={`p-6 rounded-[20px] flex flex-col justify-center items-center gap-3 transition-colors text-center border border-gray-700 ${(hasType2 && !showNewForm) ? 'opacity-50 cursor-not-allowed bg-[#323232] text-white' : `cursor-pointer ${ackOption === 'offer_received' ? 'bg-[#8cc63f] text-black' : 'bg-[#323232] text-white hover:bg-[#424242]'}`}`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${ackOption === 'offer_received' ? 'border-black' : 'border-white'}`}>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm">
                  <span className="font-bold">{ackOption === 'offer_received' ? 'Yes' : <span className="text-[#8cc63f]">Yes</span>}</span>, I have received the offer letter from the Company
                </p>
              </div>

              <div
                onClick={() => { if (showNewForm || !hasOfferLetter) setAckOption('no_dont_want') }}
                className={`p-6 rounded-[20px] flex flex-col justify-center items-center gap-3 transition-colors text-center border border-gray-700 ${(hasOfferLetter && !showNewForm) ? 'opacity-50 cursor-not-allowed bg-[#323232] text-white' : `cursor-pointer ${ackOption === 'no_dont_want' ? 'bg-[#8cc63f] text-black' : 'bg-[#323232] text-white hover:bg-[#424242]'}`}`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${ackOption === 'no_dont_want' ? 'border-black' : 'border-[#8cc63f]'}`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm">
                  <span className="font-bold">{ackOption === 'no_dont_want' ? 'No' : <span className="text-[#8cc63f]">No</span>}</span>, I don't want any offer letter
                </p>
              </div>

              <div
                onClick={() => { if (showNewForm || (!hasOfferLetter && !hasType2)) setAckOption('no_still_looking') }}
                className={`p-6 rounded-[20px] flex flex-col justify-center items-center gap-3 transition-colors text-center border border-gray-700 ${((hasOfferLetter || hasType2) && !showNewForm) ? 'opacity-50 cursor-not-allowed bg-[#323232] text-white' : `cursor-pointer ${ackOption === 'no_still_looking' ? 'bg-[#8cc63f] text-black' : 'bg-[#323232] text-white hover:bg-[#424242]'}`}`}
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${ackOption === 'no_still_looking' ? 'text-black' : 'text-[#8cc63f]'}`}>
                  <mask id="mask_corporate" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="44" height="44">
                    <rect width="44" height="44" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask_corporate)">
                    <path d="M7.33464 38.5C6.3263 38.5 5.46311 38.141 4.74505 37.4229C4.027 36.7049 3.66797 35.8417 3.66797 34.8333V9.16667C3.66797 8.15833 4.027 7.29514 4.74505 6.57708C5.46311 5.85903 6.3263 5.5 7.33464 5.5H18.3346C19.343 5.5 20.2062 5.85903 20.9242 6.57708C21.6423 7.29514 22.0013 8.15833 22.0013 9.16667V12.8333H36.668C37.6763 12.8333 38.5395 13.1924 39.2576 13.9104C39.9756 14.6285 40.3346 15.4917 40.3346 16.5V34.8333C40.3346 35.8417 39.9756 36.7049 39.2576 37.4229C38.5395 38.141 37.6763 38.5 36.668 38.5H7.33464ZM7.33464 34.8333H18.3346V31.1667H7.33464V34.8333ZM7.33464 27.5H18.3346V23.8333H7.33464V27.5ZM7.33464 20.1667H18.3346V16.5H7.33464V20.1667ZM7.33464 12.8333H18.3346V9.16667H7.33464V12.8333ZM22.0013 34.8333H36.668V16.5H22.0013V34.8333ZM27.5013 23.8333C26.9819 23.8333 26.5464 23.6576 26.1951 23.3063C25.8437 22.9549 25.668 22.5194 25.668 22C25.668 21.4806 25.8437 21.0451 26.1951 20.6938C26.5464 20.3424 26.9819 20.1667 27.5013 20.1667H31.168C31.6874 20.1667 32.1228 20.3424 32.4742 20.6938C32.8256 21.0451 33.0013 21.4806 33.0013 22C33.0013 22.5194 32.8256 22.9549 32.4742 23.3063C32.1228 23.6576 31.6874 23.8333 31.168 23.8333H27.5013ZM27.5013 31.1667C26.9819 31.1667 26.5464 30.991 26.1951 30.6396C25.8437 30.2882 25.668 29.8528 25.668 29.3333C25.668 28.8139 25.8437 28.3785 26.1951 28.0271C26.5464 27.6757 26.9819 27.5 27.5013 27.5H31.168C31.6874 27.5 32.1228 27.6757 32.4742 28.0271C32.8256 28.3785 33.0013 28.8139 33.0013 29.3333C33.0013 29.8528 32.8256 30.2882 32.4742 30.6396C32.1228 30.991 31.6874 31.1667 31.168 31.1667H27.5013Z" fill="currentColor" />
                  </g>
                </svg>
                <p className="text-sm">
                  <span className="font-bold">{ackOption === 'no_still_looking' ? 'No' : <span className="text-[#8cc63f]">No</span>}</span>, I am still looking for Job/Internship Opportunities
                </p>
              </div>

              <div
                onClick={() => setAckOption('need_help')}
                className={`p-6 rounded-[20px] flex flex-col justify-center items-center gap-3 cursor-pointer transition-colors text-center border border-gray-700 ${ackOption === 'need_help' ? 'bg-[#8cc63f] text-black' : 'bg-[#323232] text-white hover:bg-[#424242]'}`}
              >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${ackOption === 'need_help' ? 'text-black' : 'text-[#8cc63f]'}`}>
                  <mask id="mask_creative" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="3" width="44" height="44">
                    <rect x="3" y="3" width="44" height="44" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask_creative)">
                    <path d="M21.3346 36.0001C20.3263 36.0001 19.4631 35.6411 18.7451 34.923C18.027 34.2049 17.668 33.3417 17.668 32.3334V30.0417C15.9263 28.8501 14.5742 27.3223 13.6117 25.4584C12.6492 23.5945 12.168 21.6084 12.168 19.5001C12.168 15.9251 13.4131 12.8924 15.9034 10.4022C18.3937 7.91189 21.4263 6.66675 25.0013 6.66675C28.5763 6.66675 31.6089 7.91189 34.0992 10.4022C36.5895 12.8924 37.8346 15.9251 37.8346 19.5001C37.8346 21.6084 37.3534 23.5869 36.3909 25.4355C35.4284 27.2841 34.0763 28.8195 32.3346 30.0417V32.3334C32.3346 33.3417 31.9756 34.2049 31.2576 34.923C30.5395 35.6411 29.6763 36.0001 28.668 36.0001H21.3346ZM21.3346 32.3334H28.668V29.0792C28.668 28.7737 28.7367 28.4834 28.8742 28.2084C29.0117 27.9334 29.2027 27.7195 29.4471 27.5667L30.2263 27.0167C31.4791 26.1612 32.4492 25.0688 33.1367 23.7397C33.8242 22.4105 34.168 20.9973 34.168 19.5001C34.168 16.964 33.2742 14.8022 31.4867 13.0147C29.6992 11.2272 27.5374 10.3334 25.0013 10.3334C22.4652 10.3334 20.3034 11.2272 18.5159 13.0147C16.7284 14.8022 15.8346 16.964 15.8346 19.5001C15.8346 20.9973 16.1784 22.4105 16.8659 23.7397C17.5534 25.0688 18.5235 26.1612 19.7763 27.0167L20.5555 27.5667C20.7999 27.7195 20.9909 27.9334 21.1284 28.2084C21.2659 28.4834 21.3346 28.7737 21.3346 29.0792V32.3334ZM21.3346 43.3334C20.8152 43.3334 20.3798 43.1577 20.0284 42.8063C19.677 42.4549 19.5013 42.0195 19.5013 41.5001C19.5013 40.9806 19.677 40.5452 20.0284 40.1938C20.3798 39.8424 20.8152 39.6667 21.3346 43.3334H21.3346Z" fill="currentColor" />
                  </g>
                </svg>
                <p className="text-sm">
                  I, would require help from enCODE support.
                </p>
              </div>

              <div
                onClick={() => setAckOption('share_feedback')}
                className={`col-span-1 sm:col-span-2 p-6 rounded-[20px] flex flex-col justify-center items-center gap-3 cursor-pointer transition-colors text-center border border-gray-700 ${ackOption === 'share_feedback' ? 'bg-[#8cc63f] text-black' : 'bg-[#323232] text-white hover:bg-[#424242]'}`}
              >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${ackOption === 'share_feedback' ? 'text-black' : 'text-[#8cc63f]'}`}>
                  <mask id="mask_chat" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="3" width="44" height="44">
                    <rect x="3" y="3" width="44" height="44" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask_chat)">
                    <path d="M15.8346 28.6665H34.168C34.6874 28.6665 35.1228 28.4908 35.4742 28.1394C35.8256 27.788 36.0013 27.3526 36.0013 26.8332C36.0013 26.3137 35.8256 25.8783 35.4742 25.5269C35.1228 25.1755 34.6874 24.9998 34.168 24.9998H15.8346C15.3152 24.9998 14.8798 25.1755 14.5284 25.5269C14.177 25.8783 14.0013 26.3137 14.0013 26.8332C14.0013 27.3526 14.177 27.788 14.5284 28.1394C14.8798 28.4908 15.3152 28.6665 15.8346 28.6665ZM15.8346 23.1665H34.168C34.6874 23.1665 35.1228 22.9908 35.4742 22.6394C35.8256 22.288 36.0013 21.8526 36.0013 21.3332C36.0013 20.8137 35.8256 20.3783 35.4742 20.0269C35.1228 19.6755 34.6874 19.4998 34.168 19.4998H15.8346C15.3152 19.4998 14.8798 19.6755 14.5284 20.0269C14.177 20.3783 14.0013 20.8137 14.0013 21.3332C14.0013 21.8526 14.177 22.288 14.5284 22.6394C14.8798 22.9908 15.3152 23.1665 15.8346 23.1665ZM15.8346 17.6665H34.168C34.6874 17.6665 35.1228 17.4908 35.4742 17.1394C35.8256 16.788 36.0013 16.3526 36.0013 15.8332C36.0013 15.3137 35.8256 14.8783 35.4742 14.5269C35.1228 14.1755 34.6874 13.9998 34.168 13.9998H15.8346C15.3152 13.9998 14.8798 14.1755 14.5284 14.5269C14.177 14.8783 14.0013 15.3137 14.0013 15.8332C14.0013 16.3526 14.177 16.788 14.5284 17.1394C14.8798 17.4908 15.3152 17.6665 15.8346 17.6665ZM10.3346 35.9998C9.3263 35.9998 8.46311 35.6408 7.74505 34.9228C7.027 34.2047 6.66797 33.3415 6.66797 32.3332V10.3332C6.66797 9.32484 7.027 8.46164 7.74505 7.74359C8.46311 7.02553 9.3263 6.6665 10.3346 6.6665H39.668C40.6763 6.6665 41.5395 7.02553 42.2576 7.74359C42.9756 8.46164 43.3346 9.32484 43.3346 10.3332V38.8873C43.3346 39.7123 42.9603 40.2853 42.2117 40.6061C41.4631 40.9269 40.7985 40.7971 40.218 40.2165L36.0013 35.9998H10.3346ZM37.5596 32.3332L39.668 34.3957V10.3332H10.3346V32.3332H37.5596Z" fill="currentColor" />
                  </g>
                </svg>
                <p className="text-sm">
                  Share your valuable feedback for the Career Drive
                </p>
              </div>
            </div>

            {/* Right side dynamic content */}
            <div className="w-full md:w-1/2 bg-[#2a2a2a] border border-gray-700 rounded-[20px] p-8">
              {ackOption === 'offer_received' && (
                <div className="flex flex-col h-full">
                  <h4 className="text-white font-bold mb-4">Fill the Details</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2 relative">
                      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                        <PopoverTrigger asChild>
                          <button
                            role="combobox"
                            aria-expanded={comboboxOpen}
                            className={cn(
                              "w-full bg-[#424242] text-white rounded-lg px-4 py-2.5 border-none outline-none flex justify-between items-center peer",
                              !selectedCompany && "text-transparent"
                            )}
                          >
                            {selectedCompany === "other"
                              ? "Other"
                              : selectedCompany
                                ? companies?.find((c: any) => c.id.toString() === selectedCompany)?.name
                                : "Select Company"}
                            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-[#2a2a2a] border-[#3f3f3f] text-white" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                          <Command className="bg-[#2a2a2a]">
                            <CommandInput placeholder="Search company..." className="text-white border-[#3f3f3f]" />
                            <CommandList className="max-h-[200px] overflow-y-auto custom-scrollbar">
                              <CommandEmpty className="text-gray-400 py-4 text-center text-sm">No company found.</CommandEmpty>
                              <CommandGroup>
                                {companies?.map((company: any) => (
                                  <CommandItem
                                    key={company.id}
                                    value={company.name}
                                    onSelect={() => {
                                      setSelectedCompany(company.id.toString());
                                      setComboboxOpen(false);
                                    }}
                                    className="text-white data-[selected='true']:bg-[#3f3f3f] data-[selected='true']:text-white cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedCompany === company.id.toString() ? "opacity-100 text-[#8cc63f]" : "opacity-0"
                                      )}
                                    />
                                    {company.name}
                                  </CommandItem>
                                ))}
                                <CommandItem
                                  value="other"
                                  onSelect={() => {
                                    setSelectedCompany("other");
                                    setComboboxOpen(false);
                                  }}
                                  className="text-white data-[selected='true']:bg-[#3f3f3f] data-[selected='true']:text-white cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCompany === "other" ? "opacity-100 text-[#8cc63f]" : "opacity-0"
                                    )}
                                  />
                                  Other
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <span className={cn(
                        "absolute left-4 transition-all pointer-events-none text-gray-400",
                        selectedCompany ? "top-2 text-sm transform -translate-y-4 scale-75" : "top-2.5"
                      )}>
                        Company Name <span className="text-red-500">*</span>
                      </span>
                    </div>
                    {selectedCompany === 'other' && (
                      <div className="col-span-2 relative">
                        <input type="text" placeholder=" " className="w-full bg-[#424242] text-white rounded-lg px-4 py-2.5 border-none outline-none peer" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                        <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-placeholder-shown:opacity-100">
                          Type Company Name <span className="text-red-500">*</span>
                        </span>
                      </div>
                    )}
                    <div className="relative">
                      <select required value={jobRole} onChange={e => setJobRole(e.target.value)} className="w-full bg-[#424242] text-white rounded-lg px-4 py-2.5 border-none outline-none appearance-none peer">
                        <option value="" disabled hidden></option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="internship">Internship</option>
                      </select>
                      <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-invalid:opacity-100">
                        Type of Job <span className="text-red-500">*</span>
                      </span>
                      <ChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <div className="relative">
                      <input type="text" placeholder=" " className="w-full bg-[#424242] text-white rounded-lg px-4 py-2.5 border-none outline-none peer" value={designation} onChange={e => setDesignation(e.target.value)} />
                      <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-placeholder-shown:opacity-100">
                        Designation <span className="text-red-500">*</span>
                      </span>
                    </div>
                    <div className="relative">
                      <div className="flex bg-[#424242] rounded-lg h-[44px] border-none focus-within:ring-1 focus-within:ring-[#8cc63f]">
                        <div className="relative flex-[2]">
                          <input
                            type="text"
                            placeholder=" "
                            className="w-full bg-transparent text-white px-4 h-full border-none outline-none peer"
                            value={salaryPackage}
                            onChange={e => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setSalaryPackage(val);
                            }}
                          />
                          <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-placeholder-shown:opacity-100">
                            Salary Package <span className="text-red-500">*</span>
                          </span>
                        </div>
                        <div className="relative flex-1 border-l border-gray-600">
                          <select
                            value={salaryType}
                            onChange={e => setSalaryType(e.target.value)}
                            className="w-full h-full bg-transparent text-white pl-2 pr-6 border-none outline-none appearance-none cursor-pointer text-sm"
                          >
                            <option value="Yearly" className="bg-[#424242]">Yearly</option>
                            <option value="Monthly" className="bg-[#424242]">Monthly</option>
                            <option value="Fixed" className="bg-[#424242]">Fixed</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-3.5 text-gray-400 pointer-events-none" size={14} />
                        </div>
                      </div>
                      {salaryPackage && (
                        <div className="absolute -bottom-4 left-2 text-[#8cc63f] text-[10px] font-medium">
                          {formatSalary(salaryPackage)}
                        </div>
                      )}
                    </div>
                    {(jobRole === 'part-time' || jobRole === 'internship') && (
                      <div className="relative">
                        <div className="flex bg-[#424242] rounded-lg h-[44px] border-none focus-within:ring-1 focus-within:ring-[#8cc63f]">
                          <div className="relative flex-[2]">
                            <input
                              type="text"
                              placeholder=" "
                              className="w-full bg-transparent text-white px-4 h-full border-none outline-none peer"
                              value={durationValue}
                              onChange={e => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setDurationValue(val);
                              }}
                            />
                            <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-placeholder-shown:opacity-100">
                              Duration <span className="text-red-500">*</span>
                            </span>
                          </div>
                          <div className="relative flex-1 border-l border-gray-600">
                            <select
                              value={durationType}
                              onChange={e => setDurationType(e.target.value)}
                              className="w-full h-full bg-transparent text-white pl-2 pr-6 border-none outline-none appearance-none cursor-pointer text-sm"
                            >
                              <option value="Months" className="bg-[#424242]">Months</option>
                              <option value="Hourly" className="bg-[#424242]">Hourly</option>
                              <option value="Days" className="bg-[#424242]">Days</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-3.5 text-gray-400 pointer-events-none" size={14} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="relative">
                      <input type="text" placeholder=" " className="w-full bg-[#424242] text-white rounded-lg px-4 py-2.5 border-none outline-none peer" value={location} onChange={e => setLocation(e.target.value)} />
                      <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-placeholder-shown:opacity-100">
                        Job Location <span className="text-red-500">*</span>
                      </span>
                    </div>
                    <div className="relative">
                      <input type="text" placeholder=" " className="w-full bg-[#424242] text-white rounded-lg px-4 py-2.5 border-none outline-none peer" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} />
                      <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-placeholder-shown:opacity-100">
                        Company Phone <span className="text-red-500">*</span>
                      </span>
                    </div>
                    <div className="relative">
                      <input type="email" placeholder=" " className="w-full bg-[#424242] text-white rounded-lg px-4 py-2.5 border-none outline-none peer" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} />
                      <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-placeholder-shown:opacity-100">
                        Company Email <span className="text-red-500">*</span>
                      </span>
                    </div>

                    <div className="col-span-2 relative">
                      <textarea placeholder=" " rows={3} className="w-full bg-[#424242] text-white rounded-lg px-4 py-2.5 border-none outline-none resize-none peer" value={fullAddress} onChange={e => setFullAddress(e.target.value)}></textarea>
                      <span className="absolute left-4 top-2.5 text-gray-400 pointer-events-none transition-opacity peer-focus:opacity-0 opacity-0 peer-placeholder-shown:opacity-100">
                        Company's Full Address <span className="text-red-500">*</span>
                      </span>
                    </div>
                    <div className="col-span-2">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} disabled={isParsing} className="hidden" accept=".pdf,application/pdf" />
                      <div onClick={() => !isParsing && fileInputRef.current?.click()} className={`border border-dashed border-gray-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isParsing ? 'bg-[#353535] opacity-50 cursor-not-allowed' : 'hover:bg-[#353535] bg-[#424242]'}`}>
                        {isParsing ? (
                          <>
                            <Loader2 className="text-[#8cc63f] mb-2 animate-spin" size={24} />
                            <p className="text-[#8cc63f] font-medium text-sm">Verifying Document...</p>
                          </>
                        ) : offerLetterFile ? (
                          <div className="flex flex-col items-center relative w-full h-full justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOfferLetterFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="absolute -top-4 -right-4 p-1.5 bg-[#2a2a2a] hover:bg-[#ff5a5a] border border-gray-600 rounded-full text-gray-400 hover:text-white transition-colors z-10"
                              title="Remove file"
                            >
                              <X size={16} />
                            </button>
                            <CheckCircle2 className="text-[#8cc63f] mb-2" size={24} />
                            <p className="text-[#8cc63f] font-medium text-sm text-center truncate max-w-full px-2">{offerLetterFile.name}</p>
                          </div>
                        ) : (
                          <>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 mb-2">
                              <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M12 18V12M12 12L9 15M12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-xs text-gray-400 mb-1">PDF Only (Max 10MB)</p>
                            <p className="text-[#8cc63f] font-medium text-sm">Upload Offer Letter <span className="text-red-500">*</span></p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-end items-end">
                    {/* <div className="flex flex-wrap gap-2">
                      {uploadedLetters.map((lead: any, idx: number) => (
                        <button
                          key={lead.id || idx}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedPdfUrl(lead.pdf_path);
                          }}
                          className="flex items-center gap-2 bg-[#353535] hover:bg-[#424242] text-[#8cc63f] text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-600 transition-colors"
                          title={lead.company_name || 'Uploaded Offer Letter'}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{lead.company_name ? `${lead.company_name} Offer Letter` : `Offer Letter ${idx + 1}`}</span>
                        </button>
                      ))}
                    </div> */}
                    <Button onClick={handleYesSubmit} disabled={isSubmitting} className="bg-[#8cc63f] hover:bg-[#7ab133] text-black font-medium w-[100px] h-[80px] rounded-[18px] flex flex-col items-center justify-center gap-1.5 p-0 shrink-0 ml-4">
                      {isSubmitting ? <Loader2 size={22} className="animate-spin text-black" /> : <ArrowRight size={22} className="stroke-[2] text-black" />}
                      <span className="text-base font-medium leading-none tracking-wide text-black">{isSubmitting ? '...' : 'Submit'}</span>
                    </Button>
                  </div>
                </div>
              )}

              {ackOption === 'no_dont_want' && (
                <div className="flex flex-col h-full">
                  <h4 className="text-white font-bold mb-4">Choose your Option</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div
                      onClick={() => setAckSubOption('higher_edu')}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center border h-28 ${ackSubOption === 'higher_edu' ? 'bg-[#8cc63f] border-[#8cc63f]' : 'bg-[#424242] border-gray-700 hover:bg-[#4a4a4a]'}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={ackSubOption === 'higher_edu' ? 'text-black' : 'text-[#8cc63f]'}>
                        <path d="M12 14L22 9L12 4L2 9L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 9V15C22 15 22 19 12 19C2 19 2 15 2 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={`text-sm ${ackSubOption === 'higher_edu' ? 'text-black font-medium' : 'text-gray-200'}`}>Looking for<br />Higher Education</span>
                    </div>
                    <div
                      onClick={() => setAckSubOption('family_business')}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center border h-28 ${ackSubOption === 'family_business' ? 'bg-[#8cc63f] border-[#8cc63f]' : 'bg-[#424242] border-gray-700 hover:bg-[#4a4a4a]'}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={ackSubOption === 'family_business' ? 'text-black' : 'text-[#8cc63f]'}>
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 14L11 11L13 13L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={`text-sm ${ackSubOption === 'family_business' ? 'text-black font-medium' : 'text-gray-200'}`}>Planning to start<br />Family Business</span>
                    </div>
                    <div
                      onClick={() => setAckSubOption('startup')}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center border h-28 ${ackSubOption === 'startup' ? 'bg-[#8cc63f] border-[#8cc63f]' : 'bg-[#424242] border-gray-700 hover:bg-[#4a4a4a]'}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={ackSubOption === 'startup' ? 'text-black' : 'text-[#8cc63f]'}>
                        <path d="M12 22L11 18L13 18L12 22Z" fill="currentColor" />
                        <path d="M12 2C12 2 7 6 7 12V16H17V12C17 6 12 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={`text-sm ${ackSubOption === 'startup' ? 'text-black font-medium' : 'text-gray-200'}`}>I want to run my<br />own Startup</span>
                    </div>
                    <div
                      onClick={() => setAckSubOption('no_job')}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center border h-28 ${ackSubOption === 'no_job' ? 'bg-[#8cc63f] border-[#8cc63f]' : 'bg-[#424242] border-gray-700 hover:bg-[#4a4a4a]'}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={ackSubOption === 'no_job' ? 'text-black' : 'text-[#8cc63f]'}>
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className={`text-sm ${ackSubOption === 'no_job' ? 'text-black font-medium' : 'text-gray-200'}`}>I don't want to do a<br />Job/Internship</span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <Button onClick={handleOtherSubmit} disabled={isSubmitting} className="bg-[#8cc63f] hover:bg-[#7ab133] text-black font-medium w-[100px] h-[80px] rounded-[18px] flex flex-col items-center justify-center gap-1.5 p-0">
                      {isSubmitting ? <Loader2 size={22} className="animate-spin text-black" /> : <ArrowRight size={22} className="stroke-[2] text-black" />}
                      <span className="text-base font-medium leading-none tracking-wide text-black">{isSubmitting ? '...' : 'Submit'}</span>
                    </Button>
                  </div>
                </div>
              )}

              {(ackOption === 'need_help' || ackOption === 'no_still_looking') && (
                <div className="flex flex-col h-full">
                  <h4 className="text-white font-bold mb-4">Choose your Option</h4>
                  <div className="mb-6 flex-grow">
                    <textarea
                      placeholder="Share your Message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full h-full min-h-[200px] bg-[#424242] text-white placeholder-gray-400 rounded-lg px-4 py-4 border-none outline-none resize-none"
                    ></textarea>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <Button onClick={handleOtherSubmit} disabled={isSubmitting} className="bg-[#8cc63f] hover:bg-[#7ab133] text-black font-medium w-[100px] h-[80px] rounded-[18px] flex flex-col items-center justify-center gap-1.5 p-0">
                      {isSubmitting ? <Loader2 size={22} className="animate-spin text-black" /> : <ArrowRight size={22} className="stroke-[2] text-black" />}
                      <span className="text-base font-medium leading-none tracking-wide text-black">{isSubmitting ? '...' : 'Submit'}</span>
                    </Button>
                  </div>
                </div>
              )}

              {ackOption === 'share_feedback' && (
                <AcknowledgementSurvey onSuccess={() => setAckOption(null)} />
              )}

              {!ackOption && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 min-h-[300px]">
                  <p>Select an option from the left to respond</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* PDF View Modal */}
      <Dialog open={!!selectedPdfUrl} onOpenChange={(open) => !open && setSelectedPdfUrl(null)}>
        <DialogContent className="max-w-4xl w-full h-[85vh] bg-[#1a1a1a] border-gray-800 p-0 flex flex-col gap-0">
          <DialogHeader className="p-4 border-b border-gray-800">
            <DialogTitle className="text-white text-lg flex items-center justify-between">
              <span>Offer Letter</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-full bg-black/50 p-4">
            {selectedPdfUrl && (
              <iframe
                src={selectedPdfUrl}
                className="w-full h-full rounded-md border-0 bg-white"
                title="Offer Letter PDF"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
