"use client";

import EventContent from "@/src/components/timetable/EventContent/EventContent";
import styles from "./page.module.css";
import { useEffect, useRef } from "react";
import { animateTextByChar } from "@/src/utils/animateTextByChar";

export default function Timetable() {
  const title_Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (title_Ref.current) {
      animateTextByChar(title_Ref.current, {
        triggerStart: "top 80%",
      });
    }
  }, []);

  return (
    <div className={styles.main}>
      <h2 className={styles.title} ref={title_Ref}>TIMETABLE</h2>
      <EventContent/>
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