
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlusCircle, AlertCircle } from 'lucide-react';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import MedicationInfo from '../MedicationInfo';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface MedicationInfoDisplayProps {
  medicationInfo: MedicationInfoType | null;
  selectedMedication: string | null;
  onResetSearch: () => void;
  onAddToProfile: () => void;
  canAddToProfile: boolean;
  isLoading?: boolean;
  error?: string | null;
}

const MedicationInfoDisplay: React.FC<MedicationInfoDisplayProps> = ({
  medicationInfo,
  selectedMedication,
  onResetSearch,
  onAddToProfile,
  canAddToProfile,
  isLoading = false,
  error = null
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-32 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-16 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={onResetSearch}
          >
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  if (!medicationInfo) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Found</AlertTitle>
            <AlertDescription>
              Could not load medication information. Please try again.
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={onResetSearch}
          >
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToProfile = () => {
    try {
      onAddToProfile();
    } catch (error) {
      console.error('Error adding medication to profile:', error);
      toast.error('Error adding medication to profile');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex justify-between items-center mb-4 p-4 border-b border-gray-200">
        <Button 
          variant="outline" 
          className="text-safet-600" 
          onClick={onResetSearch}
        >
          Back to Search
        </Button>
        
        <div className="flex gap-2">
          {canAddToProfile && (
            <Button 
              className="bg-safet-500 hover:bg-safet-600"
              onClick={handleAddToProfile}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add to My Medications
            </Button>
          )}
          
          {medicationInfo.drugsComUrl && (
            <Button variant="outline" className="text-safet-600" asChild>
              <a 
                href={medicationInfo.drugsComUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View on Drugs.com
              </a>
            </Button>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <MedicationInfo medication={medicationInfo} />
        
        <div className="mt-4 text-right">
          <p className="text-sm text-gray-500">Source: Drugs.com (simulated)</p>
        </div>
      </div>
    </div>
  );
};

export default MedicationInfoDisplay;
