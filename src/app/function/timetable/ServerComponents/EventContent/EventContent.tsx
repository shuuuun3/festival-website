import { prisma } from '@/src/libs/prisma';
import EventContent_client from "./EventContent_client";

async function getEvents() {
  const events = await prisma.event.findMany({ orderBy: { id: "asc" } });
  return events;
}

// サーバーコンポーネント
export default async function EventContent() {
  const events = await getEvents();
  return <EventContent_client events={events} />;
}