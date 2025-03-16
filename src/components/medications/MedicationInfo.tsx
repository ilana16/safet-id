
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  AlertCircle, 
  Info, 
  Pill, 
  Clock, 
  UserCheck,
  ThumbsUp,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';

interface MedicationInfoProps {
  info: MedicationInfoType;
}

const MedicationInfo: React.FC<MedicationInfoProps> = ({ info }) => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-safet-50 border-b border-gray-200">
        <CardTitle className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{info.name}</h2>
            {info.genericName && (
              <p className="text-sm text-gray-600 mt-1">Generic: {info.genericName}</p>
            )}
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {info.drugClass || 'Medication'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <Info className="h-5 w-5 mr-2 text-safet-600" />
            Overview
          </h3>
          <p className="text-gray-700">{info.description}</p>
          
          {info.usedFor && info.usedFor.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Used For:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {info.usedFor.map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {info.dosage && (
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <Pill className="h-5 w-5 mr-2 text-safet-600" />
              Dosage Information
            </h3>
            
            {info.dosage.adult && (
              <div className="mb-2">
                <h4 className="font-medium text-gray-900">Adult Dosage:</h4>
                <p className="text-gray-700">{info.dosage.adult}</p>
              </div>
            )}
            
            {info.dosage.child && (
              <div className="mb-2">
                <h4 className="font-medium text-gray-900">Child Dosage:</h4>
                <p className="text-gray-700">{info.dosage.child}</p>
              </div>
            )}
            
            {info.dosage.elderly && (
              <div className="mb-2">
                <h4 className="font-medium text-gray-900">Elderly Dosage:</h4>
                <p className="text-gray-700">{info.dosage.elderly}</p>
              </div>
            )}
            
            {info.dosage.frequency && (
              <div>
                <h4 className="font-medium text-gray-900">Frequency:</h4>
                <p className="text-gray-700">{info.dosage.frequency}</p>
              </div>
            )}
          </div>
        )}
        
        {info.sideEffects && info.sideEffects.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              Side Effects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {info.sideEffects.map((effect, index) => (
                <div key={index} className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{effect}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {info.warnings && info.warnings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Warnings & Precautions
            </h3>
            <ul className="space-y-2">
              {info.warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {info.interactions && info.interactions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <UserX className="h-5 w-5 mr-2 text-red-500" />
              Drug Interactions
            </h3>
            <ul className="space-y-2">
              {info.interactions.map((interaction, index) => (
                <li key={index} className="flex items-start">
                  <UserX className="h-4 w-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{interaction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t border-gray-200 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Source: {info.source || 'Drugs.com'}
        </div>
        
        {info.drugsComUrl && (
          <a
            href={info.drugsComUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-safet-600 hover:underline"
          >
            <span>More information on Drugs.com</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default MedicationInfo;
