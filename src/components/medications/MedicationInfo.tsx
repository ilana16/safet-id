
import React from 'react';
import type { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface MedicationDetailsProps {
  medication: MedicationInfoType;
}

const MedicationDetails: React.FC<MedicationDetailsProps> = ({ medication }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{medication.name}</h2>
        {medication.genericName && medication.genericName !== medication.name && (
          <p className="text-gray-500">Generic name: {medication.genericName}</p>
        )}
      </div>

      <p className="text-gray-700">{medication.description}</p>

      <div>
        <h3 className="font-semibold text-lg mb-2">Used For</h3>
        <div className="flex flex-wrap gap-2">
          {medication.usedFor.map((use, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {use}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="p-4 border-l-4 border-l-amber-500">
        <h3 className="font-semibold text-lg mb-2">Dosage Information</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Adult:</span> {medication.dosage.adult}</p>
          {medication.dosage.child && (
            <p><span className="font-medium">Children:</span> {medication.dosage.child}</p>
          )}
          {medication.dosage.elderly && (
            <p><span className="font-medium">Elderly:</span> {medication.dosage.elderly}</p>
          )}
        </div>
      </Card>

      <div>
        <h3 className="font-semibold text-lg mb-2">Side Effects</h3>
        <ul className="list-disc pl-5 space-y-1">
          {medication.sideEffects.map((effect, index) => (
            <li key={index} className="text-gray-700">{effect}</li>
          ))}
        </ul>
      </div>

      <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warnings</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {medication.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      <div>
        <h3 className="font-semibold text-lg mb-2">Drug Interactions</h3>
        <p className="text-gray-600 mb-2">Use caution with the following:</p>
        <ul className="list-disc pl-5 space-y-1">
          {medication.interactions.map((interaction, index) => (
            <li key={index} className="text-gray-700">{interaction}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MedicationDetails;
