
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';

// Define schema for immunization entries
const immunizationSchema = z.object({
  name: z.string().min(1, "Vaccine name is required"),
  date: z.string().optional(),
  notes: z.string().optional(),
});

// Define the schema for form validation
const formSchema = z.object({
  immunizationHistory: z.array(immunizationSchema).optional(),
  otherImmunizationNotes: z.string().optional(),
});

const MedicalProfileImmunizationsForm = () => {
  const { profileData, updateSectionData } = useMedicalProfile();
  
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      immunizationHistory: [],
      otherImmunizationNotes: "",
    },
  });

  const [immunizationEntries, setImmunizationEntries] = useState<
    Array<{ name: string; date?: string; notes?: string }>
  >([]);

  // Load saved form data when component mounts
  useEffect(() => {
    const formData = (window as any).immunizationsFormData || profileData.immunizations;
    
    if (formData) {
      form.reset({
        immunizationHistory: formData.immunizationHistory || [],
        otherImmunizationNotes: formData.otherImmunizationNotes || "",
      });
      
      setImmunizationEntries(formData.immunizationHistory || []);
    }
    
    // Listen for data loaded events
    const handleDataLoaded = () => {
      const updatedFormData = (window as any).immunizationsFormData;
      if (updatedFormData) {
        form.reset({
          immunizationHistory: updatedFormData.immunizationHistory || [],
          otherImmunizationNotes: updatedFormData.otherImmunizationNotes || "",
        });
        
        setImmunizationEntries(updatedFormData.immunizationHistory || []);
      }
    };
    
    window.addEventListener('immunizationsDataLoaded', handleDataLoaded);
    
    return () => {
      window.removeEventListener('immunizationsDataLoaded', handleDataLoaded);
    };
  }, [form, profileData.immunizations]);

  // Update window object on form changes for auto-save
  useEffect(() => {
    const subscription = form.watch((formValues) => {
      if (formValues) {
        (window as any).immunizationsFormData = {
          ...(window as any).immunizationsFormData,
          ...formValues,
        };
        
        // Also update the context
        updateSectionData('immunizations', {
          ...(window as any).immunizationsFormData
        });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, updateSectionData]);

  // Handle adding a new immunization entry
  const handleAddImmunization = () => {
    setImmunizationEntries([
      ...immunizationEntries,
      { name: "", date: "", notes: "" },
    ]);
    
    // Update form values
    const currentHistory = form.getValues().immunizationHistory || [];
    form.setValue("immunizationHistory", [
      ...currentHistory, 
      { name: "", date: "", notes: "" }
    ]);
  };

  // Handle removing an immunization entry
  const handleRemoveImmunization = (index: number) => {
    const updatedEntries = [...immunizationEntries];
    updatedEntries.splice(index, 1);
    setImmunizationEntries(updatedEntries);
    
    // Update form values
    const currentHistory = form.getValues().immunizationHistory || [];
    const updatedHistory = [...currentHistory];
    updatedHistory.splice(index, 1);
    form.setValue("immunizationHistory", updatedHistory);
  };

  // Handle immunization entry field changes
  const handleImmunizationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedEntries = [...immunizationEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value,
    };
    setImmunizationEntries(updatedEntries);
    
    // Update form values
    const currentHistory = form.getValues().immunizationHistory || [];
    const updatedHistory = [...currentHistory];
    updatedHistory[index] = {
      ...updatedHistory[index],
      [field]: value,
    };
    form.setValue("immunizationHistory", updatedHistory, { shouldDirty: true });
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Immunizations & Vaccines</h3>

          {/* Immunization History Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium">Immunization History</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImmunization}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Vaccine
              </Button>
            </div>

            {immunizationEntries.length === 0 ? (
              <p className="text-gray-500 text-sm italic mb-3">
                No immunizations added yet. Click "Add Vaccine" to begin.
              </p>
            ) : (
              <div className="space-y-3">
                {immunizationEntries.map((entry, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-medium">Vaccine #{index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImmunization(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel className="text-sm">Vaccine Name</FormLabel>
                          <Input
                            placeholder="e.g., COVID-19, Tetanus, Influenza"
                            className="mt-1"
                            value={entry.name}
                            onChange={(e) =>
                              handleImmunizationChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <FormLabel className="text-sm">Date Received</FormLabel>
                          <Input
                            type="date"
                            className="mt-1"
                            value={entry.date}
                            onChange={(e) =>
                              handleImmunizationChange(
                                index,
                                "date",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <FormLabel className="text-sm">Notes</FormLabel>
                          <Textarea
                            placeholder="Additional information, reactions, etc."
                            className="mt-1"
                            value={entry.notes}
                            onChange={(e) =>
                              handleImmunizationChange(
                                index,
                                "notes",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <FormField
              control={form.control}
              name="otherImmunizationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional information about your immunization history"
                      className="h-24"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Update window object and context
                        const currentFormData = (window as any).immunizationsFormData || {};
                        (window as any).immunizationsFormData = {
                          ...currentFormData,
                          otherImmunizationNotes: e.target.value
                        };
                        
                        // Also update context
                        updateSectionData('immunizations', (window as any).immunizationsFormData);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default MedicalProfileImmunizationsForm;
