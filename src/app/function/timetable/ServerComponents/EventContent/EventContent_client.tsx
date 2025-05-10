"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TimeTableContent from "./TimeTableContent/TimeTableContent";
import styles from "./EventContent_client.module.css";

// イベントオブジェクトの型を定義
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

// コンポーネントのプロパティの型を定義
interface EventContentClientProps {
  eventData: EventData[];
  locationType?: string;
}

// location文字列をCSSクラス名に適した形式に変換するヘルパー関数
const formatLocationToClassName = (locationType: string | null): string => {
  if (!locationType) {
    return styles.locationDefault || 'locationDefault'; // CSS Modulesのクラス名またはプレーンなクラス名
  }
  // 例: "ステージA" -> "locationStageA"
  // スペースを除去し、英字の最初の文字を大文字にするなど、適宜調整してください。
  const sanitized = locationType.replace(/\s+/g, ''); // スペース除去
  // CSS Modules を使っている場合、stylesオブジェクト経由でクラス名を取得
  return styles[`location${sanitized}`] || styles.locationDefault || `location${sanitized}`;
};

export default function EventContent_client({ eventData, locationType }: EventContentClientProps) {
  const [currentRow, setCurrentRow] = useState(2); // 初期値はヘッダーの次の行 (2行目)

  useEffect(() => {
    const calculateCurrentRow = () => {
      const now = new Date();
      const startTime = new Date();
      startTime.setHours(9, 30, 0, 0); // 基準時刻 9:30
      const endTime = new Date();
      endTime.setHours(21, 0, 0, 0); // 終了時刻 21:00 (grid-template-rows の 690分 に基づく)

      // 9:30 より前なら最初の行 (ヘッダーの次)
      if (now < startTime) {
        setCurrentRow(2); // ヘッダー行が1行目なので、時間グリッドは2行目から
        return;
      }
      // 21:00 以降なら最後の行の次 (表示範囲外) or 最後の行
      if (now >= endTime) {
        setCurrentRow(690 + 2); // 690分 + ヘッダー行 + 1
        return;
      }

      const diffInMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
      // grid-template-rows の最初の行はヘッダー(60px)なので、計算した分数に +2 する (1始まり + ヘッダー行)
      setCurrentRow(diffInMinutes + 2);
    };

    calculateCurrentRow(); // 初期計算

    // 1分ごとにバーの位置を更新するタイマーを設定
    const intervalId = setInterval(calculateCurrentRow, 60000);

    // コンポーネントがアンマウントされる時にタイマーをクリア
    return () => clearInterval(intervalId);
  }, []); // 空の依存配列で、マウント時にのみ実行

  const locationClassName = formatLocationToClassName(locationType ?? null);

  return (
    <div className={`${styles.wrapper} ${locationClassName}`}>
      <div className={styles.bar} style={{ '--current-row': currentRow } as React.CSSProperties}></div>
      <div className={styles.label}>
        <Link href="">
          <div className={styles.label_inner}>
            {locationType}
          </div>
        </Link>
      </div>
      <div className={styles.box}></div>
      <div className={styles.background}></div>

      <div className={styles.timeText}>9:30</div>
      <div className={styles.timeText}>10:00</div>
      <div className={styles.timeText}>11:00</div>
      <div className={styles.timeText}>12:00</div>
      <div className={styles.timeText}>13:00</div>
      <div className={styles.timeText}>14:00</div>
      <div className={styles.timeText}>15:00</div>
      <div className={styles.timeText}>16:00</div>
      <div className={styles.timeText}>17:00</div>
      <div className={styles.timeText}>18:00</div>
      <div className={styles.timeText}>19:00</div>
      <div className={styles.timeText}>20:00</div>

      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>
      <div className={styles.timeBar}></div>

      <div className={styles.content}>
        {eventData.map(event => (
          <div key={event.id} className={styles.event}>
            <TimeTableContent eventData={event} />
          </div>
        ))}
      </div>
    </div>
  );
}