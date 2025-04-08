import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  Plus, 
  RotateCcw, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  Info,
  Pill,
  Clock,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { MedicationInfo } from '@/utils/medicationData.d';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface MedicationInfoDisplayProps {
  medicationInfo: MedicationInfo | null;
  selectedMedication: string | null;
  isLoading: boolean;
  error: string | null;
  canAddToProfile: boolean;
  dataSource?: string;
  onResetSearch: () => void;
  onAddToProfile: () => void;
  onOpenExternalLink?: () => void;
}

const MedicationInfoDisplay: React.FC<MedicationInfoDisplayProps> = ({
  medicationInfo,
  selectedMedication,
  isLoading,
  error,
  canAddToProfile,
  dataSource = "Drugs.com",
  onResetSearch,
  onAddToProfile,
  onOpenExternalLink
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['description']);

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

  const isLiveSource = dataSource.toLowerCase().includes('live');

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const renderInteractionClassification = () => {
    if (!medicationInfo.interactionClassifications) return null;
    
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 italic mb-2">
          These classifications are only a guideline. The relevance of a particular drug interaction to a specific 
          individual is difficult to determine. Always consult your healthcare provider.
        </p>
        
        {medicationInfo.interactionClassifications.major && medicationInfo.interactionClassifications.major.length > 0 && (
          <div className="mb-2">
            <h4 className="text-sm font-medium text-red-700 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Major
            </h4>
            <p className="text-xs text-gray-500">
              Highly clinically significant. Avoid combinations; the risk of the interaction outweighs the benefit.
            </p>
            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
              {medicationInfo.interactionClassifications.major.map((interaction, idx) => (
                <li key={idx}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {medicationInfo.interactionClassifications.moderate && medicationInfo.interactionClassifications.moderate.length > 0 && (
          <div className="mb-2">
            <h4 className="text-sm font-medium text-amber-700 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Moderate
            </h4>
            <p className="text-xs text-gray-500">
              Moderately clinically significant. Usually avoid combinations; use it only under special circumstances.
            </p>
            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
              {medicationInfo.interactionClassifications.moderate.map((interaction, idx) => (
                <li key={idx}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {medicationInfo.interactionClassifications.minor && medicationInfo.interactionClassifications.minor.length > 0 && (
          <div className="mb-2">
            <h4 className="text-sm font-medium text-blue-700">Minor</h4>
            <p className="text-xs text-gray-500">
              Minimally clinically significant. Minimize risk; assess risk and consider an alternative drug, take 
              steps to circumvent the interaction risk and/or institute a monitoring plan.
            </p>
            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
              {medicationInfo.interactionClassifications.minor.map((interaction, idx) => (
                <li key={idx}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {medicationInfo.interactionClassifications.unknown && medicationInfo.interactionClassifications.unknown.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Unknown</h4>
            <p className="text-xs text-gray-500">No interaction data available.</p>
            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
              {medicationInfo.interactionClassifications.unknown.map((interaction, idx) => (
                <li key={idx}>{interaction}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-safet-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            {medicationInfo.name}
            <Badge className={`ml-2 ${isLiveSource ? 'bg-green-100 text-green-600' : 'bg-safet-100 text-safet-600'} hover:bg-safet-200 hover:text-safet-700`}>
              {dataSource}
            </Badge>
            {medicationInfo.prescriptionOnly && (
              <Badge className="ml-2 bg-blue-100 text-blue-600 hover:bg-blue-200">Rx Only</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {onOpenExternalLink && (
              <Button 
                onClick={onOpenExternalLink}
                variant="outline"
                size="sm"
                className="text-gray-500 hover:text-safet-600"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View on Drugs.com
              </Button>
            )}
            <Button onClick={onResetSearch} variant="ghost" size="sm" className="text-gray-500">
              <RotateCcw className="h-4 w-4 mr-1" />
              New Search
            </Button>
          </div>
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
        <div className="space-y-1">
          {isLiveSource && (
            <div className="p-3 bg-green-50 rounded-md border border-green-200 text-green-800 text-sm mb-4">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-green-600" />
                This information is being fetched in real-time from our medication database.
              </p>
            </div>
          )}

          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-2">
            <AccordionItem value="description" className="border rounded-md px-2">
              <AccordionTrigger className="py-3">
                <span className="text-sm font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Description
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <p className="text-sm text-gray-600">{medicationInfo.description}</p>
              </AccordionContent>
            </AccordionItem>

            {medicationInfo.usedFor && medicationInfo.usedFor.length > 0 && (
              <AccordionItem value="usedFor" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Used For
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <div className="flex flex-wrap gap-1">
                    {medicationInfo.usedFor.map((use, index) => (
                      <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.dosage && (
              <AccordionItem value="dosage" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <Pill className="h-4 w-4 mr-2" />
                    Dosage
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
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
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.sideEffects && (
              <AccordionItem value="sideEffects" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Side Effects
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  {medicationInfo.sideEffects.common && medicationInfo.sideEffects.common.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500">Common:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {medicationInfo.sideEffects.common.map((effect, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {medicationInfo.sideEffects.serious && medicationInfo.sideEffects.serious.length > 0 && (
                    <div>
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Serious:
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {medicationInfo.sideEffects.serious.map((effect, index) => (
                          <Badge key={index} className="bg-red-50 text-red-700 border-red-100">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.warnings && medicationInfo.warnings.length > 0 && (
              <AccordionItem value="warnings" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Warnings
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <ScrollArea className="h-24 w-full">
                    <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                      {medicationInfo.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.interactions && medicationInfo.interactions.length > 0 && (
              <AccordionItem value="interactions" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Drug Interactions
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <ScrollArea className="h-24 w-full">
                    <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                      {medicationInfo.interactions.map((interaction, index) => (
                        <li key={index}>{interaction}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.foodInteractions && medicationInfo.foodInteractions.length > 0 && (
              <AccordionItem value="foodInteractions" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Food Interactions
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <ScrollArea className="h-24 w-full">
                    <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                      {medicationInfo.foodInteractions.map((interaction, index) => (
                        <li key={index}>{interaction}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.conditionInteractions && medicationInfo.conditionInteractions.length > 0 && (
              <AccordionItem value="conditionInteractions" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Medical Condition Interactions
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <ScrollArea className="h-24 w-full">
                    <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                      {medicationInfo.conditionInteractions.map((interaction, index) => (
                        <li key={index}>{interaction}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.therapeuticDuplications && medicationInfo.therapeuticDuplications.length > 0 && (
              <AccordionItem value="therapeuticDuplications" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Therapeutic Duplications
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <ScrollArea className="h-24 w-full">
                    <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                      {medicationInfo.therapeuticDuplications.map((duplication, index) => (
                        <li key={index}>{duplication}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.interactionClassifications && (
              <AccordionItem value="interactionClassifications" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Drug Interaction Classification
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  {renderInteractionClassification()}
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.pregnancy && (
              <AccordionItem value="pregnancy" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Pregnancy
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <p className="text-sm text-gray-600">{medicationInfo.pregnancy}</p>
                </AccordionContent>
              </AccordionItem>
            )}

            {medicationInfo.breastfeeding && (
              <AccordionItem value="breastfeeding" className="border rounded-md px-2">
                <AccordionTrigger className="py-3">
                  <span className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Breastfeeding
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <p className="text-sm text-gray-600">{medicationInfo.breastfeeding}</p>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        {canAddToProfile && (
          <div className="pt-5">
            <Button 
              onClick={onAddToProfile} 
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to My Medications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationInfoDisplay;
