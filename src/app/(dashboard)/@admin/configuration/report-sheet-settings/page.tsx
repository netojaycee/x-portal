"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  useGetClassesQuery,
  useGetAllReportSettingsQuery,
  useBulkSaveReportSettingsMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

// Interface for report settings per class
interface ClassReportSetting {
  id?: string;
  classId: string;
  className: string;
  paddingTopBottom: string;
  scoreHeaderFont: string;
  scoreSubjectFont: string;
  scoreValueFont: string;
  classTeacherCompute: boolean;
  showAge: boolean;
  showPosition: boolean;
  showNextTermFee: boolean;
}

export default function ReportSheetSettings() {
  const [classSettings, setClassSettings] = useState<ClassReportSetting[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery({});
  const { data: allReportSettings, isLoading: settingsLoading } = useGetAllReportSettingsQuery({});
  const [bulkSaveSettings, { isLoading: isSaving }] = useBulkSaveReportSettingsMutation();
  
  // Handle both response formats from API: { data: [...] } or directly the array
  const classes = useMemo(() => {
    return Array.isArray(classesData) ? classesData : classesData?.data || [];
  }, [classesData]);

  // Initialize class settings when classes are loaded
  useEffect(() => {
    if (classes.length && !settingsLoading) {
      // Get settings from API or create default settings for each class
      const existingSettings = allReportSettings?.data || allReportSettings || [];
      
      const initialSettings = classes.map((cls: any) => {
        // Find existing setting for this class
        const existingSetting = existingSettings.find((setting: any) => 
          setting.classId === cls.id
        );
        
        if (existingSetting) {
          return {
            ...existingSetting,
            // Ensure boolean fields are properly typed
            className: cls.name,
            classTeacherCompute: Boolean(existingSetting.classTeacherCompute),
            showAge: Boolean(existingSetting.showAge),
            showPosition: Boolean(existingSetting.showPosition),
            showNextTermFee: Boolean(existingSetting.showNextTermFee),
          };
        }
        
        // Default values for new setting
        return {
          classId: cls.id,
          className: cls.name,
          paddingTopBottom: "6",
          scoreHeaderFont: "7",
          scoreSubjectFont: "8",
          scoreValueFont: "4",
          classTeacherCompute: false,
          showAge: false,
          showPosition: true,
          showNextTermFee: true,
        };
      });
      
      setClassSettings(initialSettings);
    }
  }, [classes, allReportSettings, settingsLoading]);
  
  // Handle input changes for text fields
  const handleInputChange = (classId: string, field: keyof ClassReportSetting, value: string) => {
    setClassSettings(prev => 
      prev.map(setting => 
        setting.classId === classId 
          ? { ...setting, [field]: value }
          : setting
      )
    );
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (classId: string, field: keyof ClassReportSetting, checked: boolean) => {
    setClassSettings(prev => 
      prev.map(setting => 
        setting.classId === classId 
          ? { ...setting, [field]: checked }
          : setting
      )
    );
  };
  
  // Submit all settings
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const result = await bulkSaveSettings({ settings: classSettings }).unwrap();
      
      if (result.success) {
        toast.success("Report sheet settings saved successfully");
      } else {
        toast.error(result.message || "Failed to save report sheet settings");
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || "Failed to save report sheet settings";
      toast.error(errorMessage);
      console.error("Error saving report settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (classesLoading || settingsLoading) {
    return <LoaderComponent />;
  }
  
  return (
    <div className='space-y-4'>
      {/* Breadcrumb Navigation */}
      <div className='flex items-center space-x-0 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href='/configuration' className='text-primary'>
            Account Settings
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>Report Sheet Settings</p>
      </div>

      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Report Sheet Settings</h1>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || isSaving}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Report Sheet Display Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader className="bg-[#E6F0FA]">
                <TableRow>
                  <TableHead className="font-semibold text-center">Class</TableHead>
                  <TableHead className="font-semibold text-center">Padding Top & Bottom</TableHead>
                  <TableHead className="font-semibold text-center">Score Header Font</TableHead>
                  <TableHead className="font-semibold text-center">Score Subject Font</TableHead>
                  <TableHead className="font-semibold text-center">Score Value Font</TableHead>
                  <TableHead className="font-semibold text-center">Class Teacher Compute Unassessed</TableHead>
                  <TableHead className="font-semibold text-center">Show Age</TableHead>
                  <TableHead className="font-semibold text-center">Show Position</TableHead>
                  <TableHead className="font-semibold text-center">Show Next Term Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classSettings.map((setting) => (
                  <TableRow key={setting.classId}>
                    <TableCell className="text-center">{setting.className}</TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="text"
                        className="w-24 h-9 text-center border border-gray-300 rounded"
                        value={setting.paddingTopBottom}
                        onChange={(e) => handleInputChange(setting.classId, 'paddingTopBottom', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="text"
                        className="w-24 h-9 text-center border border-gray-300 rounded"
                        value={setting.scoreHeaderFont}
                        onChange={(e) => handleInputChange(setting.classId, 'scoreHeaderFont', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="text"
                        className="w-24 h-9 text-center border border-gray-300 rounded"
                        value={setting.scoreSubjectFont}
                        onChange={(e) => handleInputChange(setting.classId, 'scoreSubjectFont', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="text"
                        className="w-24 h-9 text-center border border-gray-300 rounded"
                        value={setting.scoreValueFont}
                        onChange={(e) => handleInputChange(setting.classId, 'scoreValueFont', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={setting.classTeacherCompute}
                        onCheckedChange={(checked) => handleCheckboxChange(setting.classId, 'classTeacherCompute', !!checked)}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={setting.showAge}
                        onCheckedChange={(checked) => handleCheckboxChange(setting.classId, 'showAge', !!checked)}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={setting.showPosition}
                        onCheckedChange={(checked) => handleCheckboxChange(setting.classId, 'showPosition', !!checked)}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={setting.showNextTermFee}
                        onCheckedChange={(checked) => handleCheckboxChange(setting.classId, 'showNextTermFee', !!checked)}
                        className="mx-auto"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}