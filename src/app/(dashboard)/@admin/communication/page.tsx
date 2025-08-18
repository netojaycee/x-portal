"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  List,
  MapPin,
  Clock,
  Users,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import EventForm from "./(components)/EventForm";
import Calendar from "./(components)/Calendar";
import { useGetEventsQuery, useDeleteEventMutation } from "@/redux/api";
import { toast } from "sonner";

const CommunicationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("list");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: eventsData,
    isLoading,
    refetch,
  } = useGetEventsQuery({
    q: searchQuery,
    month: selectedMonth.toString(),
    year: selectedYear.toString(),
    limit: 50,
  });

  const [deleteEvent] = useDeleteEventMutation();

  const events = eventsData?.data || [];

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      try {
        await deleteEvent(eventId).unwrap();
        toast.success("Event deleted successfully!");
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
    refetch();
  };

  const EventCard = ({ event }: { event: any }) => (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-start space-x-3'>
            <div
              className='w-4 h-4 rounded-full mt-1 flex-shrink-0'
              style={{ backgroundColor: event.color }}
            />
            <div className='flex-1'>
              <h3 className='font-semibold text-gray-900 mb-1'>
                {event.title}
              </h3>
              {event.description && (
                <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
                  {event.description}
                </p>
              )}
            </div>
          </div>
          <div className='flex items-center space-x-1'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleEditEvent(event)}
              className='h-8 w-8 p-0'
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteEvent(event.id, event.title)}
              className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='space-y-2 text-sm text-gray-600'>
          <div className='flex items-center space-x-2'>
            <CalendarIcon className='h-4 w-4' />
            <span>{format(new Date(event.eventDate), "PPP")}</span>
            {event.isAllDay && (
              <Badge variant='secondary' className='text-xs'>
                All Day
              </Badge>
            )}
          </div>

          {!event.isAllDay && (event.startTime || event.endTime) && (
            <div className='flex items-center space-x-2'>
              <Clock className='h-4 w-4' />
              <span>
                {event.startTime &&
                  format(new Date(`2000-01-01T${event.startTime}`), "h:mm a")}
                {event.startTime && event.endTime && " - "}
                {event.endTime &&
                  format(new Date(`2000-01-01T${event.endTime}`), "h:mm a")}
              </span>
            </div>
          )}

          {event.location && (
            <div className='flex items-center space-x-2'>
              <MapPin className='h-4 w-4' />
              <span>{event.location}</span>
            </div>
          )}

          {event.maxAttendees && (
            <div className='flex items-center space-x-2'>
              <Users className='h-4 w-4' />
              <span>Max {event.maxAttendees} attendees</span>
            </div>
          )}
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-3'>
            {event.tags.map((tag: string, index: number) => (
              <Badge key={index} variant='outline' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className='flex items-center justify-between mt-3 pt-3 border-t'>
          <div className='flex items-center space-x-2'>
            {event.isPublic && (
              <Badge variant='secondary' className='text-xs'>
                Public
              </Badge>
            )}
            {event.isRecurring && (
              <Badge variant='outline' className='text-xs'>
                Recurring
              </Badge>
            )}
          </div>
          <span className='text-xs text-gray-500'>
            Created {format(new Date(event.createdAt || Date.now()), "MMM d")}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const CalendarView = () => {
    const currentDate = new Date(selectedYear, selectedMonth - 1, 1);

    return (
      <Calendar
        events={events}
        selectedDate={currentDate}
        onDateClick={(date) => {
          // Could add functionality to create event on specific date
          console.log("Date clicked:", date);
        }}
        onEventClick={(event) => {
          handleEditEvent(event);
        }}
      />
    );
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Communication</h1>
          <p className='text-gray-600 mt-1'>Manage events and communications</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center space-x-2'>
              <Plus className='h-4 w-4' />
              <span>Add Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className='mb-6'>
        <CardContent className='p-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex-1 min-w-[200px]'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search events...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {format(new Date(2024, i, 1), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className='w-24'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-4'
      >
        <TabsList>
          <TabsTrigger value='list' className='flex items-center space-x-2'>
            <List className='h-4 w-4' />
            <span>List View</span>
          </TabsTrigger>
          <TabsTrigger value='calendar' className='flex items-center space-x-2'>
            <CalendarIcon className='h-4 w-4' />
            <span>Calendar View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='list' className='space-y-4'>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='text-center'>
                <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
                <p className='text-gray-600'>Loading events...</p>
              </div>
            </div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className='text-center py-12'>
                <CalendarIcon className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No events found
                </h3>
                <p className='text-gray-600 mb-4'>
                  {searchQuery
                    ? "No events match your search criteria."
                    : "Get started by creating your first event."}
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='calendar'>
          <CalendarView />
        </TabsContent>
      </Tabs>

      {/* Edit Event Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm
            eventData={editingEvent}
            isEdit={true}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingEvent(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunicationPage;
