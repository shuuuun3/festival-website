import { prisma } from '@/src/libs/prisma';
import EventContent_client from './EventContent_client';

export default async function EventContent() {
  const events = (await prisma.event.findMany({
    orderBy: { id: "asc" },
  })).map((event) => ({
    ...event,
    title: event.title ?? "",
    subtitle: event.subtitle ?? "",
    description: event.description ?? "",
    startDate: event.startDate ?? new Date(0),
    endDate: event.endDate ?? new Date(0),
    location: event.location ?? "",
    imageUrl: event.imageUrl ?? "",
  }));

  return (
    <EventContent_client events={events} />
  )
}
