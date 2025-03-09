
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Filter, ArrowUpDown, FileText, Clock, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalProfileChangesLog from './MedicalProfileChangesLog';
import { getChangeLogs } from '@/utils/changeLog';

interface MedicalProfileTabProps {
  completionPercentage: number;
}

const MedicalProfileTab: React.FC<MedicalProfileTabProps> = ({ completionPercentage }) => {
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [activeTab, setActiveTab] = useState<'sections' | 'logs'>('sections');
  const [hasChangeLogs, setHasChangeLogs] = useState(false);
  
  // Check if there are any change logs
  useEffect(() => {
    const logs = getChangeLogs();
    setHasChangeLogs(logs.length > 0);
  }, []);
  
  // Mock data for last updated timestamps
  const lastUpdated = {
    personal: '2023-10-15T14:30:00Z',
    basic: '2023-10-20T10:15:00Z',
    history: '2023-11-20T09:45:00Z',
    medications: '2023-12-05T16:20:00Z',
    allergies: '2024-01-10T11:15:00Z',
  };
  
  // Get formatted relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };
  
  // Mock data for section completion status
  const sectionStatus = {
    personal: 100,
    basic: 90,
    history: 75,
    medications: 100,
    allergies: 60,
  };
  
  const sections = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic details, emergency contacts, and insurance information',
      link: '/profile/personal',
      status: sectionStatus.personal,
      lastUpdated: lastUpdated.personal,
    },
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Height, weight, blood type, and other essential health metrics',
      link: '/profile/basic',
      status: sectionStatus.basic,
      lastUpdated: lastUpdated.basic,
    },
    {
      id: 'history',
      title: 'Medical History',
      description: 'Past diagnoses, hospitalizations, surgeries, and conditions',
      link: '/profile/history',
      status: sectionStatus.history,
      lastUpdated: lastUpdated.history,
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Current prescriptions, supplements, and over-the-counter medications',
      link: '/profile/medications',
      status: sectionStatus.medications,
      lastUpdated: lastUpdated.medications,
    },
    {
      id: 'allergies',
      title: 'Allergies & Immunizations',
      description: 'Allergic reactions and vaccination history',
      link: '/profile/allergies',
      status: sectionStatus.allergies,
      lastUpdated: lastUpdated.allergies,
    },
  ];
  
  const filteredSections = sections.filter(section => {
    if (filter === 'all') return true;
    if (filter === 'complete') return section.status === 100;
    if (filter === 'incomplete') return section.status < 100;
    return true;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
          <p className="text-gray-600 text-sm mt-1">
            {completionPercentage < 100 ? (
              <>Complete your medical profile</>
            ) : (
              <>Your comprehensive health record</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/profile/personal">
                  <Button className="bg-safet-500 hover:bg-safet-600">
                    {completionPercentage > 0 ? "Edit Information" : "Complete Profile"}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Update your medical information using our new section editor</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {completionPercentage === 0 ? (
        <div className="py-10 text-center" aria-label="Empty medical profile">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safet-50 mb-4">
            <ClipboardCheck className="h-8 w-8 text-safet-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Time to complete your medical profile
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Add your comprehensive medical information section by section to ensure healthcare providers have what they need in an emergency.
          </p>
          <Link to="/profile/personal">
            <Button className="bg-safet-500 hover:bg-safet-600">
              Start Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {hasChangeLogs && (
            <Tabs 
              defaultValue="sections" 
              className="w-full" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'sections' | 'logs')}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="sections" className="flex items-center">
                  <ClipboardCheck className="h-4 w-4 mr-2" /> Information Sections
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center">
                  <History className="h-4 w-4 mr-2" /> Change History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="sections">
                <SectionsTab 
                  completionPercentage={completionPercentage} 
                  filter={filter} 
                  setFilter={setFilter} 
                  filteredSections={filteredSections} 
                  getRelativeTime={getRelativeTime} 
                />
              </TabsContent>
              <TabsContent value="logs">
                <MedicalProfileChangesLog />
              </TabsContent>
            </Tabs>
          )}
          
          {!hasChangeLogs && (
            <SectionsTab 
              completionPercentage={completionPercentage} 
              filter={filter} 
              setFilter={setFilter} 
              filteredSections={filteredSections} 
              getRelativeTime={getRelativeTime} 
            />
          )}
          
          <div className="text-center pt-3 flex justify-center gap-4">
            <Link to="/profile/view">
              <Button 
                variant="outline" 
                className="text-safet-700 border-safet-200 hover:bg-safet-50 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                View Full Medical Record
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Extracted sections tab into a separate component for clarity
const SectionsTab: React.FC<{
  completionPercentage: number;
  filter: 'all' | 'incomplete' | 'complete';
  setFilter: (filter: 'all' | 'incomplete' | 'complete') => void;
  filteredSections: any[];
  getRelativeTime: (dateString: string) => string;
}> = ({ completionPercentage, filter, setFilter, filteredSections, getRelativeTime }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Progress 
            value={completionPercentage} 
            max={100} 
            className="w-32 h-2 bg-gray-100" 
            aria-label={`Profile ${completionPercentage}% complete`}
          />
          <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilter(filter === 'incomplete' ? 'all' : 'incomplete')}
                  aria-pressed={filter === 'incomplete'}
                  className={filter === 'incomplete' ? 'bg-safet-50 border-safet-200 text-safet-700' : ''}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Incomplete
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Show incomplete sections</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilter(filter === 'complete' ? 'all' : 'complete')}
                  aria-pressed={filter === 'complete'}
                  className={filter === 'complete' ? 'bg-safet-50 border-safet-200 text-safet-700' : ''}
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Show completed sections</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Preview of medical information sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Medical information sections">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <div 
              key={section.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-safet-200 transition-colors"
              role="listitem"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                <Badge 
                  variant="outline" 
                  className={section.status === 100 ? 
                    'bg-green-50 text-green-700 border-green-200' : 
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }
                >
                  {section.status === 100 ? 'Complete' : `${section.status}%`}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-3">{section.description}</p>
              
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <Clock className="h-3 w-3 mr-1" />
                Last updated: {getRelativeTime(section.lastUpdated)}
              </div>
              
              {section.status < 100 && (
                <div className="w-full bg-gray-200 h-1 rounded mb-3">
                  <div 
                    className="bg-safet-500 h-1 rounded"
                    style={{ width: `${section.status}%` }}
                    aria-hidden="true"
                  />
                </div>
              )}
              
              <div className="flex justify-end">
                <Link to={section.link}>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs hover:bg-safet-50 hover:text-safet-700"
                  >
                    {section.status === 0 ? 'Add Information' : 'View & Edit'}
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No sections match your filter.</p>
            <Button 
              variant="link" 
              onClick={() => setFilter('all')}
              className="text-safet-600 mt-2"
            >
              Show all sections
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default MedicalProfileTab;
