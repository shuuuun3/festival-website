// c:\Users\shunsuke\Desktop\festival-website\src\app\function\timetable\SeverAction.ts
"use server"; // サーバーアクションであることを示す

import { prisma } from '@/src/libs/prisma'; // Prismaクライアントのインポートパスを確認してください

// クライアントと共通の型定義 (必要に応じて別ファイルに切り出すことも検討)
export interface EventDataForClient {
  id: number; // Prismaのidは通常string (cuid, uuid) or number (autoincrement)
  title: string | null;
  subtitle: string | null;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  displayTimeStartTime?: string; // DBに保存された時刻のHH:mm部分 (JSTとして解釈)
  displayTimeEndTime?: string;   // DBに保存された時刻のHH:mm部分 (JSTとして解釈)
  location: string | null;
  imageUrl: string | null;
}

export interface EventsByLocation {
  locationType: string;
  events: EventDataForClient[];
}

// --- 既存の getFilteredEvents は削除またはコメントアウト ---
// export async function getFilteredEvents(date: string, areas: string[]): Promise<EventsByLocation[]> {
//   // ... (既存のロジック)
// }

/**
 * 指定された日付の、指定されたすべてのエリアのイベントデータを取得するサーバーアクション
 * @param targetDate イベントの日付 (例: "20", "21")
 * @param allAreaValues 取得対象のすべてのエリア名の配列
 * @param year イベントの年 (例: 2024)
 * @param month イベントの月 (1-12)
 * @returns EventsByLocation[] 形式のデータ
 */
export async function getAllEventsForDate(
  targetDate: string,
  allAreaValues: string[],
  year: number,
  month: number // 1 (1月) から 12 (12月)
): Promise<EventsByLocation[]> {
  const day = parseInt(targetDate, 10);
  if (isNaN(day)) {
    console.error("Invalid targetDate provided to getAllEventsForDate:", targetDate);
    return [];
  }

  // DBにJSTとして保存されていると仮定し、JSTの00:00と23:59:59.999に対応するDateオブジェクトを作成
  // PrismaはTIMESTAMP WITHOUT TIME ZONEをUTCとして解釈するため、UTCで指定することでDBのJST値と一致させる
  const dateStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - 9 * 60 * 60 * 1000);
  const dateEnd = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999) - 9 * 60 * 60 * 1000);

  const eventsByLocationArray: EventsByLocation[] = [];

  for (const location of allAreaValues) {
    try {
      const eventsFromDb: EventDataForClient[] = await prisma.event.findMany({
        where: {
          location: location,
          AND: [
            { startDate: { lt: dateEnd } },
            { endDate: { gt: dateStart } },
          ],
        },
        orderBy: { startDate: "asc" },
      });

      const formatPreservedTime = (date: Date | null): string | undefined => {
        if (!date) return undefined;
        // DBに 'YYYY-MM-DD HH:MM:SS' (JSTのつもり) で保存されていると仮定。
        // Prismaはこれを Dateオブジェクト 'YYYY-MM-DDTHH:MM:SS.000Z' (UTCのHH:MM)として解釈する。
        // そのため、getUTCHours() と getUTCMinutes() でDBのHH:MM部分を取り出す。
        const d = new Date(date);
        const hours = d.getUTCHours().toString().padStart(2, '0');
        const minutes = d.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const mappedEvents: EventDataForClient[] = eventsFromDb.map((event) => {
        return {
          id: event.id,
          title: event.title,
          subtitle: event.subtitle,
          description: event.description,
          startDate: event.startDate, // 元のDateオブジェクトも保持
          endDate: event.endDate,     // 元のDateオブジェクトも保持
          displayTimeStartTime: formatPreservedTime(event.startDate),
          displayTimeEndTime: formatPreservedTime(event.endDate),
          location: event.location,
          imageUrl: event.imageUrl,
        };
      });

      eventsByLocationArray.push({
        locationType: location,
        events: mappedEvents,
      });
    } catch (error) {
      console.error(`Error fetching events for location ${location} on date ${targetDate} (Y:${year} M:${month}):`, error);
      eventsByLocationArray.push({
        locationType: location,
        events: [],
      });
    }
  }
  return eventsByLocationArray;
}








// "use server"

// import { prisma } from '@/src/libs/prisma';

// interface EventData {
//   id: number;
//   title: string | null;
//   subtitle: string | null;
//   description: string | null;
//   startDate: Date | null;
//   endDate: Date | null;
//   location: string | null;
//   imageUrl: string | null;
// }

// export interface EventsByLocation {
//   locationType: string;
//   events: EventData[];
// }

// async function getEventsByLocationAndDate(location: string, dateString?: string): Promise<EventData[]> {
//   const eventYear = 2025; // 例: 実際の開催年
//   const eventMonth = 8;   // 例: 実際の開催月 (JavaScriptの月は0-11なので、7月は6)

//   let dateFilterCondition = {};
//   if (dateString) {
//     const day = parseInt(dateString, 10);
//     if (!isNaN(day)) {
//       const startDate = new Date(eventYear, eventMonth - 1, day, 0, 0, 0, 0);
//       const endDate = new Date(eventYear, eventMonth - 1, day, 23, 59, 59, 999);
//       dateFilterCondition = {
//         AND: [
//           { startDate: { gte: startDate } },
//           { startDate: { lte: endDate } },
//         ],
//       };
//     }
//   }

//   try {
//     const events = await prisma.event.findMany({
//       where: {
//         location: location,
//         ...dateFilterCondition
//       },
//       orderBy: { startDate: "asc" },
//     });
//     return events.map((event) => ({
//       id: event.id,
//       title: event.title,
//       subtitle: event.subtitle,
//       description: event.description,
//       startDate: event.startDate,
//       endDate: event.endDate,
//       location: event.location,
//       imageUrl: event.imageUrl,
//     }));
//   } catch (error) {
//     console.error(`[SeverAction] Error fetching events for location ${location}:`, error);
//     return []; // エラー時も空配列を返し、処理の継続を試みる
//   }
// }

// export async function getFilteredEvents(selectedDate: string, selectedAreas: string[]): Promise<EventsByLocation[]> {
//   try {
//     const eventsForLocationsPromises = selectedAreas.map(async (locType) => {
//       const events = await getEventsByLocationAndDate(locType, selectedDate);
//       return { locationType: locType, events };
//     });
//     const results = await Promise.all(eventsForLocationsPromises);
//     return results;
//   } catch (error) {
//     console.error(`[SeverAction] Critical error in getFilteredEvents:`, error);
//     // クリティカルなエラーの場合、各エリアに空のイベントリストを返す
//     return selectedAreas.map(locType => ({ locationType: locType, events: [] }));
//   }
// }