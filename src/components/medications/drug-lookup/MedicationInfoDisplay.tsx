
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Pill, AlertTriangle, RotateCcw, PlusCircle, X, Database, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicationInfo } from '@/utils/medicationData.d';

interface MedicationInfoDisplayProps {
  medicationInfo: MedicationInfo | null;
  selectedMedication: string | null;
  onResetSearch: () => void;
  onAddToProfile: () => void;
  canAddToProfile: boolean;
  isLoading: boolean;
  error: string | null;
  dataSource: string;
  onOpenExternalLink: () => void;
}

const MedicationInfoDisplay: React.FC<MedicationInfoDisplayProps> = ({
  medicationInfo,
  selectedMedication,
  onResetSearch,
  onAddToProfile,
  canAddToProfile,
  isLoading,
  error,
  dataSource,
  onOpenExternalLink,
}) => {
  if (isLoading) return null;
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <p className="text-red-700">{error}</p>
        </CardContent>
        <CardFooter className="bg-red-50/50 flex justify-between">
          <Button variant="outline" onClick={onResetSearch} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Another Search
          </Button>
          <Button variant="outline" onClick={onOpenExternalLink} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Search on Drugs.com
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!medicationInfo) return null;

  return (
    <Card>
      <CardHeader className="bg-safet-50">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-safet-500" />
              <CardTitle>{medicationInfo.name}</CardTitle>
              {medicationInfo.fromDatabase && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Archive className="h-3 w-3 mr-1" />
                  From Database
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1 flex items-center gap-2">
              <span>Source: {dataSource}</span>
              {medicationInfo.genericName && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>Generic: {medicationInfo.genericName}</span>
                </>
              )}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onResetSearch}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="overview">
          <TabsList className="w-full bg-gray-50 p-0 rounded-none">
            <TabsTrigger value="overview" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-safet-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="dosage" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-safet-500">
              Dosage
            </TabsTrigger>
            <TabsTrigger value="precautions" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-safet-500">
              Precautions
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-safet-500">
              Interactions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-4">
            <div className="space-y-4">
              {medicationInfo.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-700">{medicationInfo.description}</p>
                </div>
              )}
              
              {medicationInfo.drugClass && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Drug Class</h3>
                  <p className="text-gray-700">{medicationInfo.drugClass}</p>
                </div>
              )}
              
              {medicationInfo.usedFor && medicationInfo.usedFor.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Used For</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {medicationInfo.usedFor.map((use, index) => (
                      <li key={index}>{use}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {medicationInfo.forms && medicationInfo.forms.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Available Forms</h3>
                  <div className="flex flex-wrap gap-1">
                    {medicationInfo.forms.map((form, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        {form}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="dosage" className="p-4">
            <div className="space-y-4">
              {medicationInfo.dosage?.adult && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Adult Dosage</h3>
                  <p className="text-gray-700">{medicationInfo.dosage.adult}</p>
                </div>
              )}
              
              {medicationInfo.dosage?.child && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Child Dosage</h3>
                  <p className="text-gray-700">{medicationInfo.dosage.child}</p>
                </div>
              )}
              
              {medicationInfo.dosage?.elderly && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Elderly Dosage</h3>
                  <p className="text-gray-700">{medicationInfo.dosage.elderly}</p>
                </div>
              )}
              
              {medicationInfo.dosage?.frequency && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Frequency</h3>
                  <p className="text-gray-700">{medicationInfo.dosage.frequency}</p>
                </div>
              )}
              
              {(!medicationInfo.dosage?.adult && !medicationInfo.dosage?.child && !medicationInfo.dosage?.elderly && !medicationInfo.dosage?.frequency) && (
                <p className="text-gray-500 italic">No specific dosage information available. Please consult your healthcare provider.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="precautions" className="p-4">
            <div className="space-y-4">
              {medicationInfo.warnings && medicationInfo.warnings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Warnings</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {medicationInfo.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {medicationInfo.pregnancy && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Pregnancy</h3>
                  <p className="text-gray-700">{medicationInfo.pregnancy}</p>
                </div>
              )}
              
              {medicationInfo.breastfeeding && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Breastfeeding</h3>
                  <p className="text-gray-700">{medicationInfo.breastfeeding}</p>
                </div>
              )}
              
              {medicationInfo.sideEffects && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Side Effects</h3>
                  
                  {medicationInfo.sideEffects.common && medicationInfo.sideEffects.common.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-xs font-medium text-gray-500">Common:</h4>
                      <ul className="list-disc pl-5 text-gray-700">
                        {medicationInfo.sideEffects.common.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {medicationInfo.sideEffects.serious && medicationInfo.sideEffects.serious.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-red-500">Serious:</h4>
                      <ul className="list-disc pl-5 text-gray-700">
                        {medicationInfo.sideEffects.serious.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {medicationInfo.sideEffects.rare && medicationInfo.sideEffects.rare.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">Rare:</h4>
                      <ul className="list-disc pl-5 text-gray-700">
                        {medicationInfo.sideEffects.rare.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="interactions" className="p-4">
            <div className="space-y-4">
              {medicationInfo.interactions && medicationInfo.interactions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Drug Interactions</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {medicationInfo.interactions.map((interaction, index) => (
                      <li key={index}>{interaction}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {medicationInfo.foodInteractions && medicationInfo.foodInteractions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Food Interactions</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {medicationInfo.foodInteractions.map((interaction, index) => (
                      <li key={index}>{interaction}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {medicationInfo.conditionInteractions && medicationInfo.conditionInteractions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Condition Interactions</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {medicationInfo.conditionInteractions.map((interaction, index) => (
                      <li key={index}>{interaction}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {medicationInfo.therapeuticDuplications && medicationInfo.therapeuticDuplications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Therapeutic Duplications</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {medicationInfo.therapeuticDuplications.map((duplication, index) => (
                      <li key={index}>{duplication}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(!medicationInfo.interactions || medicationInfo.interactions.length === 0) && 
               (!medicationInfo.foodInteractions || medicationInfo.foodInteractions.length === 0) &&
               (!medicationInfo.conditionInteractions || medicationInfo.conditionInteractions.length === 0) &&
               (!medicationInfo.therapeuticDuplications || medicationInfo.therapeuticDuplications.length === 0) && (
                <p className="text-gray-500 italic">No specific interaction information available. Please consult your healthcare provider.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-safet-50/50 flex justify-between">
        <Button variant="outline" onClick={onResetSearch} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          New Search
        </Button>
        
        <div className="flex gap-2">
          {canAddToProfile && (
            <Button onClick={onAddToProfile} className="bg-safet-500 hover:bg-safet-600 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add to My Medications
            </Button>
          )}
          
          <Button variant="outline" onClick={onOpenExternalLink} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            View on Drugs.com
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MedicationInfoDisplay;
