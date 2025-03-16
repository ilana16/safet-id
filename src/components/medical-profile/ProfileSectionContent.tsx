
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ProfileSectionContentProps {
  children: React.ReactNode;
  isLoading: boolean;
  isEditing: boolean;
  showEditControls: boolean;
  isSaving: boolean;
  saveCurrentSectionData: () => void;
}

const ProfileSectionContent: React.FC<ProfileSectionContentProps> = ({
  children,
  isLoading,
  isEditing,
  showEditControls,
  isSaving,
  saveCurrentSectionData
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-safet-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-safet-100 rounded mb-3"></div>
          <div className="h-3 w-24 bg-safet-50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`p-6 ${showEditControls && !isEditing ? 'pointer-events-none opacity-90' : ''}`}>
        {children}
      </div>
      
      {showEditControls && isEditing && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <Button 
            onClick={saveCurrentSectionData} 
            className="bg-safet-500 hover:bg-safet-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
            {!isSaving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
    </>
  );
};

export default ProfileSectionContent;
