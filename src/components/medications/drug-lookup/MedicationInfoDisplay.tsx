
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlusCircle } from 'lucide-react';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import MedicationInfo from '../MedicationInfo';
import { toast } from 'sonner';

interface MedicationInfoDisplayProps {
  medicationInfo: MedicationInfoType;
  selectedMedication: string | null;
  onResetSearch: () => void;
  onAddToProfile: () => void;
  canAddToProfile: boolean;
}

const MedicationInfoDisplay: React.FC<MedicationInfoDisplayProps> = ({
  medicationInfo,
  selectedMedication,
  onResetSearch,
  onAddToProfile,
  canAddToProfile
}) => {
  if (!medicationInfo) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Could not load medication information. Please try again.</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={onResetSearch}
        >
          Back to Search
        </Button>
      </div>
    );
  }

  const handleAddToProfile = () => {
    try {
      onAddToProfile();
      toast.success(`${medicationInfo.name} added to your medications`);
    } catch (error) {
      console.error('Error adding medication to profile:', error);
      toast.error('Error adding medication to profile');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
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
      
      <MedicationInfo medication={medicationInfo} />
      
      <div className="mt-4 text-right">
        <p className="text-sm text-gray-500">Source: Drugs.com (simulated)</p>
      </div>
    </div>
  );
};

export default MedicationInfoDisplay;
