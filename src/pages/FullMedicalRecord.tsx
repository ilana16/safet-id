
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { getChangeLogs } from '@/utils/changeLog';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ChangeLogEntry {
  section: string;
  timestamp: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
    formattedOldValue?: string;
    formattedNewValue?: string;
  }[];
}

const FullMedicalRecord = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [logs, setLogs] = useState<ChangeLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<ChangeLogEntry | null>(null);
  const [selectedChange, setSelectedChange] = useState<any | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    setUserData(JSON.parse(storedUser));
    
    // Get change logs
    const changeLogs = getChangeLogs();
    setLogs(changeLogs);
  }, [navigate]);

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
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return `${value.length} item(s)`;
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getSectionColor = (section: string): string => {
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
    
    return sectionColors[section] || 'bg-gray-100 text-gray-800';
  };
  
  const handleRestore = (change: any) => {
    try {
      // Get current medical profile
      const currentProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
      
      // Create updated profile by restoring the old value
      const updatedProfile = { ...currentProfile };
      
      // Navigate to section object if it doesn't exist
      if (!updatedProfile[selectedLog?.section || '']) {
        updatedProfile[selectedLog?.section || ''] = {};
      }
      
      // Set the value back to what it was
      const sectionData = updatedProfile[selectedLog?.section || ''];
      sectionData[change.field] = change.oldValue;
      
      // Save back to localStorage
      localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
      
      toast.success(`Successfully restored ${change.field} to previous value`);
      
      // Refresh logs
      setLogs(getChangeLogs());
    } catch (error) {
      console.error('Error restoring change:', error);
      toast.error('Failed to restore change');
    }
  };
  
  const filteredLogs = filter 
    ? logs.filter(log => log.section === filter)
    : logs;

  const uniqueSections = [...new Set(logs.map(log => log.section))];

  if (!userData) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Full Medical Record History
          </h1>
          <p className="text-gray-600 mt-1">
            Complete history of changes to {userData.firstName} {userData.lastName}'s medical record
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Medical Record Change History</CardTitle>
            <CardDescription>
              View all changes made to your medical profile and restore previous versions if needed
            </CardDescription>
            
            {uniqueSections.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pt-4 pb-2 max-w-full">
                <Badge 
                  variant="outline" 
                  className={!filter ? 'bg-gray-100' : 'hover:bg-gray-100'}
                  onClick={() => setFilter(null)}
                >
                  All Sections
                </Badge>
                {uniqueSections.map(section => (
                  <Badge 
                    key={section}
                    variant="outline" 
                    className={`${filter === section ? getSectionColor(section) : ''} hover:bg-gray-100 whitespace-nowrap cursor-pointer`}
                    onClick={() => setFilter(section)}
                  >
                    {getSectionDisplayName(section)}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          
          <CardContent>
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
              <div className="space-y-6">
                {filteredLogs.map((log, index) => (
                  <Card key={index} className="border-l-4" style={{ borderLeftColor: getSectionColor(log.section).includes('bg-') ? getSectionColor(log.section).replace('bg-', 'var(--') + ')' : 'var(--gray-200)' }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getSectionColor(log.section)}>
                          {getSectionDisplayName(log.section)}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {log.changes.map((change, changeIndex) => (
                          <div key={changeIndex} className="pb-4 border-b border-gray-100 last:border-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{change.field}</h4>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => {
                                      setSelectedLog(log);
                                      setSelectedChange(change);
                                    }}
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                    Restore
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Restore Previous Value</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to restore the previous value for {change.field}?
                                      This action will revert the field to its previous state.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-1 gap-2 py-4">
                                    <div className="bg-red-50 p-3 rounded border border-red-100 text-red-700 mb-2">
                                      <div className="text-xs text-red-500 mb-1">Current Value:</div>
                                      <div className="whitespace-pre-wrap break-words">
                                        {formatValue(change.newValue)}
                                      </div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded border border-green-100 text-green-700">
                                      <div className="text-xs text-green-500 mb-1">Value to Restore:</div>
                                      <div className="whitespace-pre-wrap break-words">
                                        {formatValue(change.oldValue)}
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button 
                                        onClick={() => handleRestore(change)}
                                        className="bg-safet-500 hover:bg-safet-600"
                                      >
                                        Restore Value
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              <div className="bg-red-50 p-2 rounded border border-red-100 text-red-700">
                                <div className="text-xs text-red-500 mb-1">Previous Value:</div>
                                <div className="text-sm whitespace-pre-wrap break-words">
                                  {formatValue(change.oldValue)}
                                </div>
                              </div>
                              <div className="bg-green-50 p-2 rounded border border-green-100 text-green-700">
                                <div className="text-xs text-green-500 mb-1">Changed To:</div>
                                <div className="text-sm whitespace-pre-wrap break-words">
                                  {formatValue(change.newValue)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="text-safet-700 border-safet-200 hover:bg-safet-50"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default FullMedicalRecord;
