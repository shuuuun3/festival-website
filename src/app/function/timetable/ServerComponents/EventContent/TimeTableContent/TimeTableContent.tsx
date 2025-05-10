"use client"

import styles from './TimeTableContent.module.css'

interface EventData {
  id: string | number; // id の型に合わせて string か number にしてください
  title: string | null; // null の可能性を許容
  subtitle: string | null; // 他のフィールドも Prisma の型に合わせる
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  location: string | null;
  imageUrl: string | null;
}

const formatTime = (date: Date | null): string => {
  if (!date) {
    return '--:--'; // 日付がない場合のプレースホルダー
  }
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// location文字列をCSSクラス名に適した形式に変換するヘルパー関数
const formatLocationToClassName = (location: string | null): string => {
  if (!location) {
    return styles.locationDefault || 'locationDefault'; // CSS Modulesのクラス名またはプレーンなクラス名
  }
  // 例: "ステージA" -> "locationStageA"
  // スペースを除去し、英字の最初の文字を大文字にするなど、適宜調整してください。
  const sanitized = location.replace(/\s+/g, ''); // スペース除去
  // CSS Modules を使っている場合、stylesオブジェクト経由でクラス名を取得
  return styles[`location${sanitized}`] || styles.locationDefault || `location${sanitized}`;
};

export default function TimeTableContent ({ eventData }: { eventData: EventData }) {

  const locationClassName = formatLocationToClassName(eventData.location);

  return (
    <div className={`${styles.wrapper} ${locationClassName}`}>
        <p className={styles.time}>
          {formatTime(eventData.startDate)} - {formatTime(eventData.endDate)}
        </p>
        <p className={styles.title}>{eventData.title ?? 'タイトルなし'}</p>
    </div>
  )
}