import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Check, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Medication } from '@/types/medication';

interface InteractionsReportProps {
  medications: Medication[];
}

interface Interaction {
  medications: string[];
  severity: 'major' | 'moderate' | 'minor' | 'none';
  description: string;
}

const InteractionsReport: React.FC<InteractionsReportProps> = ({ medications }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateInteractions = () => {
      if (medications.length < 2) {
        setInteractions([]);
        return;
      }

      setIsLoading(true);
      
      // Simulate API call to drugs.com for interactions
      setTimeout(() => {
        // This is mock data - in a real app, you'd call a real drug interactions API
        const mockInteractions: Interaction[] = [];
        
        // Create some sample interactions between medications
        for (let i = 0; i < medications.length; i++) {
          for (let j = i + 1; j < medications.length; j++) {
            // Only create interactions for ~60% of combinations to make it realistic
            if (Math.random() > 0.4) {
              const severities: ('major' | 'moderate' | 'minor' | 'none')[] = ['major', 'moderate', 'minor', 'none'];
              const severity = severities[Math.floor(Math.random() * severities.length)];
              
              let description = '';
              switch (severity) {
                case 'major':
                  description = `Concurrent use of ${medications[i].name} and ${medications[j].name} may result in significant adverse effects. Monitor closely and consider alternative therapy.`;
                  break;
                case 'moderate':
                  description = `Concurrent use of ${medications[i].name} and ${medications[j].name} may result in increased side effects. Dosage adjustments may be necessary.`;
                  break;
                case 'minor':
                  description = `Minor interaction between ${medications[i].name} and ${medications[j].name}. Generally safe to use together but monitor for unusual symptoms.`;
                  break;
                case 'none':
                  description = `No significant interaction between ${medications[i].name} and ${medications[j].name}.`;
                  break;
              }
              
              mockInteractions.push({
                medications: [medications[i].name, medications[j].name],
                severity,
                description
              });
            }
          }
        }
        
        setInteractions(mockInteractions);
        setIsLoading(false);
      }, 1200);
    };
    
    generateInteractions();
  }, [medications]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'major':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'moderate':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'minor':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'none':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'major':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Major</Badge>;
      case 'moderate':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Moderate</Badge>;
      case 'minor':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Minor</Badge>;
      case 'none':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">None</Badge>;
      default:
        return null;
    }
  };

  if (medications.length < 2) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-gray-500">You need at least two medications to check for interactions.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-safet-500 rounded-full border-t-transparent mb-4"></div>
            <p className="text-gray-600">Analyzing potential interactions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (interactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <div className="flex justify-center mb-4">
            <Check className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-green-700 mb-2">No Known Interactions</h3>
          <p className="text-gray-600">
            No known interactions were found between your current medications.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Note: This is a simulated report. Always consult with your healthcare provider
            about potential drug interactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 italic">
        Based on your current medications, the following potential interactions were identified:
      </p>
      
      {interactions.map((interaction, index) => (
        <Card key={index} className="overflow-hidden">
          <div className={`
            px-4 py-3 border-b flex items-center justify-between 
            ${interaction.severity === 'major' ? 'bg-red-50' : ''}
            ${interaction.severity === 'moderate' ? 'bg-amber-50' : ''}
            ${interaction.severity === 'minor' ? 'bg-blue-50' : ''}
            ${interaction.severity === 'none' ? 'bg-green-50' : ''}
          `}>
            <div className="flex items-center gap-2">
              {getSeverityIcon(interaction.severity)}
              <span className="font-medium">{interaction.medications.join(' + ')}</span>
            </div>
            {getSeverityBadge(interaction.severity)}
          </div>
          <CardContent className="py-4">
            <p className="text-gray-700">{interaction.description}</p>
          </CardContent>
        </Card>
      ))}
      
      <div className="pt-4">
        <p className="text-xs text-gray-500">
          <strong>Disclaimer:</strong> This information is simulated and for demonstration purposes only. 
          In a real application, this would be sourced from Drugs.com or another reputable drug 
          interactions database. Always consult with your healthcare provider or pharmacist for 
          medical advice regarding your specific medications.
        </p>
      </div>
    </div>
  );
};

export default InteractionsReport;
