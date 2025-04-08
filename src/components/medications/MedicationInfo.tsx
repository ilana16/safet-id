import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MedicationInfo as MedicationInfoType } from '@/utils/medicationData.d';
import { ArrowUpRight, ChevronsRight } from 'lucide-react';

interface MedicationInfoProps {
  medicationInfo: MedicationInfoType | null;
  selectedMedication: string | null;
  onResetSearch: () => void;
  onAddToProfile: () => void;
  canAddToProfile: boolean;
  isLoading: boolean;
  error: string | null;
  dataSource: string;
  onOpenExternalLink: () => void;
}

const MedicationInfo: React.FC<MedicationInfoProps> = ({
  medicationInfo,
  selectedMedication,
  onResetSearch,
  onAddToProfile,
  canAddToProfile,
  isLoading,
  error,
  dataSource,
  onOpenExternalLink
}) => {
  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fetching medication information. Please wait.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-300">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
          <button onClick={onResetSearch} className="underline text-blue-500 mt-2">
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!medicationInfo) {
    return null;
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle>{medicationInfo.name}</CardTitle>
        <p className="text-sm text-gray-500">Source: {dataSource}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {medicationInfo.genericName && (
          <div>
            <h4 className="font-semibold">Generic Name</h4>
            <p>{medicationInfo.genericName}</p>
          </div>
        )}
        
        {medicationInfo.description && (
          <div>
            <h4 className="font-semibold">Description</h4>
            <p>{medicationInfo.description}</p>
          </div>
        )}
        
        {medicationInfo.drugClass && (
          <div>
            <h4 className="font-semibold">Drug Class</h4>
            <p>{medicationInfo.drugClass}</p>
          </div>
        )}
        
        {medicationInfo.usedFor && medicationInfo.usedFor.length > 0 && (
          <div>
            <h4 className="font-semibold">Used For</h4>
            <ul>
              {medicationInfo.usedFor.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>
        )}
        
        {medicationInfo.warnings && medicationInfo.warnings.length > 0 && (
          <div>
            <h4 className="font-semibold">Warnings</h4>
            <ul>
              {medicationInfo.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
        
        {medicationInfo.sideEffects && (
          <div>
            <h4 className="font-semibold">Side Effects</h4>
            {medicationInfo.sideEffects.common && medicationInfo.sideEffects.common.length > 0 && (
              <div>
                <h5 className="font-medium">Common</h5>
                <ul>
                  {medicationInfo.sideEffects.common.map((sideEffect, index) => (
                    <li key={index}>{sideEffect}</li>
                  ))}
                </ul>
              </div>
            )}
            {medicationInfo.sideEffects.serious && medicationInfo.sideEffects.serious.length > 0 && (
              <div>
                <h5 className="font-medium">Serious</h5>
                <ul>
                  {medicationInfo.sideEffects.serious.map((sideEffect, index) => (
                    <li key={index}>{sideEffect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {medicationInfo.foodInteractions && medicationInfo.foodInteractions.length > 0 && (
          <div>
            <h4 className="font-semibold">Food Interactions</h4>
            <ul>
              {medicationInfo.foodInteractions.map((interaction, index) => (
                <li key={index}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}

        {medicationInfo.conditionInteractions && medicationInfo.conditionInteractions.length > 0 && (
          <div>
            <h4 className="font-semibold">Condition Interactions</h4>
            <ul>
              {medicationInfo.conditionInteractions.map((interaction, index) => (
                <li key={index}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}

        {medicationInfo.therapeuticDuplications && medicationInfo.therapeuticDuplications.length > 0 && (
          <div>
            <h4 className="font-semibold">Therapeutic Duplications</h4>
            <ul>
              {medicationInfo.therapeuticDuplications.map((duplication, index) => (
                <li key={index}>{duplication}</li>
              ))}
            </ul>
          </div>
        )}

        {medicationInfo.interactionClassifications && (
          <div>
            <h4 className="font-semibold">Interaction Classifications</h4>
            {medicationInfo.interactionClassifications.major && medicationInfo.interactionClassifications.major.length > 0 && (
              <div>
                <h5 className="font-medium">Major</h5>
                <ul>
                  {medicationInfo.interactionClassifications.major.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}
            {medicationInfo.interactionClassifications.moderate && medicationInfo.interactionClassifications.moderate.length > 0 && (
              <div>
                <h5 className="font-medium">Moderate</h5>
                <ul>
                  {medicationInfo.interactionClassifications.moderate.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}
            {medicationInfo.interactionClassifications.minor && medicationInfo.interactionClassifications.minor.length > 0 && (
              <div>
                <h5 className="font-medium">Minor</h5>
                <ul>
                  {medicationInfo.interactionClassifications.minor.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {medicationInfo.pregnancy && (
          <div>
            <h4 className="font-semibold">Pregnancy</h4>
            <p>{medicationInfo.pregnancy}</p>
          </div>
        )}

        {medicationInfo.breastfeeding && (
          <div>
            <h4 className="font-semibold">Breastfeeding</h4>
            <p>{medicationInfo.breastfeeding}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button onClick={onResetSearch} className="underline text-blue-500">
            Back to Search
          </button>
          
          <div className="flex gap-2">
            {medicationInfo.drugsComUrl && (
              <button onClick={onOpenExternalLink} className="underline text-blue-500 flex items-center">
                View on Drugs.com
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            )}
            
            {canAddToProfile && (
              <button onClick={onAddToProfile} className="underline text-green-500 flex items-center">
                Add to My Profile
                <ChevronsRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationInfo;
