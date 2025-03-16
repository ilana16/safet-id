
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Edit } from 'lucide-react';

interface ProfileSectionHeaderProps {
  title: string;
  isEditing: boolean;
  isSaving: boolean;
  showEditControls: boolean;
  toggleEditMode: () => void;
  saveCurrentSectionData: () => void;
}

const ProfileSectionHeader: React.FC<ProfileSectionHeaderProps> = ({
  title,
  isEditing,
  isSaving,
  showEditControls,
  toggleEditMode,
  saveCurrentSectionData
}) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <h2 className="text-lg font-medium text-gray-900">
        {title}
      </h2>
      
      {showEditControls && (
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Button 
              onClick={saveCurrentSectionData} 
              className="bg-safet-500 hover:bg-safet-600 text-white"
              size="sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
              {!isSaving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          ) : (
            <Button 
              onClick={toggleEditMode} 
              variant="outline"
              size="sm"
              className="text-safet-600 border-safet-300 hover:bg-safet-50"
            >
              Edit
              <Edit className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileSectionHeader;
