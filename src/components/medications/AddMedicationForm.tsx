
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, Search, Loader2, X } from 'lucide-react';
import { searchDrugsCom } from '@/utils/drugsComApi';
import { toast } from '@/lib/toast';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import { getSectionWindowKey } from '@/utils/saveHelpers';

const AddMedicationSchema = z.object({
  name: z.string().min(2, "Medication name is required"),
  dosage: z.string().optional(),
  unit: z.string().optional(),
  form: z.string().optional(),
  reason: z.string().optional(),
  schedule: z.string().optional(),
  type: z.enum(['prescription', 'otc', 'supplement']),
  withFood: z.enum(['with', 'without', 'either', 'other']).default('either'),
  notes: z.string().optional()
});

type AddMedicationFormValues = z.infer<typeof AddMedicationSchema>;

interface AddMedicationFormProps {
  onComplete: () => void;
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ onComplete }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { loadSection, updateSectionData } = useMedicalProfile();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<AddMedicationFormValues>({
    resolver: zodResolver(AddMedicationSchema),
    defaultValues: {
      type: 'prescription',
      withFood: 'either'
    }
  });

  const medicationName = watch('name');
  const selectedType = watch('type');

  useEffect(() => {
    // Set the medication name in the form when query changes
    if (query && query.length > 0) {
      setValue('name', query);
    }
  }, [query, setValue]);

  useEffect(() => {
    // Handle medicine search
    const handleSearch = async () => {
      if (query.length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      setShowSearchResults(true);

      try {
        const results = await searchDrugsCom(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching medications:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const searchTimeout = setTimeout(handleSearch, 300);
    return () => clearTimeout(searchTimeout);
  }, [query]);

  const selectMedication = (drugName: string) => {
    setQuery(drugName);
    setValue('name', drugName);
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setQuery('');
    setValue('name', '');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const onSubmit = async (data: AddMedicationFormValues) => {
    try {
      // Load existing medications data
      const existingData = loadSection('medications') || {};
      
      // Create the new medication object
      const newMed = {
        id: `med_${Date.now()}`,
        name: data.name,
        totalDosage: data.dosage || '',
        unit: data.unit || '',
        dosagePerPill: '',
        pillsPerDose: '1',
        form: data.form || '',
        customForm: '',
        withFood: data.withFood,
        type: data.type,
        brandName: '',
        reason: data.reason || '',
        notes: data.notes || '',
        doseTimes: [{
          id: `time_${Date.now()}`,
          time: data.schedule || ''
        }]
      };

      // Prepare the medications by type
      const medications = {
        prescriptions: [...(existingData.prescriptions || [])],
        otc: [...(existingData.otc || [])],
        supplements: [...(existingData.supplements || [])]
      };

      // Add the new medication to the appropriate category
      if (data.type === 'prescription') {
        medications.prescriptions.push(newMed);
      } else if (data.type === 'otc') {
        medications.otc.push(newMed);
      } else {
        medications.supplements.push(newMed);
      }

      // Update the medications in the context
      updateSectionData('medications', medications);

      // Update the window object for compatibility with other components
      const windowKey = getSectionWindowKey('medications');
      if (windowKey && (window as any)[windowKey]) {
        (window as any)[windowKey] = medications;
      }

      toast.success(`Added ${data.name} to your medication list`);
      onComplete();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="med-search">
          Medication Name <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="med-search"
            value={query}
            placeholder="Start typing to search for a medication..."
            onChange={(e) => setQuery(e.target.value)}
            className="pr-8"
            {...register('name')}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6 p-0"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {isSearching && (
            <div className="absolute right-10 top-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => selectMedication(result)}
                  >
                    <Pill className="h-4 w-4 text-safet-500 mr-2" />
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="med-type">
          Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedType}
          onValueChange={(value: any) => setValue('type', value)}
        >
          <SelectTrigger id="med-type" className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prescription">Prescription medication</SelectItem>
            <SelectItem value="otc">Over-the-counter medication</SelectItem>
            <SelectItem value="supplement">Vitamin or supplement</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="med-dosage">Dosage</Label>
          <div className="flex gap-2">
            <Input
              id="med-dosage"
              placeholder="e.g., 250"
              className="flex-1"
              {...register('dosage')}
            />
            <Select
              onValueChange={(value) => setValue('unit', value)}
            >
              <SelectTrigger id="med-unit" className="w-1/3">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mg">mg</SelectItem>
                <SelectItem value="mcg">mcg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="IU">IU</SelectItem>
                <SelectItem value="%">%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="med-form">Form</Label>
          <Select onValueChange={(value) => setValue('form', value)}>
            <SelectTrigger id="med-form">
              <SelectValue placeholder="Select form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="capsule">Capsule</SelectItem>
              <SelectItem value="liquid">Liquid</SelectItem>
              <SelectItem value="injection">Injection</SelectItem>
              <SelectItem value="patch">Patch</SelectItem>
              <SelectItem value="cream">Cream/Ointment</SelectItem>
              <SelectItem value="inhaler">Inhaler</SelectItem>
              <SelectItem value="drops">Drops</SelectItem>
              <SelectItem value="spray">Spray</SelectItem>
              <SelectItem value="powder">Powder</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="med-reason">Why are you taking this?</Label>
        <Textarea
          id="med-reason"
          placeholder="e.g., For high blood pressure, migraines, etc."
          className="resize-none"
          {...register('reason')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="med-schedule">When do you take it?</Label>
        <Input
          id="med-schedule"
          placeholder="e.g., Once daily, Twice daily, As needed"
          {...register('schedule')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="med-food">With or Without Food</Label>
        <Select
          defaultValue="either"
          onValueChange={(value: any) => setValue('withFood', value)}
        >
          <SelectTrigger id="med-food">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="with">With Food</SelectItem>
            <SelectItem value="without">Without Food</SelectItem>
            <SelectItem value="either">Either is Fine</SelectItem>
            <SelectItem value="other">Other/Special Instructions</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="med-notes">Notes</Label>
        <Textarea
          id="med-notes"
          placeholder="Any additional information about this medication"
          className="resize-none"
          {...register('notes')}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !medicationName}
          className="bg-safet-500 hover:bg-safet-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Add Medication'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddMedicationForm;
