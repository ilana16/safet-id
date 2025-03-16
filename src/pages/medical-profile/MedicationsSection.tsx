
import React from 'react';
import DrugInfoLookup from '@/components/medications/DrugInfoLookup';

const MedicationsSection = ({ isEditing }: { isEditing?: boolean }) => {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">My Medications</h3>
          <p className="text-gray-500 text-sm mb-6">
            Search for medications to view detailed information and learn about their uses, side effects, and interactions.
          </p>
          
          <DrugInfoLookup />
        </div>
      </div>
    </div>
  );
};

export default MedicationsSection;
