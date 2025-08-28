"use client";

import React from "react";
import { useGetEventsQuery } from "@/redux/api";
import ActivityBoard from "./ActivityBoard";

interface EventType {
  id: string;
  name: string;
  eventDescription: string;
  startDate: string;
  eventColor: string;
}

const ActivityBoardWrapper = () => {
  const { data: eventsData } = useGetEventsQuery({});

  const events = eventsData?.data || [];

  // Sort events by start date and take the next 2 upcoming events
  const upcomingEvents = [...events] // Create a copy to avoid mutating original array
    .sort((a: EventType, b: EventType) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 2);

  const formattedEntries = upcomingEvents.map((event: EventType) => ({
    id: event.id,
    title: event.name,
    description: event.eventDescription,
    date: new Date(event.startDate),
    type: "event",
    icon: "/calendar.svg",
    color: event.eventColor,
  }));

  return <ActivityBoard entries={formattedEntries} />;
};

export default ActivityBoardWrapper;
