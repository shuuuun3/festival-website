"use client";

// イベントオブジェクトの型を定義
interface Event {
  id: string | number; // id の型に合わせて string か number にしてください
  title: string | null; // null の可能性を許容
  subtitle: string | null; // 他のフィールドも Prisma の型に合わせる
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  location: string | null;
  imageUrl: string | null;
}

// コンポーネントのプロパティの型を定義
interface EventContentClientProps {
  events: Event[]; // Event 型の配列
}

export default function EventContent_client({ events }: EventContentClientProps) { // props に型を適用
  // クライアント側の処理やUI
  return (
    <ul>
      {events.map(event => (
        <li key={event.id}>{event.title}</li>
      ))}
    </ul>
  );
}