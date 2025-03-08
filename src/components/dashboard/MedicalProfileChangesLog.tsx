
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getChangeLogs } from '@/utils/changeLog';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Clock, Filter } from 'lucide-react';

interface ChangeLogEntry {
  section: string;
  timestamp: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

const MedicalProfileChangesLog = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const logs = getChangeLogs();
  
  const sectionColors: Record<string, string> = {
    'personal': 'bg-blue-100 text-blue-800',
    'history': 'bg-green-100 text-green-800',
    'medications': 'bg-purple-100 text-purple-800',
    'allergies': 'bg-yellow-100 text-yellow-800',
    'social': 'bg-orange-100 text-orange-800',
    'reproductive': 'bg-pink-100 text-pink-800',
    'mental': 'bg-indigo-100 text-indigo-800',
    'functional': 'bg-cyan-100 text-cyan-800',
    'cultural': 'bg-teal-100 text-teal-800',
    'preventative': 'bg-rose-100 text-rose-800',
  };
  
  const getSectionDisplayName = (section: string): string => {
    const sectionNames: Record<string, string> = {
      'personal': 'Personal Information',
      'history': 'Medical History',
      'medications': 'Medications',
      'allergies': 'Allergies & Immunizations',
      'social': 'Social History',
      'reproductive': 'Reproductive History',
      'mental': 'Mental Health',
      'functional': 'Functional Status',
      'cultural': 'Cultural Preferences',
      'preventative': 'Preventative Care',
    };
    
    return sectionNames[section] || section;
  };
  
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'Not provided';
    if (value === '') return 'Not provided';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };
  
  const filteredLogs = filter 
    ? logs.filter(log => log.section === filter)
    : logs;
    
  const uniqueSections = [...new Set(logs.map(log => log.section))];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Change History</h3>
          
          {uniqueSections.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 max-w-[60%]">
              <Badge 
                clickable
                variant="outline" 
                className={!filter ? 'bg-gray-100' : 'hover:bg-gray-100'}
                onClick={() => setFilter(null)}
              >
                All
              </Badge>
              {uniqueSections.map(section => (
                <Badge 
                  key={section}
                  clickable
                  variant="outline" 
                  className={`${filter === section ? sectionColors[section] : ''} hover:bg-gray-100 whitespace-nowrap`}
                  onClick={() => setFilter(section)}
                >
                  {getSectionDisplayName(section)}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No changes have been logged yet.</p>
            {filter && (
              <p className="mt-2 text-sm">
                Try selecting a different section filter or view all changes.
              </p>
            )}
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredLogs.map((log, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center text-left w-full">
                    <div className="flex items-center">
                      <Badge className={`mr-3 ${sectionColors[log.section] || 'bg-gray-100 text-gray-800'}`}>
                        {getSectionDisplayName(log.section)}
                      </Badge>
                      <span className="font-medium text-sm">
                        {log.changes.length} {log.changes.length === 1 ? 'change' : 'changes'}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1 sm:mt-0 sm:ml-auto">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-2 border-l-2 border-gray-200 space-y-3 pb-2">
                    {log.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="text-sm">
                        <span className="font-medium">{change.field}: </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                          <div className="bg-red-50 p-2 rounded border border-red-100 text-red-700">
                            <div className="text-xs text-red-500 mb-1">Previous Value:</div>
                            {formatValue(change.oldValue)}
                          </div>
                          <div className="bg-green-50 p-2 rounded border border-green-100 text-green-700">
                            <div className="text-xs text-green-500 mb-1">New Value:</div>
                            {formatValue(change.newValue)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalProfileChangesLog;
