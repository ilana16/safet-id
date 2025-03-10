
import React from 'react';
import type { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface MedicationDetailsProps {
  medication: MedicationInfoType;
}

const MedicationDetails: React.FC<MedicationDetailsProps> = ({ medication }) => {
  return (
    <div className="space-y-6">
      {/* Medication Header */}
      <div className="bg-[#F0F6FE] p-6 rounded-md border border-[#C8D7EC]">
        <h2 className="text-2xl font-bold text-[#1A3C70]">{medication.name}</h2>
        {medication.genericName && medication.genericName !== medication.name && (
          <p className="text-[#666666] mt-1">Generic name: <span className="font-medium">{medication.genericName}</span></p>
        )}
        
        {medication.drugsComUrl && (
          <div className="mt-4">
            <a 
              href={medication.drugsComUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#0E4DA4] hover:underline"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View on Drugs.com
            </a>
          </div>
        )}
      </div>

      {/* Overview Section */}
      <Card className="overflow-hidden border-[#DEE4EA]">
        <div className="bg-[#1A3C70] text-white px-4 py-3 font-medium flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Overview
        </div>
        <div className="p-5">
          <p className="text-[#333333] leading-relaxed">{medication.description}</p>
        </div>
      </Card>

      {/* Uses Section */}
      <Card className="overflow-hidden border-[#DEE4EA]">
        <div className="bg-[#1A3C70] text-white px-4 py-3 font-medium flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Uses
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {medication.usedFor.map((use, index) => (
              <Badge key={index} className="bg-[#EFF5FB] text-[#1A3C70] border-[#C8D7EC] hover:bg-[#DCE8F7]">
                {use}
              </Badge>
            ))}
          </div>
          <p className="text-[#555555] text-sm italic">Consult your doctor for appropriate dosing and duration of treatment.</p>
        </div>
      </Card>

      {/* Dosage Information */}
      <Card className="overflow-hidden border-[#DEE4EA]">
        <div className="bg-[#1A3C70] text-white px-4 py-3 font-medium flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Dosage Information
        </div>
        <div className="p-5 space-y-3">
          <div className="bg-[#F6F9FE] p-4 rounded border border-[#DCE8F7]">
            <p className="mb-2">
              <span className="font-medium text-[#1A3C70]">Adult:</span> {medication.dosage.adult}
            </p>
            {medication.dosage.child && (
              <p className="mb-2">
                <span className="font-medium text-[#1A3C70]">Children:</span> {medication.dosage.child}
              </p>
            )}
            {medication.dosage.elderly && (
              <p>
                <span className="font-medium text-[#1A3C70]">Elderly:</span> {medication.dosage.elderly}
              </p>
            )}
          </div>
          <p className="text-[#555555] text-sm italic">
            The information provided is not a substitute for medical advice. Always consult your doctor or pharmacist.
          </p>
        </div>
      </Card>

      {/* Side Effects */}
      <Card className="overflow-hidden border-[#DEE4EA]">
        <div className="bg-[#1A3C70] text-white px-4 py-3 font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Side Effects
        </div>
        <div className="p-5">
          <div className="bg-[#F6F9FE] p-4 rounded border border-[#DCE8F7]">
            <ul className="list-disc pl-5 space-y-1 text-[#333333]">
              {medication.sideEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
          <p className="text-[#555555] text-sm mt-3 italic">
            This is not a complete list of side effects. Contact your doctor if you experience any side effects not listed above.
          </p>
        </div>
      </Card>

      {/* Warnings */}
      <Card className="overflow-hidden border-[#C9392E]">
        <div className="bg-[#C9392E] text-white px-4 py-3 font-medium flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2" />
          Warnings
        </div>
        <div className="p-5 bg-[#FDF4F3]">
          <ul className="list-disc pl-5 space-y-1 text-[#8A2A20]">
            {medication.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
          <p className="text-[#8A2A20] text-sm mt-3 italic">
            These warnings are not comprehensive. Read medication guide and consult healthcare provider.
          </p>
        </div>
      </Card>

      {/* Drug Interactions */}
      <Card className="overflow-hidden border-[#DEE4EA]">
        <div className="bg-[#ED9121] text-white px-4 py-3 font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Drug Interactions
        </div>
        <div className="p-5">
          <p className="text-[#555555] mb-3">Use caution with the following:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#333333]">
            {medication.interactions.map((interaction, index) => (
              <li key={index}>{interaction}</li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-[#FFF8E6] border border-[#FFECC7] rounded-md text-sm text-[#8A6D3B]">
            <p className="font-medium">Important:</p>
            <p>This list is not all-inclusive. Provide a full list of medications to your healthcare provider.</p>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="bg-[#F6F9FE] p-4 border border-[#DCE8F7] rounded-md text-[#555555] text-sm">
        <div className="flex items-start">
          <Info className="h-4 w-4 mr-2 text-[#1A3C70] mt-0.5" />
          <div>
            <p className="font-medium text-[#1A3C70]">Disclaimer:</p>
            <p>
              This information is for educational purposes only and should not be interpreted as medical advice. 
              Consult your healthcare provider for personalized medical advice and before starting any medication.
            </p>
            {medication.drugsComUrl && (
              <p className="mt-2">
                For more detailed information, visit{' '}
                <a 
                  href={medication.drugsComUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#0E4DA4] hover:underline"
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
