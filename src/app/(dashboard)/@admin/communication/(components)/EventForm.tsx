"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCreateEventMutation, useUpdateEventMutation } from "@/redux/api";

interface EventFormProps {
  eventData?: any;
  isEdit?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const eventColors = [
  { name: "Blue", value: "#3B82F6", bg: "bg-blue-500" },
  { name: "Green", value: "#10B981", bg: "bg-green-500" },
  { name: "Purple", value: "#8B5CF6", bg: "bg-purple-500" },
  { name: "Red", value: "#EF4444", bg: "bg-red-500" },
  { name: "Orange", value: "#F59E0B", bg: "bg-orange-500" },
  { name: "Pink", value: "#EC4899", bg: "bg-pink-500" },
  { name: "Indigo", value: "#6366F1", bg: "bg-indigo-500" },
  { name: "Teal", value: "#14B8A6", bg: "bg-teal-500" },
];

const EventForm: React.FC<EventFormProps> = ({
  eventData,
  isEdit = false,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    // startTime: "",
    // endTime: "",
    // location: "",
    color: "#3B82F6",
    // isAllDay: false,
    // isRecurring: false,
    // recurringType: "",
    // maxAttendees: "",
    // isPublic: true,
    // tags: "",
    // reminder: "15", // minutes before event
  });

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  useEffect(() => {
    if (eventData && isEdit) {
      setFormData({
        title: eventData.name || "",
        description: eventData.eventDescription || "",
        startDate: eventData.startDate
          ? new Date(eventData.startDate)
          : undefined,
        endDate: eventData.endDate
          ? new Date(eventData.endDate)
          : undefined,
        // startTime: eventData.startTime || "",
        // endTime: eventData.endTime || "",
        // location: eventData.location || "",
        color: eventData.eventColor || "#3B82F6",
        // isAllDay: eventData.isAllDay || false,
        // isRecurring: eventData.isRecurring || false,
        // recurringType: eventData.recurringType || "",
        // maxAttendees: eventData.maxAttendees || "",
        // isPublic: eventData.isPublic !== undefined ? eventData.isPublic : true,
        // tags: eventData.tags || "",
        // reminder: eventData.reminder || "15",
      });
    }
  }, [eventData, isEdit]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!formData.endDate) {
      toast.error("End date is required");
      return;
    }

    // if (!formData.isAllDay && (!formData.startTime || !formData.endTime)) {
    //   toast.error(
    //     "Start time and end time are required for non-all-day events"
    //   );
    //   return;
    // }

