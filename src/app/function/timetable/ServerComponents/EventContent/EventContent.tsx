// import { prisma } from '@/src/libs/prisma';
// import EventContent_client from "./EventContent_client";

// // 特定のロケーションのイベントデータを取得する関数
// async function getEventsByLocation(location: string) {
//   const events = await prisma.event.findMany({
//     where: { location: location },
//     orderBy: { startDate: "asc" }, // 開始時間順にソート
//   });
//   return events.map((event) => ({
//     id: event.id,
//     title: event.title,
//     subtitle: event.subtitle,
//     description: event.description,
//     startDate: event.startDate,
//     endDate: event.endDate,
//     location: event.location,
//     imageUrl: event.imageUrl,
//   }));
// }

// interface EventContentProps {
//   // locationType を文字列の配列に変更。オプショナルにして、指定がない場合は全ロケーションを表示するなども可能
//   locationTypes?: string[];
// }

// // サーバーコンポーネント
// export default async function EventContent({ locationTypes }: EventContentProps) {
//   let targetLocationTypes = locationTypes;

//   // locationTypes が指定されていない場合、DBからユニークなロケーションを全て取得する
//   if (!targetLocationTypes || targetLocationTypes.length === 0) {
//     const uniqueLocations = await prisma.event.groupBy({
//       by: ['location'],
//       where: {
//         location: {
//           not: null, // nullのロケーションを除外
//         },
//       },
//       orderBy: {
//         location: 'asc', // ロケーション名でソート (任意)
//       }
//     });
//     targetLocationTypes = uniqueLocations.map(item => item.location).filter(Boolean) as string[];
//   }

//   if (!targetLocationTypes || targetLocationTypes.length === 0) {
//     return <div>表示できるイベントデータがありません。</div>;
//   }

//   // 各ロケーションのイベントデータを並行して取得
//   const eventsForLocationsPromises = targetLocationTypes.map(async (locType) => {
//     const events = await getEventsByLocation(locType);
//     return { locationType: locType, events };
//   });

//   const eventsByLocationArray = await Promise.all(eventsForLocationsPromises);

//   return (
//     <>
//       {eventsByLocationArray.map(({ locationType: locType, events }) => (
//         <EventContent_client
//           key={locType} // ユニークなキーとしてロケーション名を使用
//           eventData={events}
//           locationType={locType}
//         />
//       ))}
//     </>
//   );
// }