
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SectionDefinition {
  id: string;
  label: string;
}

interface ProfileSectionTabsProps {
  sections: SectionDefinition[];
  currentSection: string;
  hasMentalHealthHistory: string;
}

const ProfileSectionTabs: React.FC<ProfileSectionTabsProps> = ({
  sections,
  currentSection,
  hasMentalHealthHistory
}) => {
  return (
    <TabsList className="flex flex-col w-full h-auto p-0 bg-transparent space-y-1">
      {sections
        .filter(section => 
          !(section.id === 'mental' && hasMentalHealthHistory === 'no')
        )
        .map(section => (
          <TabsTrigger
            key={section.id}
            value={section.id}
            className="w-full justify-start text-left px-4 py-3 border-l-2 border-transparent data-[state=active]:border-l-safet-500 data-[state=active]:bg-safet-50 data-[state=active]:text-safet-700"
          >
            <div className="flex justify-between w-full items-center">
              <span>{section.label}</span>
            </div>
          </TabsTrigger>
        ))
      }
    </TabsList>
  );
};

export default ProfileSectionTabs;
