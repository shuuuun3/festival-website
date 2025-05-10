"use client"

import styles from "./timetable_client.module.css";
import { useEffect, useRef, useState } from "react";
import { animateTextByChar } from "@/src/utils/animateTextByChar";

// 日付ボタンの定義をコンポーネントの外に移動
const dateOptions = [
  { label: "20(土)", className: styles.firstDate },
  { label: "21(日)", className: styles.secondDate },
];

// エリアボタンの定義をコンポーネントの外に移動
const areaOptions = [
  { label: "野外ステージ", className: styles.stage },
  { label: "コナコピアホール", className: styles.hole },
  { label: "中庭", className: styles.yard },
  { label: "体育館", className: styles.gym },
];

export default function Timetable_Client({
  serverPart,
}: {
  serverPart: React.ReactNode;
}) {
  const title_Ref = useRef<HTMLHeadingElement>(null);
  // 選択された日付とエリアの状態を管理
  // 初期値は、最初のボタンが選択されている状態などを設定できます
  const [selectedDate, setSelectedDate] = useState<string>("20(土)"); // 日付選択は単一のまま
  const [selectedArea, setSelectedArea] = useState<string[]>([]); // エリア選択を文字列配列に変更
  const isInitialAreaLoadRef = useRef(true); // エリアの初期選択が完了したかのフラグ
  const [maxSelectableAreas, setMaxSelectableAreas] = useState<number>(3); // 初期値はPCサイズ想定

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
      if (width > 1200) {
        setMaxSelectableAreas(3);
      } else if (width > 768) {
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
      setSelectedArea(areaOptions.slice(0, maxSelectableAreas).map(opt => opt.label));
      isInitialAreaLoadRef.current = false;
    } else {
      // リサイズ時など、maxSelectableAreasが変更された後の調整
      setSelectedArea(prevSelected => {
        let newSelected = [...prevSelected];
        if (newSelected.length > maxSelectableAreas) {
          // 選択数が多すぎる場合: 新しい選択を優先して残す (末尾からmaxSelectableAreas個)
          newSelected = newSelected.slice(newSelected.length - maxSelectableAreas);
        } else if (newSelected.length < maxSelectableAreas) {
          // 選択数が少なすぎる場合: 現在の選択を維持しつつ、不足分をareaOptionsから追加
          const currentSelectionSet = new Set(newSelected);
          const needed = maxSelectableAreas - newSelected.length;
          const candidates = areaOptions
            .filter(opt => !currentSelectionSet.has(opt.label))
            .slice(0, needed);
          newSelected.push(...candidates.map(opt => opt.label));
        }
        return newSelected;
      });
    }
  }, [maxSelectableAreas, areaOptions]); // areaOptionsも依存配列に含める

  const handleAreaSelect = (areaLabel: string) => {
    setSelectedArea(prevSelected => {
      const currentIndex = prevSelected.indexOf(areaLabel);
      const newSelectedAreas = [...prevSelected];

      if (currentIndex > -1) { // 既に選択されている場合は解除
        newSelectedAreas.splice(currentIndex, 1);
      } else { // 新規選択の場合
        if (newSelectedAreas.length >= maxSelectableAreas && maxSelectableAreas > 0) {
          newSelectedAreas.shift(); // 最も古い選択を削除
        }
        if (maxSelectableAreas > 0) { // 選択可能な場合のみ追加
          newSelectedAreas.push(areaLabel);
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
                selectedDate === dateOpt.label ? styles.selected : ""
              }`}
              onClick={() => setSelectedDate(dateOpt.label)}
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
                selectedArea.includes(areaOpt.label) ? styles.selected : ""
              }`}
              onClick={() => handleAreaSelect(areaOpt.label)}
            >
              {areaOpt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.serverPart}>
        {serverPart}
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