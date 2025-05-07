import { prisma } from '@/src/libs/prisma';
import EventContent_client from "./EventContent_client";

async function getEventData() {
  const eventData = await prisma.event.findMany({ orderBy: { id: "asc" } });
  return eventData.map((event) => ({
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

interface EventContentProps {
  locationType?: string;
}

// サーバーコンポーネント
export default async function EventContent({ locationType }: EventContentProps) {
  const events = await getEventData();
  return <EventContent_client eventData={events} locationType={locationType} />;
}