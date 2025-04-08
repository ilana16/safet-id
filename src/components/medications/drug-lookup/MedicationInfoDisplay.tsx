
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Plus, RotateCcw } from 'lucide-react';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MedicationInfoDisplayProps {
  medicationInfo: MedicationInfoType | null;
  selectedMedication: string | null;
  isLoading: boolean;
  error: string | null;
  canAddToProfile: boolean;
  dataSource?: string;
  onResetSearch: () => void;
  onAddToProfile: () => void;
}

const MedicationInfoDisplay: React.FC<MedicationInfoDisplayProps> = ({
  medicationInfo,
  selectedMedication,
  isLoading,
  error,
  canAddToProfile,
  dataSource = "Drugs.com",
  onResetSearch,
  onAddToProfile
}) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Error Finding Medication Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 mb-4">
            <p>{error}</p>
            {selectedMedication && (
              <p className="mt-2">
                Could not find information for: <span className="font-medium">{selectedMedication}</span>
              </p>
            )}
          </div>
          <Button onClick={onResetSearch} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Another Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!medicationInfo || isLoading) return null;

  return (
    <Card className="border-safet-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            {medicationInfo.name}
            <Badge className="ml-2 bg-safet-100 text-safet-600 hover:bg-safet-200 hover:text-safet-700">
              {dataSource}
            </Badge>
            {medicationInfo.prescriptionOnly && (
              <Badge className="ml-2 bg-blue-100 text-blue-600 hover:bg-blue-200">Rx Only</Badge>
            )}
          </CardTitle>
          <Button onClick={onResetSearch} variant="ghost" size="sm" className="text-gray-500">
            <RotateCcw className="h-4 w-4 mr-1" />
            New Search
          </Button>
        </div>
        {medicationInfo.genericName && medicationInfo.genericName !== medicationInfo.name && (
          <p className="text-sm text-gray-500 mt-1">Generic: {medicationInfo.genericName}</p>
        )}
        {medicationInfo.drugClass && (
          <Badge variant="outline" className="mt-2 bg-gray-100">
            {medicationInfo.drugClass}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
            <p className="text-sm text-gray-600">{medicationInfo.description}</p>
          </div>

          {medicationInfo.usedFor && medicationInfo.usedFor.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Used For</h3>
              <div className="flex flex-wrap gap-1">
                {medicationInfo.usedFor.map((use, index) => (
                  <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                    {use}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {medicationInfo.dosage && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Dosage</h3>
              <div className="text-sm text-gray-600 space-y-2">
                {medicationInfo.dosage.adult && (
                  <p><span className="font-medium">Adult:</span> {medicationInfo.dosage.adult}</p>
                )}
                {medicationInfo.dosage.child && (
                  <p><span className="font-medium">Child:</span> {medicationInfo.dosage.child}</p>
                )}
                {medicationInfo.dosage.elderly && (
                  <p><span className="font-medium">Elderly:</span> {medicationInfo.dosage.elderly}</p>
                )}
                {medicationInfo.dosage.frequency && (
                  <p><span className="font-medium">Frequency:</span> {medicationInfo.dosage.frequency}</p>
                )}
              </div>
            </div>
          )}

          {medicationInfo.sideEffects && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Side Effects</h3>
              {medicationInfo.sideEffects.common && medicationInfo.sideEffects.common.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500">Common:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medicationInfo.sideEffects.common.slice(0, 5).map((effect, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                        {effect}
                      </Badge>
                    ))}
                    {medicationInfo.sideEffects.common.length > 5 && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700">
                        +{medicationInfo.sideEffects.common.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {medicationInfo.sideEffects.serious && medicationInfo.sideEffects.serious.length > 0 && (
                <div>
                  <p className="text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Serious:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medicationInfo.sideEffects.serious.slice(0, 3).map((effect, index) => (
                      <Badge key={index} className="bg-red-50 text-red-700 border-red-100">
                        {effect}
                      </Badge>
                    ))}
                    {medicationInfo.sideEffects.serious.length > 3 && (
                      <Badge className="bg-red-50 text-red-700 border-red-100">
                        +{medicationInfo.sideEffects.serious.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {medicationInfo.warnings && medicationInfo.warnings.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                Warnings
              </h3>
              <ScrollArea className="h-24 w-full">
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  {medicationInfo.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}

          {medicationInfo.interactions && medicationInfo.interactions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Drug Interactions</h3>
              <ScrollArea className="h-24 w-full">
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  {medicationInfo.interactions.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}

          {medicationInfo.pregnancy && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Pregnancy</h3>
              <p className="text-sm text-gray-600">{medicationInfo.pregnancy}</p>
            </div>
          )}

          {canAddToProfile && (
            <div className="pt-3">
              <Button 
                onClick={onAddToProfile} 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to My Medications
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationInfoDisplay;
