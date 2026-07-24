import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/ShadcnButton';
import { fetchInternshipApply } from '@/services/collaborate/EventService';
import AsyncSelect from 'react-select/async';
import { fetchPortfolio } from '@/services/portfolio/PortfolioService';
import { useQueryClient } from '@tanstack/react-query';

interface AddApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | undefined;
}

interface ElasticUser {
  id: string;
  name: string;
  email: string;
}

const AddApplicantModal: React.FC<AddApplicantModalProps> = ({ isOpen, onClose, jobId }) => {
  const [selectedUser, setSelectedUser] = useState<ElasticUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const response = await fetch(`https://elastic.edulystventures.com/search?org_key=1345643162&query=${encodeURIComponent(inputValue)}`);
      const data = await response.json();
      if (data.success && data.suggestions) {
        const users = data.suggestions.find((s: any) => s.type === 'person')?.hits || [];
        return users.map((u: any) => ({
          value: u.id,
          label: `${u.name} (${u.email})`,
          user: u,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error('Please select an applicant.');
      return;
    }

    if (!jobId) return;

    setIsSubmitting(true);
    try {
      // Fetch the portfolio of the selected user to get their resume
      const portfolioData = await fetchPortfolio(selectedUser.id);
      const resumes = portfolioData?.resume || [];

      // Use the first resume from the portfolio array, or undefined if none exists
      const resumeUrl = resumes.length > 0 ? (resumes[0] as any).url : undefined;

      await fetchInternshipApply(jobId, resumeUrl, selectedUser.id);
      
      // Auto-refresh the matching candidates list
      queryClient.invalidateQueries({ queryKey: ['appliedStudentsByJob', jobId] });
      
      toast.success(`Successfully added applicant ${selectedUser.name}`);
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add applicant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-[#1d1d1d] border-gray-700 text-white overflow-visible">
        <DialogHeader>
          <DialogTitle>Add Applicant</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4 overflow-visible">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Search Applicant</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadOptions}
              onChange={(option: any) => setSelectedUser(option?.user || null)}
              placeholder="Search users..."
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: '#323232',
                  borderColor: state.isFocused ? 'var(--primary)' : '#4b5563',
                  color: 'white',
                  boxShadow: state.isFocused ? '0 0 0 1px var(--primary)' : 'none',
                  '&:hover': {
                    borderColor: state.isFocused ? 'var(--primary)' : '#6b7280'
                  }
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#323232',
                  color: 'white',
                  zIndex: 9999,
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#4b5563' : '#323232',
                  color: 'white',
                  '&:active': {
                    backgroundColor: '#4b5563'
                  }
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'white',
                }),
                input: (base) => ({
                  ...base,
                  color: 'white',
                })
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-black hover:bg-primary/90"
            disabled={!selectedUser || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Applicant'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddApplicantModal;
