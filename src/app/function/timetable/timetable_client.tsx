"use client"

import styles from "./timetable_client.module.css";
import { useEffect, useRef, useState, useTransition } from "react";
import { animateTextByChar } from "@/src/utils/animateTextByChar";
import { getFilteredEvents, EventsByLocation } from "./SeverAction";
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
  const isInitialAreaLoadRef = useRef(true); // エリアの初期選択が完了したかのフラグ
  const [maxSelectableAreas, setMaxSelectableAreas] = useState<number>(3); // 初期値はPCサイズ想定
  const [eventsByLocation, setEventsByLocation] = useState<EventsByLocation[]>([]);
  const [isPending, startTransition] = useTransition(); // サーバーアクションのローディング状態管理

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

  useEffect(() => {
    // areaOptionsが利用可能で、maxSelectableAreasが0より大きい場合のみ実行
    if (areaOptions.length === 0 || maxSelectableAreas <= 0) {
      if (maxSelectableAreas === 0) setSelectedArea([]); // 選択不可なら空にする
      return;
    }

    if (isInitialAreaLoadRef.current) {
      // 初期ロード時: areaOptionsの先頭からmaxSelectableAreas個を選択
      setSelectedArea(areaOptions.slice(0, maxSelectableAreas).map(opt => opt.value));
      isInitialAreaLoadRef.current = false;
    } else {
      // リサイズ時など、maxSelectableAreasが変更された後の調整
      setSelectedArea(prevSelectedAreas => {
        let newSelected = [...prevSelectedAreas];
        if (newSelected.length > maxSelectableAreas) {
          // 選択数が多すぎる場合: 新しい選択を優先して残す (末尾からmaxSelectableAreas個)
          newSelected = newSelected.slice(newSelected.length - maxSelectableAreas);
        } else if (newSelected.length < maxSelectableAreas) {
          // 選択数が少なすぎる場合: 現在の選択を維持しつつ、不足分をareaOptionsから追加
          const currentSelectionSet = new Set(newSelected);
          const needed = maxSelectableAreas - newSelected.length;
          const candidates = areaOptions
            .filter(opt => !currentSelectionSet.has(opt.value))
            .slice(0, needed);
          newSelected.push(...candidates.map(opt => opt.value));
        }
        return newSelected;
      });
    }
  }, [maxSelectableAreas]); // areaOptionsは定数なので依存配列から除外

  // 選択された日付またはエリアが変更されたときにイベントを再取得
  useEffect(() => {
     let isActive = true; // エフェクトがアクティブかどうかを追跡

    if (selectedArea.length > 0 && selectedDate) {
      startTransition(async () => {
        try {
          const data = await getFilteredEvents(selectedDate, selectedArea);
          if (isActive) { // コンポーネント/エフェクトがまだアクティブな場合のみ状態を更新
            setEventsByLocation(data);
          }
        } catch (error) {
          console.error("Failed to fetch events:", error);
          if (isActive) {
            // エラーが発生した場合、イベントリストを空にするか、
            // エラーメッセージを表示するなどの処理を行う
            setEventsByLocation([]);
          }
        }
      });
    } else {
      if (isActive) {
        setEventsByLocation([]); // 選択がない場合は空にする
      }
    }
  return () => {
      isActive = false; // クリーンアップ時にフラグをfalseにし、古い非同期処理の結果を無視
    };
  }, [selectedDate, selectedArea, startTransition]); // startTransitionも依存配列に追加

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
        {isPending && <div className={styles.loading}>Loading...</div>}
        {!isPending && eventsByLocation.length === 0 && selectedArea.length > 0 && <div className={styles.noEvents}>選択された条件に合うイベントはありません。</div>}
        {!isPending && eventsByLocation.map(({ locationType, events }) => (
          <EventContent_client
            key={locationType}
            eventData={events}
            locationType={locationType}
          />
        ))}
      </div>
      <div className={styles.wrapper}></div>
    </div>
  );
}


      // <ul>
      //   {events.map((event) => (
      //     <li key={event.id}>
      //       {event.title} - {event.subtitle} - {event.description} - ({event.startDate?.toString() ?? "日付未定"} - {event.endDate?.toString() ?? "日付未定"}) - {event.location} - {event.imageUrl}
      //     </li>
      //   ))}
      // </ul>