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

  console.log(`[SeverAction] Querying Prisma for location: ${location}, dateFilter: ${JSON.stringify(dateFilterCondition)}`);
  try {
    const events = await prisma.event.findMany({
      where: {
        location: location,
        ...dateFilterCondition
      },
      orderBy: { startDate: "asc" },
    });
    console.log(`[SeverAction] Found ${events.length} events for location ${location} with current filters.`);
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
  } catch (error) {
    console.error(`[SeverAction] Error fetching events for location ${location}:`, error);
    return []; // エラー時も空配列を返し、処理の継続を試みる
  }
}

export async function getFilteredEvents(selectedDate: string, selectedAreas: string[]): Promise<EventsByLocation[]> {
  console.log(`[SeverAction] getFilteredEvents called with date: "${selectedDate}", areas: "${selectedAreas.join(', ')}"`);
  try {
    const eventsForLocationsPromises = selectedAreas.map(async (locType) => {
      const events = await getEventsByLocationAndDate(locType, selectedDate);
      return { locationType: locType, events };
    });
    const results = await Promise.all(eventsForLocationsPromises);
    console.log(`[SeverAction] Successfully fetched events for all selected areas. Count: ${results.length}`);
    return results;
  } catch (error) {
    console.error(`[SeverAction] Critical error in getFilteredEvents:`, error);
    // クリティカルなエラーの場合、各エリアに空のイベントリストを返す
    return selectedAreas.map(locType => ({ locationType: locType, events: [] }));
  }
}