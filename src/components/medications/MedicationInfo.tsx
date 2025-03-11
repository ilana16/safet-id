
import React from 'react';
import type { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, ExternalLink, CheckCircle2, ShieldAlert, PlusCircle, TabletDecorative, Clock, BadgePlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MedicationDetailsProps {
  medication: MedicationInfoType;
}

const MedicationInfo: React.FC<MedicationDetailsProps> = ({ medication }) => {
  return (
    <div className="space-y-6">
      {/* Header with Medication Name and Actions */}
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{medication.name}</h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add to My Meds
              </Button>
              {medication.drugsComUrl && (
                <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                  <a href={medication.drugsComUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Drugs.com
                  </a>
                </Button>
              )}
            </div>
          </div>
          {medication.genericName && (
            <p className="text-white/90 mt-1 text-sm">Generic: {medication.genericName}</p>
          )}
        </div>
      </div>

      {/* Tabs for different medication info sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-100 p-0.5 mb-4">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-safet-700">Overview</TabsTrigger>
          <TabsTrigger value="dosage" className="data-[state=active]:bg-white data-[state=active]:text-safet-700">Dosage</TabsTrigger>
          <TabsTrigger value="sideEffects" className="data-[state=active]:bg-white data-[state=active]:text-safet-700">Side Effects</TabsTrigger>
          <TabsTrigger value="warnings" className="data-[state=active]:bg-white data-[state=active]:text-safet-700">Warnings</TabsTrigger>
          <TabsTrigger value="interactions" className="data-[state=active]:bg-white data-[state=active]:text-safet-700">Interactions</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="mt-0">
          <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
            <div className="bg-safet-600 text-white px-5 py-3 font-medium">
              About {medication.name}
            </div>
            <div className="p-5">
              <p className="text-[#333333] leading-relaxed">{medication.description}</p>
              
              <div className="mt-6 bg-[#F5F9FD] p-4 rounded border border-[#D1DEE8]">
                <h3 className="font-medium text-safet-700 mb-2">Medical Uses</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {medication.usedFor.map((use, index) => (
                    <Badge key={index} className="bg-[#EBF2FA] text-safet-600 border-safet-200 hover:bg-safet-100">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center mt-6 text-safet-600">
                <TabletDecorative className="h-5 w-5 mr-2" />
                <span className="font-medium">Medication Class:</span>
                <span className="ml-2">{medication.drugClass || "Not specified"}</span>
              </div>
              
              {medication.drugsComUrl && (
                <div className="mt-6 pt-4 border-t border-gray-100">
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
        </TabsContent>

        {/* Dosage Tab Content */}
        <TabsContent value="dosage" className="mt-0">
          <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
            <div className="bg-safet-600 text-white px-5 py-3 font-medium">
              Dosage Information
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-[#F5F9FD] p-4 rounded border border-[#D1DEE8]">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-safet-600 mr-2" />
                  <h3 className="font-medium text-safet-700">Recommended Dosages</h3>
                </div>
                <div className="space-y-3">
                  <div className="pb-3 border-b border-gray-100">
                    <p className="font-medium text-gray-700">Adult:</p>
                    <p className="text-gray-600 mt-1">{medication.dosage.adult}</p>
                  </div>
                  
                  {medication.dosage.child && (
                    <div className="pb-3 border-b border-gray-100">
                      <p className="font-medium text-gray-700">Children:</p>
                      <p className="text-gray-600 mt-1">{medication.dosage.child}</p>
                    </div>
                  )}
                  
                  {medication.dosage.elderly && (
                    <div>
                      <p className="font-medium text-gray-700">Elderly:</p>
                      <p className="text-gray-600 mt-1">{medication.dosage.elderly}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-[#F5F9FD] p-4 rounded border border-[#D1DEE8]">
                <div className="flex items-center mb-2">
                  <Info className="h-5 w-5 text-safet-600 mr-2" />
                  <h3 className="font-medium text-safet-700">How to Take</h3>
                </div>
                <p className="text-gray-600">
                  Follow your doctor's directions exactly. Do not take more or less than prescribed. 
                  {medication.name} is typically taken {medication.dosage.frequency || "as directed"}.
                </p>
              </div>
              
              <Alert className="bg-[#EBF2FA] border-safet-200">
                <Info className="h-4 w-4 text-safet-600" />
                <AlertDescription className="text-[#666666]">
                  Dosage information provided for educational purposes only. Follow your doctor's specific instructions.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        {/* Side Effects Tab Content */}
        <TabsContent value="sideEffects" className="mt-0">
          <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
            <div className="bg-safet-600 text-white px-5 py-3 font-medium">
              Side Effects
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-[#F5F9FD] p-4 rounded border border-[#D1DEE8]">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="font-medium text-gray-700">Common Side Effects</h3>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[#333333]">
                  {medication.sideEffects.slice(0, Math.ceil(medication.sideEffects.length / 2)).map((effect, index) => (
                    <li key={index} className="text-gray-600">{effect}</li>
                  ))}
                </ul>
              </div>

              {medication.sideEffects.length > 2 && (
                <div className="bg-[#FFF8E6] p-4 rounded border border-[#FFECC7]">
                  <div className="flex items-center mb-4">
                    <ShieldAlert className="h-5 w-5 text-amber-600 mr-2" />
                    <h3 className="font-medium text-gray-700">Serious Side Effects</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[#333333]">
                    {medication.sideEffects.slice(Math.ceil(medication.sideEffects.length / 2)).map((effect, index) => (
                      <li key={index} className="text-gray-600">{effect}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Alert className="bg-[#EBF2FA] border-safet-200">
                <Info className="h-4 w-4 text-safet-600" />
                <AlertDescription className="text-[#666666]">
                  This is not a complete list of side effects. Contact your doctor if you experience any unexpected symptoms.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        {/* Warnings Tab Content */}
        <TabsContent value="warnings" className="mt-0">
          <div className="bg-white border border-[#E6B8B5] rounded-md overflow-hidden">
            <div className="bg-[#C42B1C] text-white px-5 py-3 font-medium">
              Important Warnings
            </div>
            <div className="p-5 bg-[#FEF5F4] space-y-4">
              <div className="space-y-2">
                {medication.warnings.map((warning, index) => (
                  <div key={index} className="flex">
                    <AlertTriangle className="h-5 w-5 text-[#C42B1C] mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-[#8A2A20]">{warning}</p>
                  </div>
                ))}
              </div>
              
              <Alert className="mt-4 bg-[#FEF5F4] border-[#E6B8B5]">
                <AlertTriangle className="h-4 w-4 text-[#C42B1C]" />
                <AlertDescription className="text-[#8A2A20]">
                  These warnings are not comprehensive. Read medication guide and consult healthcare provider.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        {/* Interactions Tab Content */}
        <TabsContent value="interactions" className="mt-0">
          <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
            <div className="bg-[#ED9121] text-white px-5 py-3 font-medium">
              Drug Interactions
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-[#FFF8E6] p-4 rounded border border-[#FFECC7]">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-5 w-5 text-[#ED9121] mr-2" />
                  <h3 className="font-medium text-gray-700">May Interact With:</h3>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[#333333]">
                  {medication.interactions.map((interaction, index) => (
                    <li key={index} className="text-gray-600">{interaction}</li>
                  ))}
                </ul>
              </div>
              
              <Alert className="mt-4 bg-[#FFF8E6] border-[#FFECC7]">
                <AlertTriangle className="h-4 w-4 text-[#ED9121]" />
                <AlertDescription className="text-[#8A6D3B]">
                  This list is not all-inclusive. Provide a full list of medications to your healthcare provider.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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

export default MedicationInfo;
