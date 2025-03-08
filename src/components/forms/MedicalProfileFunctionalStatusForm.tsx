
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MedicalProfileFunctionalStatusForm = () => {
  const [hasPhysicalLimitations, setHasPhysicalLimitations] = useState(false);
  const [usesAssistiveDevices, setUsesAssistiveDevices] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Activities of Daily Living</h3>
        <p className="text-sm text-gray-600 mb-4">
          This information helps providers understand your current level of functioning and independence.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adlStatus">Basic Activities of Daily Living</Label>
            <Select>
              <SelectTrigger id="adlStatus">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="independent">Fully Independent - No assistance needed</SelectItem>
                <SelectItem value="minimal">Minimal Assistance - Need help with 1-2 activities</SelectItem>
                <SelectItem value="moderate">Moderate Assistance - Need help with several activities</SelectItem>
                <SelectItem value="maximum">Maximum Assistance - Need help with most activities</SelectItem>
                <SelectItem value="dependent">Fully Dependent - Need help with all activities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 my-2">
            <Checkbox 
              id="hasPhysicalLimitations" 
              checked={hasPhysicalLimitations}
              onCheckedChange={(checked) => setHasPhysicalLimitations(checked as boolean)} 
            />
            <Label htmlFor="hasPhysicalLimitations" className="text-sm font-medium cursor-pointer">
              I have physical limitations that affect my daily activities
            </Label>
          </div>
          
          {hasPhysicalLimitations && (
            <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
              <div className="space-y-2">
                <Label>Activities That Require Assistance (Check all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bathing" />
                    <Label htmlFor="bathing" className="text-sm">Bathing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dressing" />
                    <Label htmlFor="dressing" className="text-sm">Dressing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="toileting" />
                    <Label htmlFor="toileting" className="text-sm">Toileting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="transferring" />
                    <Label htmlFor="transferring" className="text-sm">Transferring (bed/chair)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="continence" />
                    <Label htmlFor="continence" className="text-sm">Continence</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="feeding" />
                    <Label htmlFor="feeding" className="text-sm">Feeding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="walking" />
                    <Label htmlFor="walking" className="text-sm">Walking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="stairs" />
                    <Label htmlFor="stairs" className="text-sm">Climbing Stairs</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="limitationsDetails">Details of Limitations</Label>
                <Textarea 
                  id="limitationsDetails" 
                  placeholder="Please describe the nature and extent of your limitations"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="iadlStatus">Instrumental Activities of Daily Living</Label>
            <Select>
              <SelectTrigger id="iadlStatus">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="independent">Fully Independent - No assistance needed</SelectItem>
                <SelectItem value="minimal">Minimal Assistance - Need help with 1-2 activities</SelectItem>
                <SelectItem value="moderate">Moderate Assistance - Need help with several activities</SelectItem>
                <SelectItem value="maximum">Maximum Assistance - Need help with most activities</SelectItem>
                <SelectItem value="dependent">Fully Dependent - Need help with all activities</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-xs text-gray-500 mt-1">
              Instrumental activities include: managing finances, shopping, meal preparation, housekeeping, medication management, using transportation, using telephone/communication devices
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="iadlDetails">Details of Instrumental Activities</Label>
            <Textarea 
              id="iadlDetails" 
              placeholder="Please describe any specific instrumental activities that you need help with"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Mobility & Assistive Devices</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobilityStatus">Mobility Status</Label>
            <Select>
              <SelectTrigger id="mobilityStatus">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="independent">Fully Mobile - No limitations</SelectItem>
                <SelectItem value="limited">Limited Mobility - Some difficulty but independent</SelectItem>
                <SelectItem value="assistedDevice">Mobile with Assistive Device</SelectItem>
                <SelectItem value="assistedPerson">Requires Assistance from Another Person</SelectItem>
                <SelectItem value="wheelchair">Primarily Uses Wheelchair</SelectItem>
                <SelectItem value="bedbound">Primarily Bed-Bound</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 my-2">
            <Checkbox 
              id="usesAssistiveDevices" 
              checked={usesAssistiveDevices}
              onCheckedChange={(checked) => setUsesAssistiveDevices(checked as boolean)} 
            />
            <Label htmlFor="usesAssistiveDevices" className="text-sm font-medium cursor-pointer">
              I use assistive devices or mobility aids
            </Label>
          </div>
          
          {usesAssistiveDevices && (
            <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
              <div className="space-y-2">
                <Label>Assistive Devices Used (Check all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cane" />
                    <Label htmlFor="cane" className="text-sm">Cane</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="walker" />
                    <Label htmlFor="walker" className="text-sm">Walker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wheelchair" />
                    <Label htmlFor="wheelchair" className="text-sm">Wheelchair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scooter" />
                    <Label htmlFor="scooter" className="text-sm">Scooter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="prosthesis" />
                    <Label htmlFor="prosthesis" className="text-sm">Prosthesis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hearingAid" />
                    <Label htmlFor="hearingAid" className="text-sm">Hearing Aid</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="glasses" />
                    <Label htmlFor="glasses" className="text-sm">Glasses/Contact Lenses</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dentures" />
                    <Label htmlFor="dentures" className="text-sm">Dentures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="grabBars" />
                    <Label htmlFor="grabBars" className="text-sm">Grab Bars/Safety Rails</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="liftChair" />
                    <Label htmlFor="liftChair" className="text-sm">Lift Chair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hospitalBed" />
                    <Label htmlFor="hospitalBed" className="text-sm">Hospital Bed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="otherDevice" />
                    <Label htmlFor="otherDevice" className="text-sm">Other</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deviceDetails">Device Details</Label>
                <Textarea 
                  id="deviceDetails" 
                  placeholder="Please provide any additional details about your assistive devices"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Living Arrangements & Home Environment</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="livingArrangement">Current Living Arrangement</Label>
            <Select>
              <SelectTrigger id="livingArrangement">
                <SelectValue placeholder="Select arrangement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alone">Live Alone</SelectItem>
                <SelectItem value="spouse">Live with Spouse/Partner</SelectItem>
                <SelectItem value="family">Live with Family</SelectItem>
                <SelectItem value="roommates">Live with Roommates</SelectItem>
                <SelectItem value="assistedLiving">Assisted Living Facility</SelectItem>
                <SelectItem value="nursingHome">Nursing Home</SelectItem>
                <SelectItem value="group">Group Home</SelectItem>
                <SelectItem value="homeless">Currently Homeless or Unstable Housing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="homeType">Type of Home</Label>
            <Select>
              <SelectTrigger id="homeType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">Single-Family House</SelectItem>
                <SelectItem value="apartment">Apartment/Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="mobile">Mobile Home</SelectItem>
                <SelectItem value="facility">Care Facility</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="homeAccess">Home Accessibility</Label>
            <Select>
              <SelectTrigger id="homeAccess">
                <SelectValue placeholder="Select accessibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fullyAccessible">Fully Accessible - No barriers</SelectItem>
                <SelectItem value="partiallyAccessible">Partially Accessible - Some modifications</SelectItem>
                <SelectItem value="minimally">Minimally Accessible - Significant barriers</SelectItem>
                <SelectItem value="notAccessible">Not Accessible - Major barriers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="homeBarriers">Home Barriers or Challenges</Label>
            <Textarea 
              id="homeBarriers" 
              placeholder="Describe any challenges in your home environment (e.g., stairs, bathroom access, narrow doorways)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caregivers">Available Caregivers</Label>
            <Textarea 
              id="caregivers" 
              placeholder="List any caregivers who assist you, their relationship to you, and how often they provide assistance"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Quality of Life</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qualityOfLife">Overall Quality of Life</Label>
            <Select>
              <SelectTrigger id="qualityOfLife">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="veryGood">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="satisfactionAreas">Areas of Satisfaction</Label>
            <Textarea 
              id="satisfactionAreas" 
              placeholder="Describe aspects of your life that you find satisfying or enjoyable"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="improvementAreas">Areas for Improvement</Label>
            <Textarea 
              id="improvementAreas" 
              placeholder="Describe aspects of your life that you would like to improve"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goals">Personal Goals</Label>
            <Textarea 
              id="goals" 
              placeholder="Describe any personal goals related to your health, functioning, or independence"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="additionalFunctional">Additional Information</Label>
          <Textarea 
            id="additionalFunctional" 
            placeholder="Any additional information about your functional status you would like your healthcare providers to know"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileFunctionalStatusForm;
