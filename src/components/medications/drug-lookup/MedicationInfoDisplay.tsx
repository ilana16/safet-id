
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlusCircle } from 'lucide-react';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import MedicationInfo from '../MedicationInfo';

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
              onClick={onAddToProfile}
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