    try {
      const eventPayload = {
        // ...formData,
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
        eventColor: formData?.color,
        name: formData?.title,
        eventDescription: formData?.description,
        // maxAttendees: formData.maxAttendees
        //   ? parseInt(formData.maxAttendees)
        //   : null,
        // tags: formData.tags
        //   ? formData.tags.split(",").map((tag) => tag.trim())
        //   : [],
      };

      console.log(eventPayload, "eenvet payload")

      if (isEdit && eventData?.id) {
        await updateEvent({ id: eventData.id, data: eventPayload }).unwrap();
        toast.success("Event updated successfully!");
      } else {
        await createEvent(eventPayload).unwrap();
        toast.success("Event created successfully!");
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save event");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Basic Information */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='md:col-span-2'>
          <Label htmlFor='title' className='text-sm font-medium text-gray-700'>
            Event Title *
          </Label>
          <Input
            id='title'
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder='Enter event title'
            className='mt-1'
            required
          />
        </div>

        <div className='md:col-span-2'>
          <Label
            htmlFor='description'
            className='text-sm font-medium text-gray-700'
          >
            Description
          </Label>
          <Textarea
            id='description'
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder='Enter event description'
            rows={4}
            className='mt-1'
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label className='text-sm font-medium text-gray-700'>
            Start Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={formData.startDate}
                onSelect={(date) => handleInputChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className='text-sm font-medium text-gray-700'>
            End Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={formData.endDate}
                onSelect={(date) => handleInputChange("endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* <div>
          <Label
            htmlFor='startTime'
            className='text-sm font-medium text-gray-700'
          >
            Start Time
          </Label>
          <div className='relative mt-1'>
            <Clock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              id='startTime'
              type='time'
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              className='pl-10'
              disabled={formData.isAllDay}
            />
          </div>
        </div> */}

        {/* <div>
          <Label
            htmlFor='endTime'
            className='text-sm font-medium text-gray-700'
          >
            End Time
          </Label>
          <div className='relative mt-1'>
            <Clock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              id='endTime'
              type='time'
              value={formData.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              className='pl-10'
              disabled={formData.isAllDay}
            />
          </div>
        </div> */}
      </div>

      {/* All Day Event Checkbox */}
      {/* <div className='flex items-center space-x-2'>
        <Checkbox
          id='isAllDay'
          checked={formData.isAllDay}
          onCheckedChange={(checked) => handleInputChange("isAllDay", checked)}
        />
        <Label htmlFor='isAllDay' className='text-sm font-medium text-gray-700'>
          All-day event
        </Label>
      </div> */}

      {/* Location and Attendees */}
      {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <Label
            htmlFor='location'
            className='text-sm font-medium text-gray-700'
          >
            Location
          </Label>
          <div className='relative mt-1'>
            <MapPin className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              id='location'
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder='Enter event location'
              className='pl-10'
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor='maxAttendees'
            className='text-sm font-medium text-gray-700'
          >
            Max Attendees
          </Label>
          <div className='relative mt-1'>
            <Users className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              id='maxAttendees'
              type='number'
              value={formData.maxAttendees}
              onChange={(e) =>
                handleInputChange("maxAttendees", e.target.value)
              }
              placeholder='No limit'
              className='pl-10'
              min='1'
            />
          </div>
        </div>
      </div> */}

      {/* Event Color */}
      <div>
        <Label className='text-sm font-medium text-gray-700'>Event Color</Label>
        <div className='flex flex-wrap gap-3 mt-2'>
          {eventColors.map((color) => (
            <button
              key={color.value}
              type='button'
              onClick={() => handleInputChange("color", color.value)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                color.bg,
                formData.color === color.value
                  ? "border-gray-900 scale-110"
                  : "border-gray-300 hover:scale-105"
              )}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Additional Options */}
      {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <Label htmlFor='tags' className='text-sm font-medium text-gray-700'>
            Tags
          </Label>
          <Input
            id='tags'
            value={formData.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
            placeholder='Enter tags separated by commas'
            className='mt-1'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Separate multiple tags with commas
          </p>
        </div>

        <div>
          <Label
            htmlFor='reminder'
            className='text-sm font-medium text-gray-700'
          >
            Reminder
          </Label>
          <Select
            value={formData.reminder}
            onValueChange={(value) => handleInputChange("reminder", value)}
          >
            <SelectTrigger className='mt-1'>
              <SelectValue placeholder='Select reminder time' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>No reminder</SelectItem>
              <SelectItem value='5'>5 minutes before</SelectItem>
              <SelectItem value='15'>15 minutes before</SelectItem>
              <SelectItem value='30'>30 minutes before</SelectItem>
              <SelectItem value='60'>1 hour before</SelectItem>
              <SelectItem value='1440'>1 day before</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      {/* Checkboxes */}
      {/* <div className='space-y-3'>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='isPublic'
            checked={formData.isPublic}
            onCheckedChange={(checked) =>
              handleInputChange("isPublic", checked)
            }
          />
          <Label
            htmlFor='isPublic'
            className='text-sm font-medium text-gray-700'
          >
            Public event (visible to all users)
          </Label>
        </div>

        <div className='flex items-center space-x-2'>
          <Checkbox
            id='isRecurring'
            checked={formData.isRecurring}
            onCheckedChange={(checked) =>
              handleInputChange("isRecurring", checked)
            }
          />
          <Label
            htmlFor='isRecurring'
            className='text-sm font-medium text-gray-700'
          >
            Recurring event
          </Label>
        </div>

        {formData.isRecurring && (
          <div className='ml-6'>
            <Label
              htmlFor='recurringType'
              className='text-sm font-medium text-gray-700'
            >
              Repeat
            </Label>
            <Select
              value={formData.recurringType}
              onValueChange={(value) =>
                handleInputChange("recurringType", value)
              }
            >
              <SelectTrigger className='mt-1 w-48'>
                <SelectValue placeholder='Select frequency' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='daily'>Daily</SelectItem>
                <SelectItem value='weekly'>Weekly</SelectItem>
                <SelectItem value='monthly'>Monthly</SelectItem>
                <SelectItem value='yearly'>Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div> */}

      {/* Form Actions */}
      <div className='flex justify-end space-x-4 pt-6 border-t'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading} className='min-w-[120px]'>
          {isLoading ? (
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              <span>{isEdit ? "Updating..." : "Creating..."}</span>
            </div>
          ) : isEdit ? (
            "Update Event"
          ) : (
            "Create Event"
          )}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
