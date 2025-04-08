
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Calendar, Clock, FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Medication } from '@/types/medication';
import { formatDistanceToNow } from 'date-fns';

interface DiscontinuedMedicationsListProps {
  medications: Medication[];
  isEditing: boolean;
  onDelete: (id: string, isDiscontinued: boolean) => void;
}

const DiscontinuedMedicationsList: React.FC<DiscontinuedMedicationsListProps> = ({ 
  medications, 
  isEditing,
  onDelete
}) => {
  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <div className="space-y-4">
      {medications.map((medication) => (
        <Card key={medication.id} className="border-l-4 border-l-gray-400">
          <CardHeader className="py-4 px-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-lg font-medium text-gray-700">{medication.name}</CardTitle>
                <Badge variant="outline" className="ml-2 bg-gray-100">
                  Discontinued
                </Badge>
              </div>
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(medication.id, true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="bg-gray-100 text-gray-700">
                    {medication.dosage}
                  </Badge>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{medication.frequency}</span>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span><strong>For:</strong> {medication.reason}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span><strong>Used from:</strong> {medication.startDate} to {medication.endDate}</span>
                </p>
                
                <p className="text-sm text-gray-700 flex items-start gap-2 mt-2">
                  <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span><strong>Reason stopped:</strong> {medication.discontinuationReason}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DiscontinuedMedicationsList;
