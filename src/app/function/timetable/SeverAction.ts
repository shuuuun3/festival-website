"use server"

import { prisma } from '@/src/libs/prisma';

interface EventData {
  id: number;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  location: string | null;
  imageUrl: string | null;
}

export interface EventsByLocation {
  locationType: string;
  events: EventData[];
}

async function getEventsByLocationAndDate(location: string, dateString?: string): Promise<EventData[]> {
  const eventYear = 2025; // 例: 実際の開催年
  const eventMonth = 8;   // 例: 実際の開催月 (JavaScriptの月は0-11なので、7月は6)

  let dateFilterCondition = {};
  if (dateString) {
    const day = parseInt(dateString, 10);
    if (!isNaN(day)) {
      const startDate = new Date(eventYear, eventMonth - 1, day, 0, 0, 0, 0);
      const endDate = new Date(eventYear, eventMonth - 1, day, 23, 59, 59, 999);
      dateFilterCondition = {
        AND: [
          { startDate: { gte: startDate } },
          { startDate: { lte: endDate } },
        ],
      };
    }
  }

  const events = await prisma.event.findMany({
    where: { location: location, ...dateFilterCondition },
    orderBy: { startDate: "asc" },
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    imageUrl: event.imageUrl,
  }));
}

export async function getFilteredEvents(selectedDate: string, selectedAreas: string[]): Promise<EventsByLocation[]> {
  const eventsForLocationsPromises = selectedAreas.map(async (locType) => {
    const events = await getEventsByLocationAndDate(locType, selectedDate);
    return { locationType: locType, events };
  });
  return Promise.all(eventsForLocationsPromises);
}