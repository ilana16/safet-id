import React from 'react';
import { Card } from '@/components/ui/card';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, AlertTriangle, Info, Pill, Clock, ShieldCheck } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

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

              {medication.pregnancy && (
                <div className="mt-3">
                  <span className="font-medium text-gray-700">Pregnancy category: </span>
                  <span className="text-gray-600">{medication.pregnancy}</span>
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
                  {medication.drugClass && (
                    <li className="flex items-start">
                      <span className="font-medium w-24 text-gray-700">Drug Class:</span>
                      <span className="text-gray-600">{medication.drugClass}</span>
                    </li>
                  )}
                  {medication.halfLife && (
                    <li className="flex items-start">
                      <span className="font-medium w-24 text-gray-700">Half Life:</span>
                      <span className="text-gray-600">{medication.halfLife}</span>
                    </li>
                  )}
                  {medication.controlledSubstance && (
                    <li className="flex items-start">
                      <span className="font-medium w-24 text-gray-700">Controlled:</span>
                      <span className="text-gray-600">{medication.controlledSubstance}</span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <span className="font-medium w-24 text-gray-700">Format:</span>
                    <span className="text-gray-600">{medication.forms && medication.forms.length > 0 
                      ? medication.forms.join(', ') 
                      : 'Tablet, Capsule'}
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Dosage Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-safet-500 mr-2" />
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

                  {medication.dosage.renal && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Renal Dose Adjustment:</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {medication.dosage.renal}
                      </p>
                    </div>
                  )}

                  {medication.dosage.hepatic && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Hepatic Dose Adjustment:</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {medication.dosage.hepatic}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Side Effects */}
          {medication.sideEffects && Object.keys(medication.sideEffects).length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                Side Effects
              </h2>
              
              <div className="bg-amber-50 border border-amber-100 rounded-md p-4 mb-4">
                <p className="text-amber-800 text-sm">
                  <strong>Note:</strong> This is not a complete list of side effects and others may occur. Call your doctor for medical advice about side effects.
                </p>
              </div>

              <div className="space-y-4">
                {medication.sideEffects.common && medication.sideEffects.common.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Common Side Effects:</h3>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {medication.sideEffects.common.map((effect, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mt-1 mr-2 text-amber-500">•</div>
                            <div className="text-gray-700">{effect}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {medication.sideEffects.serious && medication.sideEffects.serious.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Serious Side Effects:</h3>
                    <div className="bg-red-50 p-3 rounded-md border border-red-100">
                      <div className="space-y-2">
                        {medication.sideEffects.serious.map((effect, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mt-1 mr-2 text-red-500">•</div>
                            <div className="text-red-700">{effect}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {medication.sideEffects.rare && medication.sideEffects.rare.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Rare Side Effects:</h3>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {medication.sideEffects.rare.map((effect, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mt-1 mr-2 text-purple-500">•</div>
                            <div className="text-gray-700">{effect}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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

              {medication.blackBoxWarning && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Black Box Warning:</h3>
                  <div className="bg-black text-white p-4 rounded-md border border-gray-900">
                    <p>{medication.blackBoxWarning}</p>
                  </div>
                </div>
              )}
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
              
              {medication.interactionSeverity && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">Interaction Severity</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4">Severity</TableHead>
                        <TableHead>Medications</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medication.interactionSeverity.major && (
                        <TableRow>
                          <TableCell className="font-medium bg-red-50 text-red-700">Major</TableCell>
                          <TableCell>{medication.interactionSeverity.major.join(', ')}</TableCell>
                        </TableRow>
                      )}
                      {medication.interactionSeverity.moderate && (
                        <TableRow>
                          <TableCell className="font-medium bg-amber-50 text-amber-700">Moderate</TableCell>
                          <TableCell>{medication.interactionSeverity.moderate.join(', ')}</TableCell>
                        </TableRow>
                      )}
                      {medication.interactionSeverity.minor && (
                        <TableRow>
                          <TableCell className="font-medium bg-green-50 text-green-700">Minor</TableCell>
                          <TableCell>{medication.interactionSeverity.minor.join(', ')}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              
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

          {/* Pharmacokinetics Information */}
          {medication.pharmacokinetics && (
            <div className="mt-6">
              <Separator className="my-6" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                Pharmacokinetics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medication.pharmacokinetics.absorption && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Absorption:</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                      {medication.pharmacokinetics.absorption}
                    </p>
                  </div>
                )}
                
                {medication.pharmacokinetics.distribution && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Distribution:</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                      {medication.pharmacokinetics.distribution}
                    </p>
                  </div>
                )}
                
                {medication.pharmacokinetics.metabolism && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Metabolism:</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                      {medication.pharmacokinetics.metabolism}
                    </p>
                  </div>
                )}
                
                {medication.pharmacokinetics.elimination && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Elimination:</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                      {medication.pharmacokinetics.elimination}
                    </p>
                  </div>
                )}
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
