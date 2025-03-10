
import React from 'react';
import type { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface MedicationDetailsProps {
  medication: MedicationInfoType;
}

const MedicationDetails: React.FC<MedicationDetailsProps> = ({ medication }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#F6F6F7] p-4 rounded-md border border-[#C8C8C9]">
        <h2 className="text-2xl font-bold text-[#1F4894]">{medication.name}</h2>
        {medication.genericName && medication.genericName !== medication.name && (
          <p className="text-[#8E9196]">Generic name: <span className="font-medium">{medication.genericName}</span></p>
        )}
      </div>

      <div className="bg-white p-4 rounded-md border border-[#C8C8C9] shadow-sm">
        <h3 className="text-[#1F4894] text-lg font-semibold mb-2">Overview</h3>
        <p className="text-[#333333] leading-relaxed">{medication.description}</p>
      </div>

      <div className="bg-white p-4 rounded-md border border-[#C8C8C9] shadow-sm">
        <h3 className="text-[#1F4894] text-lg font-semibold mb-2">Used For</h3>
        <div className="flex flex-wrap gap-2">
          {medication.usedFor.map((use, index) => (
            <Badge key={index} className="bg-[#EFF5FB] text-[#1F4894] border-[#C8D7EC] hover:bg-[#E4EEF8]">
              {use}
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-[#EFF5FB] p-4 rounded-md border border-[#C8D7EC] shadow-sm">
        <h3 className="text-[#1F4894] text-lg font-semibold mb-2">Dosage Information</h3>
        <Separator className="bg-[#C8D7EC] my-2" />
        <div className="space-y-3">
          <p><span className="font-medium text-[#1F4894]">Adult:</span> {medication.dosage.adult}</p>
          {medication.dosage.child && (
            <p><span className="font-medium text-[#1F4894]">Children:</span> {medication.dosage.child}</p>
          )}
          {medication.dosage.elderly && (
            <p><span className="font-medium text-[#1F4894]">Elderly:</span> {medication.dosage.elderly}</p>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border border-[#C8C8C9] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-5 w-5 text-[#1F4894]" />
          <h3 className="text-[#1F4894] text-lg font-semibold">Side Effects</h3>
        </div>
        <Separator className="bg-[#C8C8C9] my-2" />
        <ul className="list-disc pl-5 space-y-1">
          {medication.sideEffects.map((effect, index) => (
            <li key={index} className="text-[#333333]">{effect}</li>
          ))}
        </ul>
      </div>

      <Alert className="bg-[#FCECE9] border border-[#F4B7AB] text-[#9E382E]">
        <AlertTriangle className="h-4 w-4 text-[#D6342B]" />
        <AlertTitle className="text-[#D6342B] font-semibold">Warnings</AlertTitle>
        <Separator className="bg-[#F4B7AB] my-2" />
        <AlertDescription>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-[#9E382E]">
            {medication.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      <div className="bg-white p-4 rounded-md border border-[#C8C8C9] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-[#F0AD4E]" />
          <h3 className="text-[#1F4894] text-lg font-semibold">Drug Interactions</h3>
        </div>
        <Separator className="bg-[#C8C8C9] my-2" />
        <p className="text-[#8E9196] mb-2">Use caution with the following:</p>
        <ul className="list-disc pl-5 space-y-1">
          {medication.interactions.map((interaction, index) => (
            <li key={index} className="text-[#333333]">{interaction}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end text-sm text-[#8E9196] italic">
        <span className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          Medical information provided for educational purposes only
        </span>
      </div>
    </div>
  );
};

export default MedicationDetails;
