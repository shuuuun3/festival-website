"use client"

import styles from "./timetable_client.module.css";
import { useEffect, useRef, useState, useTransition } from "react";
import { animateTextByChar } from "@/src/utils/animateTextByChar"; // AnimateTextByCharParams をインポート
import { getAllEventsForDate, EventsByLocation } from "./SeverAction"; // getFilteredEvents を getAllEventsForDate に変更
import EventContent_client from "./ServerComponents/EventContent/EventContent_client";

// 日付ボタンの定義をコンポーネントの外に移動
const dateOptions = [
  { label: "20(土)", value: "20", className: styles.firstDate },
  { label: "21(日)", value: "21",  className: styles.secondDate },
];

// エリアボタンの定義をコンポーネントの外に移動
const areaOptions = [
  { label: "野外ステージ", value: "野外ステージ", className: styles.stage },
  { label: "コナコピアホール", value: "コナコピアホール", className: styles.hole },
  { label: "中庭", value: "中庭", className: styles.yard },
  { label: "体育館", value: "体育館", className: styles.gym },
];

export default function Timetable_Client() {
  const title_Ref = useRef<HTMLHeadingElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].value); // 初期値をvalueで設定
  const [selectedArea, setSelectedArea] = useState<string[]>([]); // エリア選択を文字列配列に変更
  const [maxSelectableAreas, setMaxSelectableAreas] = useState<number>(3); // 初期値はPCサイズ想定

  // 全日程・全エリアのイベントデータを保持するステート
  const [allEventsData, setAllEventsData] = useState<{[date: string]: EventsByLocation[] | undefined}>({});
  // 現在選択されている日付に基づいて表示するイベントデータ
  const [currentDisplayEvents, setCurrentDisplayEvents] = useState<EventsByLocation[]>([]);
  // 初期データロード中の状態
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // データロードエラーの状態
  const [errorLoading, setErrorLoading] = useState<string | null>(null);
  // 日付変更時のUI更新をスムーズにするためのトランジション
  const [isTransitioningDate, startTransitionDate] = useTransition();

  // イベントの開催年・月 (実際のイベントに合わせて設定してください)
  const EVENT_YEAR = 2025; // 例: 2024年
  const EVENT_MONTH = 9;   // 例: 7月 (JavaScriptの月は0-11なので注意、サーバーアクション側で1-12に調整)

  useEffect(() => {
    if (title_Ref.current) {
      animateTextByChar(title_Ref.current, {
        triggerStart: "top 80%",
        triggerEnd: "top top",
        toggleActions: "play reverse play reverse",
      })
    }
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > (1200 - 1)) {
        setMaxSelectableAreas(3);
      } else if (width > (768 - 1)) {
        setMaxSelectableAreas(2);
      } else {
        setMaxSelectableAreas(1);
      }
    };

    handleResize(); // 初期ロード時にも実行
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 初期データロード: 全日程・全エリアのイベントデータを取得
  useEffect(() => {
    const fetchAllInitialData = async () => {
      setIsInitialLoading(true);
      setErrorLoading(null);
      try {
        const dataPromises = dateOptions.map(dateOpt =>
          getAllEventsForDate(dateOpt.value, areaOptions.map(opt => opt.value), EVENT_YEAR, EVENT_MONTH)
        );
        const results = await Promise.all(dataPromises);
        const newData: {[date: string]: EventsByLocation[]} = {};
        dateOptions.forEach((dateOpt, index) => {
          newData[dateOpt.value] = results[index];
        });
        setAllEventsData(newData);

        // 初期表示エリアを設定
        if (areaOptions.length > 0 && maxSelectableAreas > 0) {
          setSelectedArea(areaOptions.slice(0, maxSelectableAreas).map(opt => opt.value));
        }

      } catch (err) {
        console.error("Failed to fetch initial timetable data:", err);
        setErrorLoading("タイムテーブル情報の読み込みに失敗しました。");
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchAllInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EVENT_YEAR, EVENT_MONTH]); // 初回のみ実行。dateOptions, areaOptions, maxSelectableAreas は変更されない想定

  // 選択された日付、または全データが更新されたら、表示用イベントデータを更新
  useEffect(() => {
    if (selectedDate && allEventsData[selectedDate]) {
      startTransitionDate(() => {
        setCurrentDisplayEvents(allEventsData[selectedDate] || []);
      });
    } else if (selectedDate && !allEventsData[selectedDate] && !isInitialLoading) {
      // データが存在しない場合 (ロード完了後)
      startTransitionDate(() => {
        setCurrentDisplayEvents([]);
      });
    }
  }, [selectedDate, allEventsData, isInitialLoading]);

  // maxSelectableAreas が変更されたときに selectedArea を調整
  useEffect(() => {
    if (isInitialLoading) return; // 初期ロード中はエリア選択の調整をスキップ

    setSelectedArea(prevSelectedAreas => {
      let newSelected = [...prevSelectedAreas];
      if (newSelected.length > maxSelectableAreas) {
        newSelected = newSelected.slice(newSelected.length - maxSelectableAreas);
      } else if (newSelected.length < maxSelectableAreas && newSelected.length < areaOptions.length) {
        const currentSelectionSet = new Set(newSelected);
        const needed = maxSelectableAreas - newSelected.length;
        const candidates = areaOptions
          .filter(opt => !currentSelectionSet.has(opt.value))
          .slice(0, needed);
        newSelected.push(...candidates.map(opt => opt.value));
      }
      // maxSelectableAreas が 0 の場合、選択を空にする
      if (maxSelectableAreas === 0) {
        return [];
      }
      return newSelected;
    });
  }, [maxSelectableAreas, isInitialLoading]);

  const handleDateSelect = (dateValue: string) => {
    setSelectedDate(dateValue);
  };

  const handleAreaSelect = (areaValue: string) => {
    setSelectedArea(prevSelected => {
      const currentIndex = prevSelected.indexOf(areaValue);
      const newSelectedAreas = [...prevSelected];

      if (currentIndex > -1) { // 既に選択されている場合は解除
        newSelectedAreas.splice(currentIndex, 1);
      } else { // 新規選択の場合
        if (newSelectedAreas.length >= maxSelectableAreas && maxSelectableAreas > 0) {
          newSelectedAreas.shift(); // 最も古い選択を削除
        }
        if (maxSelectableAreas > 0) { // 選択可能な場合のみ追加
          newSelectedAreas.push(areaValue);
        }
      }
      return newSelectedAreas;
    });
  };

  return (
    <div className={styles.main}>
      <h2 className={styles.title} ref={title_Ref}>TIME TABLE</h2>

      <div className={styles.selector}>
        <div className={styles.dateSelector}>
          {dateOptions.map((dateOpt) => (
            <button
              key={dateOpt.label}
              className={`${dateOpt.className} ${styles.button} ${
                selectedDate === dateOpt.value ? styles.selected : ""
              }`}
              onClick={() => handleDateSelect(dateOpt.value)}
            >
              {dateOpt.label}
            </button>
          ))}
        </div>
        <div className={styles.areaSelector}>
          {areaOptions.map((areaOpt) => (
            <button
              key={areaOpt.label}
              className={`${areaOpt.className} ${styles.button} ${
                selectedArea.includes(areaOpt.value) ? styles.selected : ""
              }`}
              onClick={() => handleAreaSelect(areaOpt.value)}
              disabled={maxSelectableAreas === 0 && !selectedArea.includes(areaOpt.value)}
            >
              {areaOpt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.eventContentWrapper}>
        {isInitialLoading && <div className={styles.loading}>タイムテーブルを読み込んでいます...</div>}
        {errorLoading && <div className={styles.error}>{errorLoading}</div>}
        {!isInitialLoading && !errorLoading && (
          currentDisplayEvents.length > 0 && currentDisplayEvents.map(({ locationType, events }) => (
            <div
              key={`${selectedDate}-${locationType}`} // 日付とロケーションでユニークなキー
              style={{ display: selectedArea.includes(locationType) ? 'block' : 'none' }}
              className={styles.eventLocationContainer} // 必要に応じてスタイル調整用クラス
            >
              <EventContent_client
                eventData={events}
                locationType={locationType}
              />
            </div>
          ))
        )}
        {/* 日付変更中のトランジション表示 (任意) */}
        {isTransitioningDate && !isInitialLoading && <div className={styles.loadingOverlay}>情報を更新中...</div>}
      </div>
      <div className={styles.wrapper}></div>
    </div>
  );
}