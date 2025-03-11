
import React from 'react';
import type { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, ExternalLink, CheckCircle2, ShieldAlert, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface MedicationDetailsProps {
  medication: MedicationInfoType;
}

const MedicationDetails: React.FC<MedicationDetailsProps> = ({ medication }) => {
  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-3 font-medium">
          Overview
        </div>
        <div className="p-5">
          <p className="text-[#333333] leading-relaxed">{medication.description}</p>
          
          {medication.drugsComUrl && (
            <div className="mt-4">
              <a 
                href={medication.drugsComUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-safet-600 hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View full information on Drugs.com
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Uses Section */}
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-3 font-medium">
          Medical Uses
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {medication.usedFor.map((use, index) => (
              <Badge key={index} className="bg-[#EBF2FA] text-safet-600 border-safet-200 hover:bg-safet-100">
                {use}
              </Badge>
            ))}
          </div>
          <p className="text-[#666666] text-sm italic mt-3">
            Consult your healthcare provider for personalized medical advice.
          </p>
        </div>
      </div>

      {/* Dosage Information */}
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-3 font-medium">
          Dosage Information
        </div>
        <div className="p-5 space-y-3">
          <div className="bg-[#F5F9FD] p-4 rounded border border-[#D1DEE8]">
            <p className="mb-2">
              <span className="font-medium text-safet-600">Adult:</span> {medication.dosage.adult}
            </p>
            {medication.dosage.child && (
              <p className="mb-2">
                <span className="font-medium text-safet-600">Children:</span> {medication.dosage.child}
              </p>
            )}
            {medication.dosage.elderly && (
              <p>
                <span className="font-medium text-safet-600">Elderly:</span> {medication.dosage.elderly}
              </p>
            )}
          </div>
          <Alert className="bg-[#EBF2FA] border-safet-200">
            <Info className="h-4 w-4 text-safet-600" />
            <AlertDescription className="text-[#666666]">
              Dosage information provided for educational purposes only. Follow your doctor's specific instructions.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Side Effects */}
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-3 font-medium">
          Side Effects
        </div>
        <div className="p-5">
          <div className="bg-[#F5F9FD] p-4 rounded border border-[#D1DEE8]">
            <ul className="list-disc pl-5 space-y-1 text-[#333333]">
              {medication.sideEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
          <p className="text-[#666666] text-sm mt-3 italic">
            This is not a complete list of side effects. Contact your doctor if you experience any unexpected symptoms.
          </p>
        </div>
      </div>

      {/* Warnings */}
      <div className="bg-white border border-[#E6B8B5] rounded-md overflow-hidden">
        <div className="bg-[#C42B1C] text-white px-5 py-3 font-medium">
          Important Warnings
        </div>
        <div className="p-5 bg-[#FEF5F4]">
          <ul className="list-disc pl-5 space-y-1 text-[#8A2A20]">
            {medication.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
          <Alert className="mt-4 bg-[#FEF5F4] border-[#E6B8B5]">
            <AlertTriangle className="h-4 w-4 text-[#C42B1C]" />
            <AlertDescription className="text-[#8A2A20]">
              These warnings are not comprehensive. Read medication guide and consult healthcare provider.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Drug Interactions */}
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-[#ED9121] text-white px-5 py-3 font-medium">
          Drug Interactions
        </div>
        <div className="p-5">
          <p className="text-[#666666] mb-3">Use caution with the following:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#333333]">
            {medication.interactions.map((interaction, index) => (
              <li key={index}>{interaction}</li>
            ))}
          </ul>
          <Alert className="mt-4 bg-[#FFF8E6] border-[#FFECC7]">
            <AlertTriangle className="h-4 w-4 text-[#ED9121]" />
            <AlertDescription className="text-[#8A6D3B]">
              This list is not all-inclusive. Provide a full list of medications to your healthcare provider.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#F5F9FD] p-5 border border-[#D1DEE8] rounded-md text-[#666666] text-sm">
        <div className="flex items-start">
          <Info className="h-5 w-5 mr-2 text-safet-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-safet-600">Disclaimer:</p>
            <p className="mt-1">
              This information is for educational purposes only and is not intended as medical advice. 
              Consult your healthcare provider before taking any medication.
            </p>
            {medication.drugsComUrl && (
              <p className="mt-2">
                For more detailed information, visit{' '}
                <a 
                  href={medication.drugsComUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-safet-600 hover:underline"
                >
                  Drugs.com
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;
