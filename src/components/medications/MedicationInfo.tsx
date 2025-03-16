
import React from 'react';
import { Card } from '@/components/ui/card';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, AlertTriangle, Check, Info, Pill } from 'lucide-react';

interface MedicationInfoProps {
  medication: MedicationInfoType;
}

const MedicationInfo: React.FC<MedicationInfoProps> = ({ medication }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D1DEE8] rounded-xl overflow-hidden">
        <div className="bg-safet-600 text-white px-6 py-4">
          <div className="flex items-center">
            <Pill className="h-6 w-6 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">{medication.name}</h1>
              {medication.genericName && medication.genericName !== medication.name && (
                <p className="text-white/80 mt-1">
                  Generic name: {medication.genericName}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Overview</h2>
              <p className="text-gray-700 mb-4">
                {medication.description}
              </p>
              
              {medication.drugClass && (
                <div className="mt-3">
                  <span className="font-medium text-gray-700">Drug class: </span>
                  <span className="text-gray-600">{medication.drugClass}</span>
                </div>
              )}
              
              {medication.usedFor && medication.usedFor.length > 0 && (
                <div className="mt-3">
                  <span className="font-medium text-gray-700">Used for: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {medication.usedFor.map((use, index) => (
                      <Badge key={index} className="bg-safet-50 text-safet-700 border-safet-100">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {medication.drugsComUrl && (
                <div className="mt-4">
                  <a 
                    href={medication.drugsComUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-safet-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Read more on Drugs.com
                  </a>
                </div>
              )}
            </div>
            
            <div>
              <Card className="p-4 bg-gray-50 border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3">Quick Information</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium w-24 text-gray-700">Rx Status:</span>
                    <span className="text-gray-600">
                      {medication.name.toLowerCase().includes('prescription') ? 'Prescription only' : 'Available OTC'}
                    </span>
                  </li>
                  {medication.drugClass && (
                    <li className="flex items-start">
                      <span className="font-medium w-24 text-gray-700">Drug Class:</span>
                      <span className="text-gray-600">{medication.drugClass}</span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <span className="font-medium w-24 text-gray-700">Format:</span>
                    <span className="text-gray-600">Tablet, Capsule</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Dosage Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="h-5 w-5 text-safet-500 mr-2" />
              Dosage Information
            </h2>
            
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> The following information is a guideline only. Always follow your doctor's specific instructions for your condition.
              </p>
            </div>
            
            <div className="space-y-4">
              {medication.dosage && (
                <>
                  {medication.dosage.adult && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Adult Dosage:</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {medication.dosage.adult}
                      </p>
                    </div>
                  )}
                  
                  {medication.dosage.child && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Child Dosage:</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {medication.dosage.child}
                      </p>
                    </div>
                  )}
                  
                  {medication.dosage.elderly && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Elderly Dosage:</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {medication.dosage.elderly}
                      </p>
                    </div>
                  )}
                  
                  {medication.dosage.frequency && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Typical Frequency:</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {medication.dosage.frequency}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Side Effects */}
          {medication.sideEffects && medication.sideEffects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                Side Effects
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medication.sideEffects.map((effect, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mt-1 mr-3 text-amber-500">•</div>
                    <div className="text-gray-700">{effect}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-md p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Note:</strong> This is not a complete list of side effects and others may occur. Call your doctor for medical advice about side effects.
                </p>
              </div>
            </div>
          )}
          
          <Separator className="my-6" />
          
          {/* Warnings */}
          {medication.warnings && medication.warnings.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Warnings and Precautions
              </h2>
              
              <div className="space-y-3">
                {medication.warnings.map((warning, index) => (
                  <div key={index} className="bg-red-50 border border-red-100 rounded-md p-4">
                    <p className="text-red-700">{warning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Separator className="my-6" />
          
          {/* Drug Interactions */}
          {medication.interactions && medication.interactions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-purple-500 mr-2" />
                Drug Interactions
              </h2>
              
              <div className="bg-purple-50 border border-purple-100 rounded-md p-4 mb-4">
                <p className="text-purple-800 text-sm">
                  <strong>Important:</strong> Drug interactions may change how your medications work or increase your risk for serious side effects. This document does not contain all possible drug interactions. Keep a list of all the products you use and share it with your doctor and pharmacist.
                </p>
              </div>
              
              <div className="space-y-2">
                {medication.interactions.map((interaction, index) => (
                  <div key={index} className="flex items-start p-2 border-b border-gray-100">
                    <div className="mt-1 mr-3 text-purple-500">•</div>
                    <div className="text-gray-700">{interaction}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>The information provided here is for reference purposes only and should not be used for medical advice, diagnosis, or treatment.</p>
        <p className="mt-1">Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
      </div>
    </div>
  );
};

export default MedicationInfo;
