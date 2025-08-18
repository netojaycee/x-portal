"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Tag,
  Bell,
  Globe,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { useGetEventByIdQuery, useDeleteEventMutation } from "@/redux/api";
import { toast } from "sonner";
import EventForm from "../(components)/EventForm";

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: eventData, isLoading, refetch } = useGetEventByIdQuery(eventId);
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const event = eventData?.data;

  const handleDeleteEvent = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${event?.title}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteEvent(eventId).unwrap();
        toast.success("Event deleted successfully!");
        router.push("/communication");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className='p-6 max-w-4xl mx-auto'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
            <p className='text-gray-600'>Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className='p-6 max-w-4xl mx-auto'>
        <Card>
          <CardContent className='text-center py-12'>
            <CalendarIcon className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Event not found
            </h3>
            <p className='text-gray-600 mb-4'>
              The event you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </p>
            <Button onClick={() => router.push("/communication")}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            onClick={() => router.push("/communication")}
            className='flex items-center space-x-2'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Back to Events</span>
          </Button>
          <div className='h-6 w-px bg-gray-300' />
          <div className='flex items-center space-x-2'>
            <div
              className='w-4 h-4 rounded-full flex-shrink-0'
              style={{ backgroundColor: event.color }}
            />
            <span className='text-sm text-gray-600'>Event Details</span>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            onClick={() => setIsEditModalOpen(true)}
            className='flex items-center space-x-2'
          >
            <Edit className='h-4 w-4' />
            <span>Edit</span>
          </Button>
          <Button
            variant='destructive'
            onClick={handleDeleteEvent}
            disabled={isDeleting}
            className='flex items-center space-x-2'
          >
            {isDeleting ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              <Trash2 className='h-4 w-4' />
            )}
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </Button>
        </div>
      </div>

      {/* Event Content */}
      <div className='space-y-6'>
        {/* Main Info Card */}
        <Card>
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div>
                <CardTitle className='text-2xl font-bold text-gray-900 mb-2'>
                  {event.title}
                </CardTitle>
                {event.description && (
                  <p className='text-gray-600 leading-relaxed'>
                    {event.description}
                  </p>
                )}
              </div>
              <div className='flex items-center space-x-2'>
                {event.isPublic && (
                  <Badge
                    variant='secondary'
                    className='flex items-center space-x-1'
                  >
                    <Globe className='h-3 w-3' />
                    <span>Public</span>
                  </Badge>
                )}
                {event.isRecurring && (
                  <Badge
                    variant='outline'
                    className='flex items-center space-x-1'
                  >
                    <RefreshCw className='h-3 w-3' />
                    <span>Recurring</span>
                  </Badge>
                )}
                {event.isAllDay && <Badge variant='secondary'>All Day</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Date and Time */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-center space-x-3'>
                <div className='flex-shrink-0'>
                  <CalendarIcon className='h-5 w-5 text-gray-400' />
                </div>
                <div>
                  <p className='font-medium text-gray-900'>
                    {format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className='text-sm text-gray-600'>Event Date</p>
                </div>
              </div>

              {!event.isAllDay && (event.startTime || event.endTime) && (
                <div className='flex items-center space-x-3'>
                  <div className='flex-shrink-0'>
                    <Clock className='h-5 w-5 text-gray-400' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {event.startTime &&
                        format(
                          new Date(`2000-01-01T${event.startTime}`),
                          "h:mm a"
                        )}
                      {event.startTime && event.endTime && " - "}
                      {event.endTime &&
                        format(
                          new Date(`2000-01-01T${event.endTime}`),
                          "h:mm a"
                        )}
                    </p>
                    <p className='text-sm text-gray-600'>Time</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location and Attendees */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {event.location && (
                <div className='flex items-center space-x-3'>
                  <div className='flex-shrink-0'>
                    <MapPin className='h-5 w-5 text-gray-400' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {event.location}
                    </p>
                    <p className='text-sm text-gray-600'>Location</p>
                  </div>
                </div>
              )}

              {event.maxAttendees && (
                <div className='flex items-center space-x-3'>
                  <div className='flex-shrink-0'>
                    <Users className='h-5 w-5 text-gray-400' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {event.maxAttendees} people
                    </p>
                    <p className='text-sm text-gray-600'>Maximum Attendees</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reminder */}
            {event.reminder && event.reminder !== "0" && (
              <div className='flex items-center space-x-3'>
                <div className='flex-shrink-0'>
                  <Bell className='h-5 w-5 text-gray-400' />
                </div>
                <div>
                  <p className='font-medium text-gray-900'>
                    {event.reminder === "5" && "5 minutes before"}
                    {event.reminder === "15" && "15 minutes before"}
                    {event.reminder === "30" && "30 minutes before"}
                    {event.reminder === "60" && "1 hour before"}
                    {event.reminder === "1440" && "1 day before"}
                  </p>
                  <p className='text-sm text-gray-600'>Reminder</p>
                </div>
              </div>
            )}

            {/* Recurring Details */}
            {event.isRecurring && event.recurringType && (
              <div className='flex items-center space-x-3'>
                <div className='flex-shrink-0'>
                  <RefreshCw className='h-5 w-5 text-gray-400' />
                </div>
                <div>
                  <p className='font-medium text-gray-900 capitalize'>
                    {event.recurringType}
                  </p>
                  <p className='text-sm text-gray-600'>Recurring Pattern</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Tag className='h-5 w-5' />
                <span>Tags</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {event.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant='outline' className='text-sm'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Created:</span>
              <span className='font-medium'>
                {format(new Date(event.createdAt || Date.now()), "PPP 'at' p")}
              </span>
            </div>
            {event.updatedAt && (
              <div className='flex justify-between'>
                <span className='text-gray-600'>Last Updated:</span>
                <span className='font-medium'>
                  {format(new Date(event.updatedAt), "PPP 'at' p")}
                </span>
              </div>
            )}
            <div className='flex justify-between'>
              <span className='text-gray-600'>Event ID:</span>
              <span className='font-mono text-sm'>{event.id}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Event Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm
            eventData={event}
            isEdit={true}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetailPage;
